"""도로유형·신호등 수 특성 (뼈대).

신호등: 공공데이터(점 좌표)를 경로 폴리라인에 버퍼 spatial join 해 개수 산출.
⚠️ 지역별 커버리지 편차 있음(R4). 커버리지 낮으면 이 특성은 후순위/제외.
"""


def route_signal_count(route, signals=None) -> int:
    """경로 주변 신호등 개수.

    TODO: 폴리라인 버퍼 내 신호등 점 개수 (shapely spatial join).
    """
    raise NotImplementedError


def route_road_type(route) -> dict:
    """도로유형 구성(고속/국도/시내 비율 등).

    TODO: OSM/Valhalla 도로 분류 매핑.
    """
    raise NotImplementedError
