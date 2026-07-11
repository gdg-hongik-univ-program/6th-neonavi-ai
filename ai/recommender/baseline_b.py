"""방안 B — 무학습 추천 (Phase 2, 먼저 완성).

흐름: 프로필 → 가중치 w (weights.py) · 후보 경로 → 특성 f (features/vectorize.py)
      → score = w · f (+ 거리 페널티) → 랭킹 + 추천 이유.
학습이 필요 없어 서비스를 가장 빨리 구동시킨다. A 완성 후에도 fallback 으로 유지.
"""


def recommend(user_profile, candidate_routes) -> list:
    """점수 내림차순 Recommendation 리스트 반환.

    TODO:
      1. weights.profile_to_weights(user_profile) → w
      2. vectorize.build_feature_vector + normalize → 각 경로 f
      3. score = w·f (+ 거리 trade-off), 랭킹
      4. 기여 특성으로 reason 텍스트 생성
    """
    raise NotImplementedError
