"""프로필·경로특성 → 텐서 입력 인코딩 (학습·추론 공용).

Two-Tower 의 두 입력을 만드는 단일 지점. train.py 와 recommender/model_a.py 가
같은 인코딩을 써야 체크포인트가 일관되므로 여기서 한 번만 정의한다.

- encode_profile: 프로필 dict → User Tower 입력 벡터(범주형 one-hot + 수치 스케일)
- feature_row: 특성 dict → FEATURE_NAMES 순서 리스트.

경로특성 정규화는 후보집합 내 상대 정규화(features.vectorize.normalize)를 학습·추론
양쪽에서 동일하게 사용한다(라벨 생성과 표현 정합). 별도 전역 정규화 통계는 두지 않는다.
"""
from .schema import FEATURE_NAMES

# 범주형 어휘 (profiles.py / schema.py 와 일치)
GENDERS = ['M', 'F']
PASSENGERS = ['alone', 'family', 'vulnerable', 'friend']
CAR_TYPES = ['sedan', 'suv', 'truck', 'compact']

# User Tower 입력 차원 = age(1)+gender(2)+passenger(4)+car_type(4)+load(1)+car_age(1)
USER_DIM = 1 + len(GENDERS) + len(PASSENGERS) + len(CAR_TYPES) + 1 + 1
ROUTE_DIM = len(FEATURE_NAMES)


def _get(p, key, default=None):
    return p.get(key, default) if isinstance(p, dict) else getattr(p, key, default)


def _one_hot(value, vocab):
    return [1.0 if value == v else 0.0 for v in vocab]


def encode_profile(profile) -> list:
    """프로필(dict/dataclass) → USER_DIM 실수 벡터. 수치는 대략 [0,1] 스케일."""
    age = float(_get(profile, 'age', 43) or 43)
    load_kg = float(_get(profile, 'load_kg', 0.0) or 0.0)
    car_age = float(_get(profile, 'car_age', 0.0) or 0.0)
    return (
        [age / 100.0]
        + _one_hot(_get(profile, 'gender'), GENDERS)
        + _one_hot(_get(profile, 'passenger', 'alone'), PASSENGERS)
        + _one_hot(_get(profile, 'car_type', 'sedan'), CAR_TYPES)
        + [min(load_kg, 100.0) / 100.0]
        + [min(car_age, 10.0) / 10.0]
    )


def feature_row(feat: dict) -> list:
    """특성 dict → FEATURE_NAMES 순서의 원시값 리스트."""
    return [float(feat.get(k, 0.0)) for k in FEATURE_NAMES]
