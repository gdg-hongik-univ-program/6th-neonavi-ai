"""Two-Tower 성향 추론 모델 학습 (pairwise / 약지도).

흐름:
  1. pairs.parquet 로드 (프로필 + 경로A/B 특성 + y=P(A 선호))
  2. 프로필/특성 인코딩 (encoders.py) + 경로특성 표준화(RouteNormalizer)
  3. train/val/test 분리
  4. TwoTower pairwise 학습 — RankNet 소프트 라벨 loss (BCE on sigmoid(score_A-score_B))
  5. 체크포인트 저장(정규화 통계 포함) + held-out pairwise 정확도(층1 검증)

⚠️ 라벨이 규칙에서 나오므로 held-out 정확도는 '규칙을 학습했다'만 증명(R1).
   '사람과 맞나'는 Phase 3 설문(층2)만이 답. 설계: docs/학습셋_설계.md.

실행: .venv/bin/python -m ai.train
"""
import os

import torch
import torch.nn as nn
import pyarrow.parquet as pq

from .encoders import encode_profile, feature_row, USER_DIM, ROUTE_DIM
from .features import vectorize
from .models.two_tower import TwoTower
from .recommender import weights as rule_weights
from .schema import FEATURE_NAMES, PREFERENCE_AXES

_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
PROFILE_FIELDS = ['age', 'gender', 'passenger', 'car_type', 'load_kg', 'car_age']


def load_pairs(path) -> list:
    return pq.read_table(path).to_pylist()


def _profile_from_row(row) -> dict:
    return {k: row[f'p_{k}'] for k in PROFILE_FIELDS}


def _feat_from_row(row, side) -> dict:
    return {k: row[f'{side}_{k}'] for k in FEATURE_NAMES}


def split_rows(rows, seed=0, val=0.15, test=0.15):
    """재현 가능한 셔플 후 train/val/test 분리."""
    g = torch.Generator().manual_seed(seed)
    perm = torch.randperm(len(rows), generator=g).tolist()
    rows = [rows[i] for i in perm]
    n = len(rows)
    n_test = int(n * test)
    n_val = int(n * val)
    test_r = rows[:n_test]
    val_r = rows[n_test:n_test + n_val]
    train_r = rows[n_test + n_val:]
    return train_r, val_r, test_r


def build_tensors(rows):
    """행 리스트 → (user, routeA, routeB, y, w_rule) 텐서.

    경로특성은 쌍 내 상대 정규화(vectorize.normalize) — 라벨(pairwise_label)이
    같은 방식으로 생성됐으므로 표현 정합. w_rule = 규칙 가중치 증류 앵커.
    """
    users, ra, rb, ys, wr = [], [], [], [], []
    for r in rows:
        prof = _profile_from_row(r)
        na, nb = vectorize.normalize([_feat_from_row(r, 'A'), _feat_from_row(r, 'B')])
        users.append(encode_profile(prof))
        ra.append(feature_row(na))
        rb.append(feature_row(nb))
        ys.append(float(r['y']))
        rw = rule_weights.profile_to_weights(prof)
        wr.append([rw[a] for a in PREFERENCE_AXES])
    return (torch.tensor(users, dtype=torch.float32),
            torch.tensor(ra, dtype=torch.float32),
            torch.tensor(rb, dtype=torch.float32),
            torch.tensor(ys, dtype=torch.float32),
            torch.tensor(wr, dtype=torch.float32))


@torch.no_grad()
def pairwise_accuracy(model, user, ra, rb, y, margin=0.05):
    """결정적 쌍(|y-0.5|>margin)에서 A/B 선호 방향 일치율(층1)."""
    logits = model(user, ra, rb)                    # score_A - score_B
    decisive = (y - 0.5).abs() > margin
    if decisive.sum() == 0:
        return float('nan'), 0
    pred_a = logits[decisive] > 0
    true_a = y[decisive] > 0.5
    acc = (pred_a == true_a).float().mean().item()
    return acc, int(decisive.sum())


