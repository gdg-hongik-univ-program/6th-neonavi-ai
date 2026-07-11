"""백엔드가 호출하는 추론 인터페이스 (입구/디스패처).

backend/apps/routes/views.py 의 recommend 뷰가 이 함수를 호출한다.
방안 B(baseline_b, 무학습)를 기본으로 쓰고, A(model_a) 학습이 끝나면 스왑한다.
B는 A 완성 후에도 fallback 으로 유지.
"""
from .recommender import baseline_b, model_a

# 'b' = 무학습(기본), 'a' = 학습 모델
ENGINE = 'b'


def recommend_routes(user_profile: dict, candidate_routes: list) -> list:
    """사용자 성향에 맞춰 후보 경로를 스코어링·랭킹한다.

    Args:
        user_profile: {age, gender, passenger, car_type, load_kg, car_age}
        candidate_routes: 지도 API 후보 경로 리스트 (schema.CandidateRoute 형태)
    Returns:
        점수 내림차순 정렬된 Recommendation 리스트 (score·reason 포함).
    """
    if ENGINE == 'a':
        return model_a.recommend(user_profile, candidate_routes)
    return baseline_b.recommend(user_profile, candidate_routes)
