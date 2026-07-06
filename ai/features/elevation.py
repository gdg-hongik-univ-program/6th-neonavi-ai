"""경로 좌표로부터 경사(오르막) 특성을 계산한다.

지도 API는 고도를 안 주므로 Open Topo Data(무료·무인증)로 좌표별 고도를 받아
인접 점 고도차/거리로 경사를 계산한다.  https://www.opentopodata.org/
"""
import requests

OPENTOPO_URL = 'https://api.opentopodata.org/v1/srtm30m'


def fetch_elevations(coords):
    """좌표 리스트의 고도(m) 조회. (한 요청당 최대 100좌표)

    Args:
        coords: [(lng, lat), ...]
    Returns:
        [고도(m), ...]  (실패 시 예외)
    """
    locations = '|'.join(f'{lat},{lng}' for lng, lat in coords[:100])
    resp = requests.get(OPENTOPO_URL, params={'locations': locations}, timeout=10)
    resp.raise_for_status()
    return [r['elevation'] for r in resp.json()['results']]


def route_slope(coords):
    """경로의 경사 특성 (뼈대).

    TODO: fetch_elevations + Haversine 거리로 구간별 slope(%) 계산 후 집계.
    """
    raise NotImplementedError
