"""경로 수집 파이프라인 — O-D 목록 → 실경로 pool → 특성벡터 → 데이터셋(JSONL).

설계: docs/경로수집_설계.md
- generate_od_pairs: 거리대(band)별로 다양한 출발-도착 좌표쌍 생성 (아키타입 다양성)
- collect: 각 O-D → adapters.kakao.fetch_pool(collect) → vectorize(enrich) → 행 저장(JSONL)

얇은 슬라이스로 검증 후 스케일업. slope용 DEM(Open Topo Data)은 1req/sec 제한 → throttle.
출력은 ai/data/ (gitignore).
"""
import math
import os
import random
import time

import pyarrow as pa
import pyarrow.parquet as pq

from .adapters import kakao
from .features import vectorize
from .schema import FEATURE_NAMES

_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')

# 수도권 대략 bbox (min_lng, min_lat, max_lng, max_lat)
BBOX = (126.80, 37.20, 127.20, 37.70)
# 거리대(km): 도심 / 근교 / 장거리 → 아키타입 다양성
BANDS = [(3, 10), (10, 25), (25, 50)]


def _haversine_km(a, b) -> float:
    (lng1, lat1), (lng2, lat2) = a, b
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2 - lat1), math.radians(lng2 - lng1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(min(1.0, math.sqrt(h)))


def generate_od_pairs(per_band=2, seed=0, bbox=BBOX, bands=BANDS, max_tries=5000):
    """거리대별로 per_band 개씩 (origin, dest, band_label) 생성.

    bbox 안에서 두 점을 랜덤 샘플 → 직선거리가 해당 band 에 들면 채택.
    """
    rng = random.Random(seed)
    lo_lng, lo_lat, hi_lng, hi_lat = bbox
    pairs = []
    for lo, hi in bands:
        got, tries = 0, 0
        while got < per_band and tries < max_tries:
            tries += 1
            o = (rng.uniform(lo_lng, hi_lng), rng.uniform(lo_lat, hi_lat))
            d = (rng.uniform(lo_lng, hi_lng), rng.uniform(lo_lat, hi_lat))
            if lo <= _haversine_km(o, d) <= hi:
                pairs.append((o, d, f'{lo}-{hi}km'))
                got += 1
    return pairs


def _row(od_id, band, cr) -> dict:
    f = vectorize.build_feature_vector(cr, enrich=True)
    return {
        'od_id': od_id,
        'band': band,
        'route_id': cr.id,
        **{k: round(float(f[k]), 4) for k in FEATURE_NAMES},
    }


def _write_parquet(rows, path) -> None:
    if not rows:
        return
    cols = {k: [r.get(k) for r in rows] for k in rows[0].keys()}
    pq.write_table(pa.table(cols), path)


def collect(od_pairs, out_path, throttle=1.0, verbose=True) -> list:
    """O-D 목록 → 각 경로의 특성행 리스트, parquet 저장.

    O-D 하나 끝날 때마다 중간 저장 → 오래 걸리는 수집이 끊겨도 데이터 보존.
    """
    os.makedirs(_DATA_DIR, exist_ok=True)
    rows = []
    for i, (o, d, band) in enumerate(od_pairs):
        pool = kakao.fetch_pool(o, d, mode='collect')
        for cr in pool:
            rows.append(_row(f'od{i:04d}', band, cr))
            time.sleep(throttle)  # DEM(Open Topo Data) rate limit 완화
        _write_parquet(rows, out_path)  # 체크포인트
        if verbose:
            print(f'  [{i + 1}/{len(od_pairs)}] band {band}: 경로 {len(pool)}개 (누적 {len(rows)}행)', flush=True)

    if verbose:
        print(f'저장: {out_path} ({len(rows)}행)', flush=True)
    return rows


if __name__ == '__main__':
    # 얇은 슬라이스: band별 2개 = 6 O-D
    ods = generate_od_pairs(per_band=2, seed=42)
    print(f'O-D {len(ods)}개 생성:')
    for o, d, band in ods:
        print(f'  {band}: {o[0]:.3f},{o[1]:.3f} → {d[0]:.3f},{d[1]:.3f}')
    out = os.path.join(_DATA_DIR, 'routes_thin.parquet')
    collect(ods, out)
