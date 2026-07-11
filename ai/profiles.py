"""합성 사용자 프로필 생성기 (Phase 4).

실제 사용자 데이터가 없으므로 인구통계 분포에서 프로필을 샘플링해
labeling.py 로 약지도 라벨을 붙이고 Two-Tower 학습 데이터로 쓴다.
"""


def sample_profiles(n: int, seed: int = 0) -> list:
    """n개의 합성 UserProfile(dict) 생성.

    TODO: 나이·성별·동승자·차종·짐·연식을 현실적 분포로 샘플링.
    """
    raise NotImplementedError
