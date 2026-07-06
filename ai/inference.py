"""백엔드가 호출하는 추론 인터페이스 (뼈대).

backend/apps/routes/views.py 의 recommend 뷰가 이 함수를 호출한다.
"""


def recommend_routes(user_profile: dict, candidate_routes: list) -> list:
    """사용자 성향에 맞춰 후보 경로를 스코어링·랭킹한다.

    Args:
        user_profile: {age, gender, passenger, car_type, load_kg, car_age}
        candidate_routes: 지도 API 후보 경로 리스트 (좌표·거리·통행료 등)
    Returns:
        점수 내림차순 정렬된 경로 리스트. 각 항목에 score·reason 포함.
    """
    # TODO: Feature Engineering → 모델(또는 가중합) 스코어링 → 정렬 + 추천 이유 생성
    raise NotImplementedError
