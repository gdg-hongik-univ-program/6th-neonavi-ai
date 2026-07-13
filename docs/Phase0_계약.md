# Phase 0 계약 — 특성 세트 & 학습 인터페이스

> 확정: 2026-07-13 · 담당: 안중현(AI) · 이 문서가 합성 데이터 생성·라벨링·모델·서빙의 단일 계약.
> 결정: 특성 세트 = **Max(공공데이터 풀활용 10개)**, 연비 = **추정식**, 학습 타깃 = **pairwise 경로 선호**.

---

## 1. 경로 특성 벡터 f (10개) — `schema.FEATURE_NAMES`

| # | 특성 | 정의/단위 | 소스 | 방향 | 서빙 준비도 |
|---|---|---|---|---|---|
| 1 | distance_km | 총 거리 km | 카카오 `summary.distance` | ↓ | 즉시 |
| 2 | duration_min | 예상 소요시간 min | 카카오 `summary.duration` | ↓ | 즉시 |
| 3 | toll | 통행료 원 | 카카오 `summary.fare.toll` | ↓ | 즉시 |
| 4 | congestion | 정체도 (거리가중 평균) | 카카오 `roads[].traffic_state` | ↓ | 즉시 |
| 5 | turn_count | 회전·교차로 스텝 수 | 카카오 `guides[]` | ↓ | 즉시 |
| 6 | curvature | 곡률(Menger) | 좌표 기하계산 (`curvature.py`) | ↓ | **완료** |
| 7 | slope | 경사 지표 | Open Topo Data DEM | ↓ | 추출 구현 필요(캐싱) |
| 8 | fuel_cost | 예상 유류비 (추정식) | 거리+경사+차종, 에너지공단 CSV 참조 | ↓ | 추정식 구현 필요 |
| 9 | signal_count | 신호등 밀도 개/km | 신호등 표준데이터 spatial join | ↓ | **서빙·임세희 협업** |
| 10 | road_type | 고속도로 비율 0~1 | 국가표준노드링크 ROAD_RANK | ↑(비단조) | **서빙·임세희 협업** |

- **방향 ↓** = 값이 낮을수록 만족도↑. 규칙 투영(`project_to_axes`)의 `1 - 정규값` 가정이 성립.
- **road_type(↑, 비단조)**: 고속도로일수록 빠르지만 통행료↑ → 단순 "낮을수록 좋음" 아님. **규칙(B)에선 중립 처리**, 학습 Route Tower(A)가 상호작용으로 활용.

## 2. 성향 축 매핑 (`PREFERENCE_AXES` = speed, comfort, fuel, safety)

| 축 | 구성 특성 (방향) |
|---|---|
| **speed** | duration↓, congestion↓, signal_count↓, road_type(고속)↑ |
| **comfort** | curvature↓, slope↓, turn_count↓, congestion↓ |
| **fuel**(경제) | fuel_cost↓, distance↓, toll↓ |
| **safety** | curvature↓, slope↓, turn_count↓, signal_count↓ |

> ⚠️ Step 2(vectorize/labeling)에서 확정할 구현 나노:
> (a) signal_count·turn_count 는 거리로 정규화(밀도)해 경로 길이에 불변.
> (b) road_type 부호 처리 — 규칙 투영 제외 or 부호 명시 투영.

## 3. 학습 계약 — pairwise 경로 선호

- **학습 1건**: `(user_profile, route_A_feat[10], route_B_feat[10]) → y ∈ {A선호, B선호}`
- **라벨 소스**: 규칙 스코어러(`recommender/baseline_b`)로 두 경로 점수 비교 → 높은 쪽 선호.
  여러 노이즈 변형 LF(가중치 흔들기) → Snorkel(또는 soft-vote) 확률 라벨.
- **모델 I/O**:
  - User Tower: `프로필 인코딩(~13차원) → 연속 가중치 w(4축, softmax)` — **3모드 분류 아님**
  - Route Tower: `경로특성(10) → 만족도 f(4축)`
  - `score = w · f` · pairwise loss(margin/BPR)
- **데이터 출처**: 100% 오프라인 합성 (프로필 분포 샘플 + 경로 아키타입 샘플). API 비용 0.

## 4. 서빙 vs 학습 분리 (중요)

| | 학습(지금) | 서빙(나중) |
|---|---|---|
| 데이터 | 합성 10차원 벡터 | 실제 카카오 + 공공데이터 → 같은 `vectorize` |
| 외부 의존 | 없음 | 카카오 키, DEM, 공공데이터 CSV/Shapefile |
| 담당 | 안중현 | 안중현(추출기) + 임세희(공공데이터 전처리) |

- signal_count·road_type 추출(9·10)은 **서빙 단계 일** → 지금 모델 트랙을 막지 않음.
- 학습 후 실제 경로 수십 개로 **합성 특성 범위 캘리브레이션**(train-serving skew 방지).

## 5. 미해결/후속
- traffic_state·guide type 코드 의미표 → 카카오 키 발급 후 실제 응답으로 역매핑.
- 신호등 표준데이터 정확한 데이터셋 ID → 임세희 확인.
- road_type 부호/정규화 방식 → Step 2에서 확정.
