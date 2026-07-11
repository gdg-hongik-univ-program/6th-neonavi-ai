"""추천기 패키지.

- baseline_b: 방안 B (무학습, 규칙/가중합) — 먼저 완성해 서비스 구동.
- model_a:    방안 A (약지도 + Two-Tower/LTR) — 이후 고도화.
- weights:    프로필 → 성향 가중치 매핑 (B가 사용).
inference.py 가 둘 중 하나로 디스패치한다.
"""
