"""프로필 → 성향 가중치 w 매핑 (방안 B용).

규칙으로 사용자 프로필을 성향 모드(comfort/sports/eco)로 판정한 뒤
schema.MODE_PRESETS 로 성향 축(PREFERENCE_AXES) 가중치를 만든다.
labeling.py 의 약지도 규칙과 정합을 유지한다(같은 근거 → 같은 판정).

⚠️ 성별·나이 고정관념 리스크(R6): young_male→sports 규칙은 집단 사전확률일 뿐이며
   추후 사용자 오버라이드/민감속성 가중 축소로 완화할 것.
"""
from ..schema import MODE_PRESETS, PREFERENCE_AXES


def _get(profile, key, default=None):
    """dict / dataclass 양쪽 지원."""
    if isinstance(profile, dict):
        return profile.get(key, default)
    return getattr(profile, key, default)


def profile_to_mode(profile) -> str:
    """프로필 → 성향 모드('comfort'|'sports'|'eco') 판정.

    우선순위(강한 근거 → 약한 근거):
      1. 노약자/가족 동승 또는 60세 이상        → comfort (안전·편안 우선)
      2. 화물차 또는 짐 많음(≥50kg)             → comfort (적재 안정성)
      3. 35세 미만 남성 + 단독 운전             → sports  (집단 사전확률, R6)
      4. 그 외                                  → eco     (기본: 경제성)
    """
    age = _get(profile, 'age', 40) or 40
    gender = _get(profile, 'gender')
    passenger = _get(profile, 'passenger', 'alone')
    car_type = _get(profile, 'car_type', 'sedan')
    load_kg = _get(profile, 'load_kg', 0) or 0

    if passenger in ('vulnerable', 'family') or age >= 60:
        return 'comfort'
    if car_type == 'truck' or load_kg >= 50:
        return 'comfort'
    if age < 35 and gender == 'M' and passenger == 'alone':
        return 'sports'
    return 'eco'


# 연속 조정 상수 (초기값·튜닝 대상). 설계: docs/성향가중치_설계.md
COMPACT_FUEL = 0.15     # 경차·소형 선택 = 경제성 지향
CARAGE_FUEL = 0.02      # 오래된 차 유지 = 비용 민감 (×연식, 0~0.2)
COMMUTER_FUEL = 0.05    # 단독+가벼운 짐 = 통근형(연비 누적)
SUV_COMFORT = 0.10      # 큰 차 선택 = 공간·편안 우선(연비 반대신호)
COMMUTER_LOAD_KG = 20   # '가벼운 짐' 기준


def profile_to_weights(profile) -> dict:
    """프로필 → PREFERENCE_AXES 연속 가중치 dict (합=1).

    이산 모드 백본(MODE_PRESETS) + 선택 기반 근거의 연속 조정 → 재정규화.
    조정은 강약(연속 강도)만 더하며 argmax 모드를 뒤집지 않는다. 설계: docs/성향가중치_설계.md.
    ⚠️ 나이·성별이 아닌 차종·연식(본인 선택) 위주 — R6 편향 완화.
    """
    mode = profile_to_mode(profile)
    w = {axis: float(MODE_PRESETS[mode].get(axis, 0.0)) for axis in PREFERENCE_AXES}

    car_type = _get(profile, 'car_type', 'sedan')
    car_age = float(_get(profile, 'car_age', 0) or 0)
    passenger = _get(profile, 'passenger', 'alone')
    load_kg = float(_get(profile, 'load_kg', 0) or 0)

    # ── 연속 조정: 연비(fuel) 적극 근거 + suv 반대신호 ──
    if car_type == 'compact':
        w['fuel'] += COMPACT_FUEL
    w['fuel'] += CARAGE_FUEL * min(car_age, 10.0)
    if passenger == 'alone' and load_kg < COMMUTER_LOAD_KG:
        w['fuel'] += COMMUTER_FUEL
    if car_type == 'suv':
        w['comfort'] += SUV_COMFORT

    # 클립(≥0) 후 합=1 재정규화
    w = {a: max(0.0, v) for a, v in w.items()}
    total = sum(w.values()) or 1.0
    return {a: w[a] / total for a in PREFERENCE_AXES}
