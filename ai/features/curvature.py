"""경로 좌표 시퀀스로부터 곡률(굽이 정도)을 계산한다.

지도 API는 좌표만 주므로, 경로의 '구불구불함'은 여기서 직접 계산한다.
Menger 곡률(연속 세 점의 외접원 반지름 R에 대해 curvature = 1/R)을 사용한다.
"""
import math


def _menger_curvature(p1, p2, p3):
    """세 점 (lng, lat)의 Menger 곡률. 값이 클수록 급커브."""
    # 위경도를 근사 평면좌표(m)로 변환 (소구간이라 근사 허용)
    def to_xy(a, b):
        lng1, lat1 = a
        lng2, lat2 = b
        mlat = math.radians((lat1 + lat2) / 2)
        dx = (lng2 - lng1) * 111_320 * math.cos(mlat)
        dy = (lat2 - lat1) * 110_540
        return dx, dy

    ax, ay = 0.0, 0.0
    bx, by = to_xy(p1, p2)
    cx, cy = to_xy(p1, p3)

    # 삼각형 넓이 (외적)
    area = abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay)) / 2.0
    d1 = math.dist((ax, ay), (bx, by))
    d2 = math.dist((bx, by), (cx, cy))
    d3 = math.dist((ax, ay), (cx, cy))
    if d1 * d2 * d3 == 0:
        return 0.0
    return 4 * area / (d1 * d2 * d3)


def route_curvature(coords):
    """경로 전체의 곡률 지표.

    Args:
        coords: [(lng, lat), ...] 폴리라인 좌표 시퀀스
    Returns:
        {'total': 누적 곡률, 'mean': 평균, 'max': 최대}
    """
    if len(coords) < 3:
        return {'total': 0.0, 'mean': 0.0, 'max': 0.0}
    vals = [
        _menger_curvature(coords[i - 1], coords[i], coords[i + 1])
        for i in range(1, len(coords) - 1)
    ]
    return {
        'total': sum(vals),
        'mean': sum(vals) / len(vals),
        'max': max(vals),
    }
