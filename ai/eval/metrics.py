"""평가 지표 (Phase 3 / Phase 6).

일치율(agreement): 모델 top-1 추천이 인간 다수결 정답과 얼마나 일치하는가.
B vs A 를 같은 지표로 비교(Phase 6).
"""


def agreement(predictions, human_labels) -> float:
    """모델 추천 vs 인간 정답 일치율(0~1).

    TODO: top-1 일치 비율 계산.
    """
    raise NotImplementedError