def train(pairs_path=None, ckpt_path=None, epochs=60, lr=1e-3,
          batch_size=256, seed=0, weight_decay=1e-5, lambda_w=3.0, verbose=True):
    """lambda_w: User Tower 증류 손실 계수. 순수 pairwise loss 는 w·f 곱만 제약해
    w 가 임의 축으로 붕괴(식별 불가) → 규칙 가중치로 앵커링해 해석가능·안정화."""
    pairs_path = pairs_path or os.path.join(_DATA_DIR, 'pairs.parquet')
    ckpt_path = ckpt_path or os.path.join(_DATA_DIR, 'model_a.pt')

    rows = load_pairs(pairs_path)
    train_r, val_r, test_r = split_rows(rows, seed=seed)

    utr, atr, btr, ytr, wtr = build_tensors(train_r)
    uva, ava, bva, yva, _ = build_tensors(val_r)
    ute, ate, bte, yte, _ = build_tensors(test_r)

    torch.manual_seed(seed)
    model = TwoTower(USER_DIM, ROUTE_DIM)
    opt = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=weight_decay)
    rank_loss = nn.BCEWithLogitsLoss()   # RankNet: 로짓=score차, 타깃=소프트 y
    w_loss = nn.MSELoss()                # 증류: User Tower 출력 → 규칙 가중치

    n = utr.shape[0]
    best_val, best_state = -1.0, None
    for ep in range(1, epochs + 1):
        model.train()
        perm = torch.randperm(n)
        total = 0.0
        for i in range(0, n, batch_size):
            idx = perm[i:i + batch_size]
            opt.zero_grad()
            logits = model(utr[idx], atr[idx], btr[idx])
            w_pred = model.weights(utr[idx])
            loss = rank_loss(logits, ytr[idx]) + lambda_w * w_loss(w_pred, wtr[idx])
            loss.backward()
            opt.step()
            total += loss.item() * len(idx)
        model.eval()
        val_acc, _ = pairwise_accuracy(model, uva, ava, bva, yva)
        if val_acc == val_acc and val_acc > best_val:   # nan 방어
            best_val, best_state = val_acc, {k: v.clone() for k, v in model.state_dict().items()}
        if verbose and (ep % 10 == 0 or ep == 1):
            print(f'  ep{ep:>3}  loss {total / n:.4f}  val_acc {val_acc:.3f}')

    if best_state is not None:
        model.load_state_dict(best_state)

    tr_acc, tr_n = pairwise_accuracy(model, utr, atr, btr, ytr)
    va_acc, va_n = pairwise_accuracy(model, uva, ava, bva, yva)
    te_acc, te_n = pairwise_accuracy(model, ute, ate, bte, yte)

    torch.save({
        'state_dict': model.state_dict(),
        'user_dim': USER_DIM,
        'route_dim': ROUTE_DIM,
        'normalization': 'per_set_minmax',   # 후보집합 내 상대 정규화(vectorize.normalize)
        'feature_names': list(FEATURE_NAMES),
        'axes': list(PREFERENCE_AXES),
        'metrics': {'train': tr_acc, 'val': va_acc, 'test': te_acc},
    }, ckpt_path)

    if verbose:
        print(f'\n체크포인트 저장: {ckpt_path}')
        print(f'  held-out pairwise 정확도(결정적 쌍):')
        print(f'    train {tr_acc:.3f} (n={tr_n})  val {va_acc:.3f} (n={va_n})  test {te_acc:.3f} (n={te_n})')
        print(f'  ⚠️ 규칙 학습 여부(층1)만 증명 — 인간 일치(층2)는 Phase 3 설문.')
    return model, {'train': tr_acc, 'val': va_acc, 'test': te_acc}


def main():
    train()


if __name__ == '__main__':
    main()
