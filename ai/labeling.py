"""약지도(weak supervision) 라벨링.

학습 라벨이 없으므로 규칙으로 합성 라벨을 만든다. 설계: docs/학습셋_설계.md
- 아래 모드 LF(profile→성향)는 도메인 규칙 문서화용 (weights.py 가 같은 근거 사용).
- 실제 학습 라벨은 pairwise_label: 규칙 스코어러(w·f)를 가중치 노이즈로 흔들어
  '경로 A vs B' 소프트 선호도를 만든다.

⚠️ 동승자 규칙은 반드시 나이와 결합할 것 (단독 사용 시 근거 충돌).
⚠️ R1: 라벨이 규칙에서 나오므로 학습 모델 성능 상한 = 규칙 품질.
"""
import random

from .recommender import weights
from .features import vectorize

ABSTAIN = None
COMFORT, SPORTS, ECO = 'comfort', 'sports', 'eco'


def lf_elderly(profile):
    return COMFORT if profile.get('age', 0) >= 60 else ABSTAIN


def lf_young_male(profile):
    if profile.get('age', 99) < 35 and profile.get('gender') == 'M':
        return SPORTS
    return ABSTAIN


def lf_passenger_with_age(profile):
    # 동승자 + 30세 이상 → comfort (나이와 결합)
    if profile.get('passenger') in ('family', 'vulnerable') and profile.get('age', 0) >= 30:
        return COMFORT
    return ABSTAIN


LABELING_FUNCTIONS = [lf_elderly, lf_young_male, lf_passenger_with_age]


def apply_labeling_functions(profile):
    """모든 모드 LF 적용 → 라벨 투표 리스트 반환 (ABSTAIN 제외)."""
    return [v for lf in LABELING_FUNCTIONS if (v := lf(profile)) is not ABSTAIN]


# ── pairwise 소프트 라벨 (실제 학습 라벨) ──────────────────────────

def _score(w: dict, axes: dict) -> float:
    return sum(w[a] * axes[a] for a in w)


def _perturb_weights(w: dict, rng: random.Random, sigma: float) -> dict:
    """가중치에 가우시안 노이즈 후 재정규화(합=1) → 규칙 변형 LF."""
    noisy = {a: max(0.0, v + rng.gauss(0, sigma)) for a, v in w.items()}
    total = sum(noisy.values()) or 1.0
    return {a: v / total for a, v in noisy.items()}


def pairwise_label(profile, feat_a, feat_b, n_variants: int = 15,
                   sigma: float = 0.15, seed: int = 0) -> float:
    """(프로필, 경로A특성, 경로B특성) → 소프트 라벨 P(A 선호), 0~1.

    규칙 스코어러 score=w·f 를 가중치 노이즈로 N번 흔들어 A>B 투표 비율.
    feat_a/feat_b: FEATURE_NAMES 키의 원시 특성 dict. 좌표 불필요.
    """
    base_w = weights.profile_to_weights(profile)
    axes_a, axes_b = (vectorize.project_to_axes(n)
                      for n in vectorize.normalize([feat_a, feat_b]))
    rng = random.Random(seed)
    votes_a = 0
    for _ in range(n_variants):
        w = _perturb_weights(base_w, rng, sigma)
        if _score(w, axes_a) > _score(w, axes_b):
            votes_a += 1
    return votes_a / n_variants
