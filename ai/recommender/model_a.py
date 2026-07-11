"""방안 A — 학습 모델 추천 (Phase 5).

학습된 Two-Tower(또는 pairwise LTR) 체크포인트를 로드해 스코어링한다.
⚠️ 라벨이 규칙에서 나오므로 A의 성능 상한 = 규칙 품질(R1). A의 가치는
   '규칙을 이긴다'가 아니라 미정의 조합 일반화·특성 상호작용·부드러운 스코어.
"""


def load_model(ckpt_path=None):
    """학습된 모델 체크포인트 로드.

    TODO: models.two_tower.TwoTower 인스턴스에 state_dict 로드.
    """
    raise NotImplementedError


def recommend(user_profile, candidate_routes, model=None) -> list:
    """모델 스코어링으로 점수 내림차순 Recommendation 리스트 반환.

    TODO: 프로필/특성 텐서화 → model forward → 랭킹 + reason.
    """
    raise NotImplementedError
