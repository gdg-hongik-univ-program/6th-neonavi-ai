"""후보 경로 → 경로 특성 벡터 → 성향 축 투영 (Phase 1 마무리 + B의 'RouteTower').

3단계:
  1. build_feature_vector: 경로 → 원시 특성 dict (schema.FEATURE_NAMES)
  2. normalize:            후보 집합 내 min-max 정규화 (후보 간 상대 비교)
  3. project_to_axes:      정규 특성 → 성향 축(PREFERENCE_AXES) 만족도

방안 B는 여기 project_to_axes 를 '손으로 짠 투영'으로 쓰고,
방안 A는 이 투영을 Two-Tower RouteTower 로 '학습'해 대체한다(R1 프레이밍).
"""
from ..schema import FEATURE_NAMES, PREFERENCE_AXES
from . import curvature

# 원시 특성은 모두 '낮을수록 좋음' → 만족도 = 1 - 정규값.
# 각 성향 축이 어떤 특성으로 구성되는지 (관련 특성들의 만족도 평균).
AXIS_FEATURES = {
    'speed':   ('duration_min',),
    'comfort': ('curvature', 'slope'),
    'fuel':    ('fuel_cost', 'distance_km'),
    'safety':  ('curvature', 'slope', 'signal_count'),
}


def _get(obj, key, default=0.0):
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


def build_feature_vector(route) -> dict:
    """CandidateRoute → {FEATURE_NAMES: 원시값}.

    외부 데이터가 필요한 slope/fuel_cost/signal_count 는 아직 0.0 placeholder.
    (elevation/fuel/road 모듈 구현되면 여기서 호출해 채운다)
    """
    coords = _get(route, 'coords', []) or []
    curv = curvature.route_curvature(coords)['mean'] if len(coords) >= 3 else 0.0
    return {
        'distance_km':  float(_get(route, 'distance_km', 0.0)),
        'duration_min': float(_get(route, 'duration_min', 0.0)),
        'curvature':    float(curv),
        'slope':        0.0,   # TODO: elevation.route_slope(coords)
        'fuel_cost':    0.0,   # TODO: fuel.route_fuel_cost(route)
        'toll':         float(_get(route, 'toll', 0.0)),
        'signal_count': 0.0,   # TODO: road.route_signal_count(route)
    }


def normalize(vectors: list) -> list:
    """특성 벡터 리스트를 특성별 min-max 정규화([0,1]).

    후보 간 상대 비교가 목적. 분산 0(모두 같은 값/placeholder)인 특성은 0.5(중립)로.
    """
    if not vectors:
        return []
    out = [dict() for _ in vectors]
    for name in FEATURE_NAMES:
        vals = [v.get(name, 0.0) for v in vectors]
        lo, hi = min(vals), max(vals)
        span = hi - lo
        for i, val in enumerate(vals):
            out[i][name] = 0.5 if span == 0 else (val - lo) / span
    return out


def project_to_axes(norm_vec: dict) -> dict:
    """정규 특성(낮을수록 좋음) → 성향 축 만족도(높을수록 좋음).

    축 만족도 = 관련 특성들의 (1 - 정규값) 평균. 관련 특성 없으면 0.5(중립).
    """
    axes = {}
    for axis, feats in AXIS_FEATURES.items():
        sats = [1.0 - norm_vec.get(f, 0.5) for f in feats]
        axes[axis] = sum(sats) / len(sats) if sats else 0.5
    return {a: axes.get(a, 0.5) for a in PREFERENCE_AXES}


def routes_to_axis_vectors(routes: list) -> list:
    """편의 함수: 후보 경로 리스트 → 각 경로의 축 만족도 dict 리스트."""
    feats = [build_feature_vector(r) for r in routes]
    norms = normalize(feats)
    return [project_to_axes(n) for n in norms]
