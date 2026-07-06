"""약지도(weak supervision) 라벨링 규칙 (뼈대).

학습 라벨이 없으므로, 학술 근거 기반 규칙(labeling function)으로 합성 라벨을 만든다.
각 규칙은 불완전(약)하며, 여러 규칙을 종합해 확률 라벨로 변환한다(예: Snorkel).

⚠️ 동승자 규칙은 반드시 나이와 결합할 것 (단독 사용 시 근거 충돌).
"""

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
    """모든 LF 적용 → 라벨 투표 리스트 반환 (ABSTAIN 제외).

    TODO: 투표를 확률 라벨로 종합(Snorkel LabelModel 등).
    """
    return [v for lf in LABELING_FUNCTIONS if (v := lf(profile)) is not ABSTAIN]
