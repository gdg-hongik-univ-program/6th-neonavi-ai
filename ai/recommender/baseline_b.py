"""방안 B — 무학습 추천 (Phase 2, 먼저 완성).

흐름: 프로필 → 가중치 w (weights) · 후보 경로 → 축 만족도 f (features.vectorize)
      → score = w · f → 랭킹 + 추천 이유.
학습이 필요 없어 서비스를 가장 빨리 구동. A 완성 후에도 fallback 으로 유지.
"""
from ..schema import Recommendation
from ..features import vectorize
from . import weights

AXIS_KOR = {'sports': '스포티한 주행', 'comfort': '편안함', 'fuel': '경제성', 'safety': '안전'}


def _route_id(route, idx):
    rid = route.get('id') if isinstance(route, dict) else getattr(route, 'id', None)
    return rid if rid is not None else f'route_{idx}'


def _reason(mode_axis, axis_sat):
    """추천 이유 문구. 성향 우선 축 + 그 경로에서 가장 강한 축을 언급."""
    best_axis = max(axis_sat, key=axis_sat.get)
    prio = AXIS_KOR.get(mode_axis, mode_axis)
    strong = AXIS_KOR.get(best_axis, best_axis)
    if mode_axis == best_axis:
        return f'{prio}을(를) 중시하는 성향에 잘 맞는 경로'
    return f'{prio} 우선 성향 기준 상위 (특히 {strong}이(가) 우수)'


def recommend(user_profile, candidate_routes) -> list:
    """점수 내림차순 Recommendation 리스트 반환.

    score = Σ w[axis] * f[axis]  (w: 성향 가중치, f: 경로 축 만족도)
    TODO: 거리 trade-off 를 명시적 페널티로 추가할지 검토(현재는 fuel 축에 내포).
    """
    if not candidate_routes:
        return []

    w = weights.profile_to_weights(user_profile)
    mode_axis = max(w, key=w.get)  # 성향이 가장 중시하는 축
    axis_vecs = vectorize.routes_to_axis_vectors(candidate_routes)

    recs = []
    for idx, (route, f) in enumerate(zip(candidate_routes, axis_vecs)):
        score = sum(w[axis] * f[axis] for axis in w)
        recs.append(Recommendation(
            route_id=_route_id(route, idx),
            score=round(score, 4),
            reason=_reason(mode_axis, f),
            features={k: round(v, 3) for k, v in f.items()},
        ))
    recs.sort(key=lambda r: r.score, reverse=True)
    return recs
