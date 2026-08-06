"""경로 추천 파이프라인 — 뷰를 얇게 유지하기 위한 서비스 계층.

흐름: 출발·도착 좌표 확보 → 카카오 후보 pool → 학습모델(model_a) 스코어링 → 응답 정형.

- 모델(model_a.pt)은 프로세스당 1회 로드해 재사용한다(요청마다 로드하면 느림).
- enrich=True: 추천 시점에 공공데이터·DEM 공간조인으로 12특성을 실값으로 채운다.
  (노드링크 STRtree 인덱스는 ai/features/road.py 가 싱글턴+디스크 캐시로 관리)

설계: docs/FE_백엔드_연동_설계.md
"""
from __future__ import annotations

from ai.adapters import kakao
from ai.adapters.geocode import GeocodeError, to_coords
from ai.recommender import model_a
from ai.schema import MODE_PRESETS

# FE 표기 → 모델 계약 값
PASSENGER_KOR = {
    '혼자': 'alone', '가족': 'family', '노약자': 'vulnerable', '친구': 'friend',
}
VALID_PASSENGER = {'alone', 'family', 'vulnerable', 'friend'}
VALID_CAR_TYPE = {'sedan', 'suv', 'truck', 'compact'}

# 자동 추천이 아닐 때, 사용자가 고른 모드를 보여주기 위한 라벨
MODE_LABEL = {'comfort': '편안함', 'sports': '스포티', 'eco': '경제성'}

_MODEL = None


class RecommendError(Exception):
    """추천 실패 (호출자가 4xx/5xx 로 변환)."""


def _get_model():
    """model_a 체크포인트 지연 로드(프로세스당 1회)."""
    global _MODEL
    if _MODEL is None:
        try:
            _MODEL = model_a.load_model()
        except Exception as exc:   # torch 미설치·ckpt 없음 등
            raise RecommendError(f'추천 모델을 불러오지 못했습니다: {exc}') from exc
    return _MODEL


def normalize_passenger(value) -> str:
    """'가족'/'family' 모두 허용 → 모델 계약 값."""
    v = (value or 'alone')
    v = PASSENGER_KOR.get(v, v)
    if v not in VALID_PASSENGER:
        raise RecommendError(f'알 수 없는 동승자 값입니다: {value}')
    return v


def build_model_profile(profile: dict, passenger, load_kg) -> dict:
    """고정 프로필(4) + 여정별 값(2) → 모델 입력 프로필 6필드."""
    if not isinstance(profile, dict):
        raise RecommendError('profile 이 필요합니다.')
    try:
        age = int(profile['age'])
    except (KeyError, TypeError, ValueError):
        raise RecommendError('profile.age 가 필요합니다(숫자).')

    car_type = profile.get('car_type', 'sedan')
    if car_type not in VALID_CAR_TYPE:
        raise RecommendError(f'알 수 없는 차종입니다: {car_type}')

    gender = profile.get('gender', 'M')
    if gender not in ('M', 'F'):
        raise RecommendError(f'알 수 없는 성별입니다: {gender}')

    try:
        load = float(load_kg or 0)
        car_age = float(profile.get('car_age', 0) or 0)
    except (TypeError, ValueError):
        raise RecommendError('load_kg·car_age 는 숫자여야 합니다.')

    return {
        'age': age,
        'gender': gender,
        'passenger': normalize_passenger(passenger),
        'car_type': car_type,
        'load_kg': max(0.0, min(load, 100.0)),
        'car_age': max(0.0, min(car_age, 10.0)),
    }


def _title(rank: int, auto_recommend: bool, mode: str) -> str:
    if rank == 0:
        return '✨ 너네비추천' if auto_recommend else f'✨ {MODE_LABEL.get(mode, mode)} 추천'
    return f'대안 경로 {rank}'


def recommend(payload: dict) -> dict:
    """추천 요청 dict → {origin, destination, routes[...]}."""
    profile = payload.get('profile')
    model_profile = build_model_profile(
        profile, payload.get('passenger'), payload.get('load_kg'))

    mode = (payload.get('mode') or 'comfort').lower()
    if mode not in MODE_PRESETS:
        raise RecommendError(f'알 수 없는 모드입니다: {mode}')
    auto_recommend = bool(payload.get('auto_recommend', True))

    # 1. 좌표 확보 (문자열이면 지오코딩)
    try:
        origin, origin_name = to_coords(payload.get('origin'))
        destination, dest_name = to_coords(payload.get('destination'))
    except GeocodeError as exc:
        raise RecommendError(str(exc)) from exc

    # 2. 후보 경로 pool (서빙 모드: 과도한 우회 제외 + 상위 N)
    pool = kakao.fetch_pool(origin, destination, mode='serve')
    if not pool:
        raise RecommendError('경로를 찾지 못했습니다. 출발지·도착지를 확인해 주세요.')

    # 3. 학습모델 스코어링 (공공데이터·DEM 특성 포함)
    handle = _get_model()
    try:
        recs = model_a.recommend(model_profile, pool, model=handle, enrich=True)
    except Exception as exc:
        raise RecommendError(f'추천 계산에 실패했습니다: {exc}') from exc

    by_id = {r.id: r for r in pool}
    routes = []
    for rank, rec in enumerate(recs):
        route = by_id.get(rec.route_id)
        if route is None:
            continue
        routes.append({
            'route_id': rec.route_id,
            'title': _title(rank, auto_recommend, mode),
            'reason': rec.reason,
            'score': rec.score,
            'distance_km': round(route.distance_km, 1),
            'duration_min': round(route.duration_min),
            'toll': int(route.toll),
            'axes': rec.features,      # 성향축별 만족도(설명용)
            'bound': route.bound,      # FE 지도 표시용
        })

    return {
        'origin': {'name': origin_name, 'lng': origin[0], 'lat': origin[1]},
        'destination': {'name': dest_name, 'lng': destination[0], 'lat': destination[1]},
        'mode': mode,
        'auto_recommend': auto_recommend,
        'routes': routes,
    }
