# ai/ — 성향 추론 모델 + Feature Engineering

## 파이프라인
```
사용자 프로필 ──► [성향 추론(Two-Tower User Tower)] ──► 성향 가중치 w
경로 좌표    ──► [Feature Engineering] ──► 경로 특성 f (곡률·경사·연비·통행료)
                        │
                        ▼
              [스코어링/랭킹]  Score = w · f  ──► 추천 경로 + 이유
```

## 구성
- `features/` — 경로 좌표·공공데이터로 특성 계산 (곡률·경사 등)
- `models/` — Two-Tower 등 성향 추론 모델
- `labeling.py` — 약지도(weak supervision) 라벨링 규칙
- `train.py` — 모델 학습 진입점
- `inference.py` — 백엔드가 호출하는 추론 함수
- `data/` — 공공데이터 (대용량은 git 제외)

## 방법론
학습 라벨이 없으므로, 학술 근거 기반 규칙으로 라벨을 합성(약지도)해 모델을 학습한다. 평가는 인간 선호 설문(일치율)으로 검증. 자세한 내용은 미션 레포의 기획안 참고.
