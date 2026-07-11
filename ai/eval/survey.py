"""인간 선호 설문 시나리오 생성/집계 (Phase 3).

자기선호형: 응답자가 본인 프로필 + 선호 경로를 고른다(페르소나 종속 안 함).
경로는 정적 지도만으론 판단이 어려우니 특성 요약(곡률/경사/시간 등)을 함께 제시(R3).
"""


def build_scenarios(n: int) -> list:
    """설문용 시나리오(프로필 + 후보 경로 2~3개 + 특성 요약) 생성.

    TODO: 구글폼에 넣을 시나리오 세트 구성.
    """
    raise NotImplementedError


def aggregate_responses(responses) -> dict:
    """응답 집계 → 시나리오별 다수결 '인간 정답'.

    TODO: 응답 파싱 → majority vote.
    """
    raise NotImplementedError
