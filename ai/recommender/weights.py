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


def profile_to_weights(profile) -> dict:
    """프로필 → PREFERENCE_AXES 가중치 dict (합=1).

    기본 구현: 모드 판정 → MODE_PRESETS 반환.
    (추후 AHP/퍼지로 연속 가중치로 확장 가능)
    """
    mode = profile_to_mode(profile)
    weights = dict(MODE_PRESETS[mode])
    # 축 순서/누락 방어
    return {axis: float(weights.get(axis, 0.0)) for axis in PREFERENCE_AXES}
