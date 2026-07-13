"""pairwise 학습셋 조립 — routes.parquet + 합성 프로필 → pairs.parquet.

설계: docs/학습셋_설계.md
- 같은 band(거리대) 내에서 서로 다른 O-D 경로를 짝지어 대조쌍 구성.
- 각 경로쌍 × 여러 합성 프로필 → labeling.pairwise_label 로 소프트 선호 라벨.
"""
import os
import random

import pyarrow as pa
import pyarrow.parquet as pq

from . import labeling
from .features import vectorize
from .profiles import sample_profiles
from .schema import FEATURE_NAMES

_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
PROFILE_FIELDS = ['age', 'gender', 'passenger', 'car_type', 'load_kg', 'car_age']


def load_routes(path) -> list:
    return pq.read_table(path).to_pylist()


def _by_band(routes) -> dict:
    bands = {}
    for r in routes:
        bands.setdefault(r.get('band'), []).append(r)
    return bands


def _is_tradeoff(a, b, eps=1e-3) -> bool:
    """A/B가 성향 축에서 트레이드오프(비지배)인지.

    한 경로가 모든 축에서 우세하면(지배) 선호가 프로필과 무관 → User Tower 붕괴 유발.
    각자 최소 한 축씩 이겨야(축 만족도 차의 부호가 섞여야) 프로필-의존 쌍.
    라벨러(pairwise_label)와 동일한 normalize+project 로 판정해 정합 유지.
    """
    fa = {k: a[k] for k in FEATURE_NAMES}
    fb = {k: b[k] for k in FEATURE_NAMES}
    axes_a, axes_b = (vectorize.project_to_axes(n)
                      for n in vectorize.normalize([fa, fb]))
    diffs = [axes_a[ax] - axes_b[ax] for ax in axes_a]
    return max(diffs) > eps and min(diffs) < -eps


def make_route_pairs(routes, n_pairs, seed=0, tradeoff_only=True) -> list:
    """band별로 서로 다른 O-D 경로쌍을 골고루 n_pairs 개(합) 샘플.

    tradeoff_only=True 면 비지배(트레이드오프) 쌍만 채택 → 프로필-의존 학습 신호 보장.
    """
    rng = random.Random(seed)
    bands = {b: rs for b, rs in _by_band(routes).items() if len(rs) >= 2}
    if not bands:
        return []
    per = max(1, n_pairs // len(bands))
    pairs = []
    for rs in bands.values():
        got, tries = 0, 0
        while got < per and tries < per * 200:
            tries += 1
            a, b = rng.sample(rs, 2)
            if a.get('od_id') == b.get('od_id'):
                continue
            if tradeoff_only and not _is_tradeoff(a, b):
                continue
            pairs.append((a, b))
            got += 1
    return pairs


def _write_parquet(rows, path) -> None:
    if not rows:
        return
    cols = {k: [r.get(k) for r in rows] for k in rows[0].keys()}
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pq.write_table(pa.table(cols), path)


def build_pairwise_dataset(routes_path, out_path, n_pairs=2000, profiles_per_pair=5,
                           profile_pool=500, n_variants=15, seed=0) -> list:
    """routes.parquet → pairwise 학습셋(parquet). 한 행: 프로필 + A/B 특성 + y=P(A선호)."""
    routes = load_routes(routes_path)
    pairs = make_route_pairs(routes, n_pairs, seed=seed)
    pool = sample_profiles(profile_pool, seed=seed + 1)
    rng = random.Random(seed + 2)

    rows = []
    for pi, (a, b) in enumerate(pairs):
        fa = {k: a[k] for k in FEATURE_NAMES}
        fb = {k: b[k] for k in FEATURE_NAMES}
        for prof in rng.sample(pool, min(profiles_per_pair, len(pool))):
            y = labeling.pairwise_label(prof, fa, fb, n_variants=n_variants, seed=pi)
            rows.append({
                **{f'p_{k}': prof[k] for k in PROFILE_FIELDS},
                **{f'A_{k}': fa[k] for k in FEATURE_NAMES},
                **{f'B_{k}': fb[k] for k in FEATURE_NAMES},
                'y': y,
            })

    _write_parquet(rows, out_path)
    return rows


if __name__ == '__main__':
    routes_path = os.path.join(_DATA_DIR, 'routes.parquet')
    out = os.path.join(_DATA_DIR, 'pairs.parquet')
    rows = build_pairwise_dataset(routes_path, out, n_pairs=2000, profiles_per_pair=5)
    ys = [r['y'] for r in rows]
    print(f'pairs {len(rows)}행 저장: {out}')
    if ys:
        import statistics as st
        print(f'  y 분포: 평균 {st.mean(ys):.3f}, 0.5 아닌 비율 {sum(1 for y in ys if y not in (0.0,1.0))/len(ys):.2f}')
