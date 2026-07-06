# NeoNavi (너네비)

> 성향 맞춤형 내비게이션 — 사용자 정보(나이·성별·동승자·차종·짐·연식)로 운전 성향을 추론해, 거리도 합리적이면서 성향에 맞는 경로를 추천하는 AI 내비게이션.
> GDG 프로젝트 트랙 (AI 트랙)

## 📁 구조

```
neonavi/
├── frontend/   # React + Vite + TailwindCSS (모바일 우선 반응형 웹)   — 최서윤
├── backend/    # Django + DRF (API 서버)                            — 공용
├── ai/         # PyTorch 성향 추론 모델 + Feature Engineering        — 안중현 / 데이터: 임세희
└── docs/       # (선택) 기획 문서 사본·링크
```

## 👥 팀

| 담당 | 이름 |
|---|---|
| AI / 모델 | 안중현 |
| 데이터 | 임세희 |
| Frontend | 최서윤 |

## 🚀 시작하기

### frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173 (/api 는 백엔드로 프록시)
```

### backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver   # http://localhost:8000
```

### ai
```bash
cd ai
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

## 📄 기획 문서

기획안·IA·와이어프레임 등 기획 자료는 미션 레포(`gdg-project-track/project-track/`)에 있음.
```
