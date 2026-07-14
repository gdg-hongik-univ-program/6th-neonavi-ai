"""방안 B 조기 sanity 유닛테스트 (Phase 2, R9).

설문 전에 '명백한 케이스'로 GIGO를 조기 검출한다. 규칙/특성/투영이 상식과 맞는지 확인.
"""
from ai.recommender import baseline_b

# 급커브(굽이 많음) 경로 — 빠르지만 불편
CURVY = {'id': 'curvy',
         'coords': [(127.0, 37.0), (127.005, 37.004), (127.004, 37.0),
                    (127.009, 37.005), (127.008, 37.0)],
         'distance_km': 10.0, 'duration_min': 12.0, 'toll': 0.0}
# 완만한 직선 경로 — 조금 느리지만 편안
SMOOTH = {'id': 'smooth',
          'coords': [(127.0, 37.0), (127.01, 37.0), (127.02, 37.0), (127.03, 37.0)],
          'distance_km': 10.5, 'duration_min': 15.0, 'toll': 0.0}


def _top(profile, routes):
    return baseline_b.recommend(profile, routes)[0].route_id


def test_vulnerable_passenger_avoids_curvy_route():
    """노약자 동반(comfort 성향)은 급커브 경로를 1순위로 추천하지 않아야 한다."""
    profile = {'age': 65, 'gender': 'F', 'passenger': 'vulnerable',
               'car_type': 'sedan', 'load_kg': 0, 'car_age': 3}
    assert _top(profile, [CURVY, SMOOTH]) == 'smooth'


def test_sports_profile_prefers_high_speed_route():
    """스포츠 성향(젊은 남성 단독)은 주행속력(avg_speed)이 높은 경로를 선호해야 한다.

    sports = '빠른 길(최단시간)'이 아니라 '감속 회피/고속 주행'(2026-07-14 정정).
    HWY: 거리 길지만 속력 높음(고속도로형) / LOCAL: 거리 짧지만 속력 낮음(시내).
    """
    hwy = {'id': 'hwy', 'coords': [(127.0, 37.0), (127.1, 37.0), (127.2, 37.0)],
           'distance_km': 24.0, 'duration_min': 18.0, 'toll': 0.0}     # 80 km/h
    local = {'id': 'local', 'coords': [(127.0, 37.0), (127.03, 37.0), (127.06, 37.0)],
             'distance_km': 12.0, 'duration_min': 18.0, 'toll': 0.0}   # 40 km/h
    profile = {'age': 28, 'gender': 'M', 'passenger': 'alone', 'car_type': 'sedan'}
    assert _top(profile, [hwy, local]) == 'hwy'


def test_eco_profile_prefers_shorter_distance():
    """연비 성향은 거리(=연료 프록시)가 짧은 경로를 선호해야 한다."""
    short = {**SMOOTH, 'id': 'short', 'distance_km': 8.0}
    long_ = {**SMOOTH, 'id': 'long', 'distance_km': 16.0}
    profile = {'age': 30, 'gender': 'F', 'passenger': 'alone', 'car_type': 'compact'}
    assert _top(profile, [long_, short]) == 'short'


def test_empty_candidates_returns_empty():
    assert baseline_b.recommend({'age': 40, 'gender': 'M', 'passenger': 'alone',
                                 'car_type': 'sedan'}, []) == []
