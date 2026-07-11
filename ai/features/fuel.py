"""경로 예상 유류비 추정 (뼈대).

지도 API가 유류비를 안 주면 거리 + 경사 + 도로유형으로 연료 소모를 추정한다.
⚠️ 추정 자체가 모델링 문제 — 값이 노이즈가 되면 랭킹을 오염시킴(R4). 단순 모델부터.
"""


def route_fuel_cost(route, slope_stat=None) -> float:
    """예상 유류비(원) 또는 연료 소모 지표.

    TODO: 거리·경사·도로유형 기반 연비 추정 → 유가 곱해 비용 산출.
    """
    raise NotImplementedError
