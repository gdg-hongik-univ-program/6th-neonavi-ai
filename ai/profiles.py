"""합성 사용자 프로필 생성기 (Phase 4).

실제 사용자 데이터가 없으므로 인구통계 분포에서 프로필을 샘플링해
labeling(규칙)으로 약지도 라벨을 붙이고 Two-Tower 학습 데이터로 쓴다.
schema.UserProfile 과 동일한 필드의 dict 를 반환한다.
"""
import random

from .recommender import weights

GENDERS = ['M', 'F']
PASSENGERS = ['alone', 'family', 'vulnerable', 'friend']
PASSENGER_W = [0.45, 0.25, 0.10, 0.20]
CAR_TYPES = ['sedan', 'suv', 'truck', 'compact']
CAR_TYPE_W = [0.45, 0.30, 0.05, 0.20]


def sample_profile(rng: random.Random) -> dict:
    """분포에서 프로필 1개 샘플."""
    age = int(min(80, max(20, rng.gauss(43, 14))))          # 20~80, 평균 43
    car_type = rng.choices(CAR_TYPES, CAR_TYPE_W)[0]
    # 짐: 대부분 가벼움(지수분포 근사), 화물차는 더 무겁게
    load_kg = min(100.0, rng.expovariate(1 / 12) * (3 if car_type == 'truck' else 1))
    return {
        'age': age,
        'gender': rng.choice(GENDERS),
        'passenger': rng.choices(PASSENGERS, PASSENGER_W)[0],
        'car_type': car_type,
        'load_kg': round(load_kg, 1),
        'car_age': round(rng.uniform(0, 10), 1),
    }


def sample_profiles(n: int, seed: int = 0) -> list:
    """n개의 합성 프로필(dict) 생성. seed 고정으로 재현 가능."""
    rng = random.Random(seed)
    return [sample_profile(rng) for _ in range(n)]
