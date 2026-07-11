"""방안 B 조기 sanity 유닛테스트 (Phase 2, R9).

설문 전에 '명백한 케이스'로 GIGO를 조기 검출한다. 규칙/특성이 상식과 맞는지 확인.
아직 recommend 미구현이라 skip; 구현되면 xfail/skip 해제.
"""
import pytest

from ai.recommender import baseline_b


@pytest.mark.skip(reason="baseline_b.recommend 구현 후 활성화")
def test_vulnerable_passenger_avoids_curvy_route():
    """노약자 동반 프로필은 급커브·급경사 경로를 상위로 추천하지 않아야 한다."""
    profile = {'age': 65, 'gender': 'F', 'passenger': 'vulnerable',
               'car_type': 'sedan', 'load_kg': 0, 'car_age': 3}
    # TODO: 곡률 높은 경로 vs 낮은 경로 후보 구성 → 낮은 쪽이 top-1 인지 검증
    result = baseline_b.recommend(profile, [])
    assert result  # placeholder


@pytest.mark.skip(reason="baseline_b.recommend 구현 후 활성화")
def test_eco_profile_prefers_low_fuel():
    """연비 중시 성향은 유류비 낮은 경로를 선호해야 한다."""
    # TODO
    pass
