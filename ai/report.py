"""추론 결과 리포트 — 프로필 × O-D 후보경로 → 추천 CSV.

routes.parquet(특성 사전계산, 좌표 없음)에서 같은 O-D의 경로들을 '대안 경로 후보'로,
대표 프로필들에 대해 학습된 Two-Tower(model_a)로 추천을 계산해 CSV 2종 저장:
  - recommendations.csv        : (프로필, O-D) 1행 = 추천 경로 + 추론 성향가중치 + 이유
  - recommendations_detail.csv : (프로필, O-D, 후보) 1행 = 순위·점수·축만족도·특성

⚠️ build_feature_vector 우회(좌표 없으므로) — parquet 의 사전계산 특성을 직접 정규화해 쓴다.
실행: .venv/bin/python -m ai.report
"""
import csv
import os
from collections import defaultdict

import torch
import pyarrow.parquet as pq

from .recommender.model_a import load_model, _reason
from .encoders import encode_profile, feature_row
from .features import vectorize
from .schema import FEATURE_NAMES, PREFERENCE_AXES

_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
PROFILE_FIELDS = ['age', 'gender', 'passenger', 'car_type', 'load_kg', 'car_age']

# 대표 프로필 (성향 유형이 갈리도록 선정)
PROFILES = [
    {'name': '68세 가족동승 여',   'age': 68, 'gender': 'F', 'passenger': 'family',     'car_type': 'sedan',   'load_kg': 0,  'car_age': 5},
    {'name': '70세 노약자동승 남', 'age': 70, 'gender': 'M', 'passenger': 'vulnerable', 'car_type': 'suv',     'load_kg': 0,  'car_age': 7},
    {'name': '45세 트럭 짐80kg',   'age': 45, 'gender': 'M', 'passenger': 'alone',      'car_type': 'truck',   'load_kg': 80, 'car_age': 3},
    {'name': '27세 남 단독',       'age': 27, 'gender': 'M', 'passenger': 'alone',      'car_type': 'compact', 'load_kg': 0,  'car_age': 2},
    {'name': '40세 여 단독',       'age': 40, 'gender': 'F', 'passenger': 'alone',      'car_type': 'sedan',   'load_kg': 0,  'car_age': 4},
    {'name': '33세 여 친구동승',   'age': 33, 'gender': 'F', 'passenger': 'friend',     'car_type': 'suv',     'load_kg': 10, 'car_age': 1},
    {'name': '강eco 30 경차8년단독', 'age': 30, 'gender': 'F', 'passenger': 'alone',    'car_type': 'compact', 'load_kg': 5,  'car_age': 8},
    {'name': '약eco 45 세단친구새차', 'age': 45, 'gender': 'F', 'passenger': 'friend',   'car_type': 'sedan',   'load_kg': 10, 'car_age': 1},
]


def _pick_od_sets(routes, per_band=1, min_routes=4):
    """band별로 후보가 많은 O-D를 골라 (od_id, band, [route rows]) 목록 반환."""
    by_od = defaultdict(list)
    for r in routes:
        by_od[r['od_id']].append(r)
    by_band = defaultdict(list)
    for od, rs in by_od.items():
        if len(rs) >= min_routes:
            by_band[rs[0]['band']].append((od, rs))
    picked = []
    for band in sorted(by_band):
        cand = sorted(by_band[band], key=lambda x: -len(x[1]))[:per_band]
        picked.extend((od, band, rs) for od, rs in cand)
    return picked


def _rank(model, profile, routes):
    """저장된 특성으로 후보 경로를 스코어링 → (정렬된 recs, w_dict). recs=[(route, score, f_dict)]."""
    feats = [{k: r[k] for k in FEATURE_NAMES} for r in routes]
    norms = vectorize.normalize(feats)
    user_x = torch.tensor([encode_profile(profile)], dtype=torch.float32)
    route_x = torch.tensor([feature_row(n) for n in norms], dtype=torch.float32)
    with torch.no_grad():
        w = model.weights(user_x)[0]
        f = model.satisfaction(route_x)
    w_dict = {a: float(w[i]) for i, a in enumerate(PREFERENCE_AXES)}
    scored = []
    for i, r in enumerate(routes):
        f_dict = {a: float(f[i][j]) for j, a in enumerate(PREFERENCE_AXES)}
        score = sum(w_dict[a] * f_dict[a] for a in PREFERENCE_AXES)
        scored.append((r, score, f_dict))
    scored.sort(key=lambda x: -x[1])
    return scored, w_dict


def build_report(routes_path=None, ckpt_path=None, out_dir=None, per_band=1):
    routes_path = routes_path or os.path.join(_DATA_DIR, 'routes.parquet')
    out_dir = out_dir or _DATA_DIR
    routes = pq.read_table(routes_path).to_pylist()
    for r in routes:   # 파생특성 avg_speed 채움(재수집 없이)
        r.setdefault('avg_speed', vectorize.avg_speed_kmh(
            float(r.get('distance_km', 0.0)), float(r.get('duration_min', 0.0))))
    model = load_model(ckpt_path).model
    od_sets = _pick_od_sets(routes, per_band=per_band)

    summary_rows, detail_rows = [], []
    for prof in PROFILES:
        for od_id, band, rs in od_sets:
            scored, w = _rank(model, prof, rs)
            top_r, top_score, top_f = scored[0]
            margin = top_score - scored[1][1] if len(scored) > 1 else top_score
            inferred_mode = max(w, key=w.get)

            summary_rows.append({
                'profile': prof['name'],
                **{k: prof[k] for k in PROFILE_FIELDS},
                'od_id': od_id, 'band': band, 'n_candidates': len(rs),
                'inferred_mode': inferred_mode,
                **{f'w_{a}': round(w[a], 3) for a in PREFERENCE_AXES},
                'recommended_route': top_r['route_id'],
                'rec_distance_km': round(top_r['distance_km'], 2),
                'rec_duration_min': round(top_r['duration_min'], 1),
                'rec_toll': int(top_r['toll']),
                'rec_congestion': round(top_r['congestion'], 3),
                'score': round(top_score, 4),
                'margin_vs_2nd': round(margin, 4),
                'reason': _reason(w, top_f),
            })
            for rank, (r, score, f_dict) in enumerate(scored, 1):
                detail_rows.append({
                    'profile': prof['name'], 'od_id': od_id, 'band': band,
                    'rank': rank, 'route_id': r['route_id'],
                    'score': round(score, 4),
                    **{f'sat_{a}': round(f_dict[a], 3) for a in PREFERENCE_AXES},
                    'distance_km': round(r['distance_km'], 2),
                    'duration_min': round(r['duration_min'], 1),
                    'toll': int(r['toll']),
                    'congestion': round(r['congestion'], 3),
                    'turn_count': round(r['turn_count'], 3),
                    'curvature': round(r['curvature'], 4),
                    'slope': round(r['slope'], 3),
                    'fuel_cost': round(r['fuel_cost'], 3),
                })

    s_path = os.path.join(out_dir, 'recommendations.csv')
    d_path = os.path.join(out_dir, 'recommendations_detail.csv')
    _write_csv(s_path, summary_rows)
    _write_csv(d_path, detail_rows)
    return s_path, d_path, len(summary_rows), len(detail_rows)


def _write_csv(path, rows):
    if not rows:
        return
    with open(path, 'w', newline='', encoding='utf-8-sig') as fp:
        w = csv.DictWriter(fp, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)


if __name__ == '__main__':
    s, d, ns, nd = build_report()
    print(f'요약 CSV: {s}  ({ns}행)')
    print(f'상세 CSV: {d}  ({nd}행)')
