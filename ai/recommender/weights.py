"""프로필 → 성향 가중치 w 매핑 (방안 B용).

규칙/AHP로 사용자 프로필을 성향 축(schema.PREFERENCE_AXES) 가중치로 변환한다.
가장 단순하게는 프로필 → 성향 모드(comfort/sports/eco) 판정 후 MODE_PRESETS 사용.
⚠️ 성별·나이 고정관념 리스크(R6): 민감속성 가중치는 낮게, 오버라이드 가능하게 설계.
"""
from ..schema import MODE_PRESETS, PREFERENCE_AXES


def profile_to_mode(profile) -> str:
    """프로필 → 성향 모드('comfort'|'sports'|'eco') 판정.

    TODO: 규칙 기반 판정 (labeling.py 규칙과 정합 유지).
    """
    raise NotImplementedError


def profile_to_weights(profile) -> dict:
    """프로필 → PREFERENCE_AXES 가중치 dict.

    기본 구현: profile_to_mode 로 모드 판정 → MODE_PRESETS 반환.
    필요 시 AHP/퍼지로 연속 가중치 산출.
    """
    raise NotImplementedError
