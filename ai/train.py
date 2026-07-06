"""성향 추론 모델 학습 진입점 (뼈대).

흐름:
  1. 합성 사용자 프로필 생성
  2. labeling.py 로 약지도 라벨 부여
  3. Feature Engineering 으로 경로 특성 생성
  4. TwoTower 학습 (랭킹 loss)
  5. 체크포인트 저장
"""


def main():
    # TODO: 데이터 로드 → 라벨 합성 → 학습 루프
    raise NotImplementedError('학습 파이프라인 구현 예정')


if __name__ == '__main__':
    main()
