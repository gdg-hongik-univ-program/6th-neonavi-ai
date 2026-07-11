"""후보 경로 → 경로 특성 벡터 f 조립 및 정규화 (Phase 1 마무리 단계).

각 features 모듈(curvature/elevation/fuel/toll/road)의 출력을 모아
schema.FEATURE_NAMES 순서의 벡터로 만들고, 후보들 간 비교 가능하도록 정규화한다.
"""
from ..schema import FEATURE_NAMES


def build_feature_vector(route) -> dict:
    """CandidateRoute 하나 → {FEATURE_NAMES: 값} dict.

    TODO: curvature.route_curvature / elevation.route_slope / fuel / toll / road
          호출 결과를 모아 FEATURE_NAMES 키로 채운다.
    """
    raise NotImplementedError


def normalize(vectors: list) -> list:
    """후보 경로 특성 벡터 리스트를 min-max(또는 z-score) 정규화.

    후보 간 상대 비교가 목적이므로 후보 집합 내에서 스케일링한다.
    TODO: FEATURE_NAMES 각 축별 정규화 구현.
    """
    raise NotImplementedError
