"""경로 통행료 특성 (뼈대).

우선 지도 API 응답의 통행료 필드를 사용. 없거나 부정확하면 한국도로공사 데이터로 보완.
"""


def route_toll(route) -> float:
    """통행료(원).

    TODO: route.toll 우선 사용, 필요 시 톨게이트 매칭으로 보완.
    """
    raise NotImplementedError
