"""방안 A — 학습 모델 추천.

학습된 Two-Tower 체크포인트(ai/data/model_a.pt)를 로드해 후보 경로를 스코어링한다.
score = w · f (w=User Tower 성향 가중치, f=Route Tower 축 만족도).

⚠️ 라벨이 규칙에서 나오므로 A의 성능 상한 = 규칙 품질(R1). A의 가치는
   '규칙을 이긴다'가 아니라 미정의 조합 일반화·특성 상호작용·부드러운 스코어.
baseline_b 와 동일한 Recommendation 을 반환해 서빙에서 교체 가능.
"""
import os

import torch

from ..schema import Recommendation, PREFERENCE_AXES
from ..features import vectorize
from ..encoders import encode_profile, feature_row
from ..models.two_tower import TwoTower

_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
_DEFAULT_CKPT = os.path.join(_DATA_DIR, 'model_a.pt')

AXIS_KOR = {'sports': '스포티한 주행', 'comfort': '편안함', 'fuel': '경제성', 'safety': '안전'}


class LoadedModel:
    """체크포인트 1개를 감싼 추론 핸들."""

    def __init__(self, model):
        self.model = model


def load_model(ckpt_path=None) -> LoadedModel:
    """학습된 Two-Tower 체크포인트 로드."""
    ckpt_path = ckpt_path or _DEFAULT_CKPT
    ckpt = torch.load(ckpt_path, map_location='cpu', weights_only=False)
    model = TwoTower(ckpt['user_dim'], ckpt['route_dim'])
    model.load_state_dict(ckpt['state_dict'])
    model.eval()
    return LoadedModel(model)


def _route_id(route, idx):
    rid = route.get('id') if isinstance(route, dict) else getattr(route, 'id', None)
    return rid if rid is not None else f'route_{idx}'


def _reason(w: dict, f: dict) -> str:
    prio = max(w, key=w.get)
    strong = max(f, key=f.get)
    p, s = AXIS_KOR.get(prio, prio), AXIS_KOR.get(strong, strong)
    if prio == strong:
        return f'{p}을(를) 중시하는 성향에 잘 맞는 경로'
    return f'{p} 우선 성향 기준 상위 (특히 {s}이(가) 우수)'


@torch.no_grad()
def recommend(user_profile, candidate_routes, model=None, enrich=False) -> list:
    """모델 스코어링으로 점수 내림차순 Recommendation 리스트 반환.

    candidate_routes: CandidateRoute/dict 리스트. 원시특성은 vectorize 로 추출.
    """
    if not candidate_routes:
        return []
    handle = model or load_model()
    m = handle.model

    # 학습과 동일: 후보집합 내 상대 정규화(vectorize.normalize)
    feats = [vectorize.build_feature_vector(r, enrich=enrich) for r in candidate_routes]
    norms = vectorize.normalize(feats)
    user_x = torch.tensor([encode_profile(user_profile)], dtype=torch.float32)
    route_x = torch.tensor([feature_row(n) for n in norms], dtype=torch.float32)

    w = m.weights(user_x)[0]                       # (4,)
    f = m.satisfaction(route_x)                    # (N, 4)
    scores = (f * w).sum(dim=-1)                   # (N,)
    w_dict = {a: float(w[i]) for i, a in enumerate(PREFERENCE_AXES)}

    recs = []
    for idx, route in enumerate(candidate_routes):
        f_dict = {a: float(f[idx][i]) for i, a in enumerate(PREFERENCE_AXES)}
        recs.append(Recommendation(
            route_id=_route_id(route, idx),
            score=round(float(scores[idx]), 4),
            reason=_reason(w_dict, f_dict),
            features={a: round(v, 3) for a, v in f_dict.items()},
        ))
    recs.sort(key=lambda r: r.score, reverse=True)
    return recs
