"""경로별 예상 연료 소비 추정 — 표준차 기준(차종 무관, 경로 비교용).

경로 특성 fuel_cost 는 '표준차가 이 경로를 달릴 때의 상대 연료 소비'다.
경로끼리 비교가 목적이라 기준차 하나로 통일하면 충분(Route Tower는 프로필/차종을 못 봄).
사용자에게 보여줄 실제 기름값은 서빙 단계에서 차종(에너지공단 연비 CSV)·유가로 별도 계산.

⚠️ 추정 자체가 모델링 문제 — 노이즈면 랭킹 오염(R4). 단순 모델부터.
설계: docs/Phase0_계약.md (4-1)
"""

BASE_L_PER_KM = 0.08       # 표준차 기본 소비 ~12.5 km/L
CONGESTION_PENALTY = 0.4   # 정체(=1.0) 시 최대 +40% (stop-and-go)
CLIMB_L_PER_100M = 0.05    # 누적 상승고도 100m 당 추가 연료(L) 근사


def _get(obj, key, default=0.0):
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


def estimate_fuel(distance_km: float, congestion: float = 0.0, climb_m: float = 0.0) -> float:
    """표준차 예상 연료 소비(L 근사). 경로 비교용 상대지표.

    = 거리 × 기본소비 × (1 + 정체페널티·congestion) + 누적상승 추가연료.
    congestion: 0(원활)~1(정체), climb_m: 총 상승고도(m).
    """
    base = distance_km * BASE_L_PER_KM * (1.0 + CONGESTION_PENALTY * congestion)
    climb = (climb_m / 100.0) * CLIMB_L_PER_100M
    return base + climb


def route_fuel_cost(route, congestion: float = 0.0, climb_m: float = 0.0) -> float:
    """CandidateRoute → 표준차 예상 연료 소비.

    congestion·climb_m 은 vectorize 에서 이미 계산한 값을 넘겨받아 중복 계산을 피한다.
    """
    return estimate_fuel(float(_get(route, 'distance_km', 0.0)), congestion, climb_m)
