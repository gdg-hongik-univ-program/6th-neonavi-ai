"""AI ↔ backend 인터페이스 계약 (Phase 0 산출물).

backend는 아래 dataclass 형태(또는 동일 키의 dict)로 데이터를 주고받는다.
성향 축과 경로 특성 이름을 여기서 단일 정의해 baseline_b / model_a / features 가 공유한다.
"""
from __future__ import annotations

from dataclasses import dataclass, field

# ── 성향 축 (Two-Tower latent 과 정렬: two_tower.py 주석의 [속도, 편안함, 연비, 안전]) ──
PREFERENCE_AXES = ('speed', 'comfort', 'fuel', 'safety')

# ── 경로 특성 벡터 f 의 필드 (features/vectorize.py 가 이 순서로 생성) ──
FEATURE_NAMES = (
    'distance_km',   # 총 거리
    'duration_min',  # 예상 소요시간
    'curvature',     # 곡률(굽이) 지표
    'slope',         # 경사 지표
    'fuel_cost',     # 예상 유류비
    'toll',          # 통행료
    'signal_count',  # 신호등 수
)

# ── 성향 모드 프리셋: 각 축(PREFERENCE_AXES)을 얼마나 중시하는지 (baseline_b 기본값) ──
# 실제 수치는 Phase 2 에서 sanity 테스트로 보정할 것.
MODE_PRESETS: dict[str, dict[str, float]] = {
    'comfort': {'speed': 0.1, 'comfort': 0.6, 'fuel': 0.1, 'safety': 0.2},
    'sports':  {'speed': 0.6, 'comfort': 0.2, 'fuel': 0.1, 'safety': 0.1},
    'eco':     {'speed': 0.1, 'comfort': 0.2, 'fuel': 0.6, 'safety': 0.1},
}


@dataclass
class UserProfile:
    """운전자 입력. (backend DriverProfile 과 1:1)"""
    age: int
    gender: str          # 'M' | 'F'
    passenger: str       # 'alone' | 'family' | 'vulnerable' | 'friend'
    car_type: str        # 'sedan' | 'suv' | 'truck' | 'compact'
    load_kg: float = 0.0   # 0~100
    car_age: float = 0.0   # 0~10


@dataclass
class CandidateRoute:
    """지도 API가 준 후보 경로 1개. backend가 채워서 전달."""
    id: str
    coords: list[tuple[float, float]]   # [(lng, lat), ...] 폴리라인
    distance_km: float
    duration_min: float
    toll: float = 0.0
    guides: list[dict] = field(default_factory=list)  # 턴바이턴 회전 스텝 (Lv2용)


@dataclass
class Recommendation:
    """추천 결과 1건 (점수 내림차순으로 리스트 반환)."""
    route_id: str
    score: float
    reason: str                     # 사람이 읽는 추천 이유
    features: dict = field(default_factory=dict)  # 디버그/설명용 특성값
