// src/api/naviApi.js
// 백엔드(Django) 연동. 로컬 개발 기본값: http://127.0.0.1:8000
// 다른 주소를 쓰려면 frontend/.env 에 REACT_APP_API_BASE_URL 지정 (CRA 규칙).
const BASE_URL =
    process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

async function postJson(path, body) {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        // DRF 는 {detail:"..."} 또는 {field:["..."]} 형태로 에러를 준다.
        const message =
            data.detail ||
            Object.values(data).flat().join('\n') ||
            `요청에 실패했습니다. (${response.status})`;
        throw new Error(message);
    }

    return data;
}

/* 프로필 저장 (S1_Profile) — 고정 정보만. 동승자·짐은 여정별이라 제외. */
export const saveProfile = async (profile) =>
    postJson('/api/users/profile/', {
        age: Number(profile.age),
        gender: profile.gender,
        car_type: profile.carType,
        car_age: Number(profile.carAge)
    });

/* 저장된 프로필 조회 (없으면 null) */
export const fetchProfile = async () => {
    const response = await fetch(`${BASE_URL}/api/users/profile/`);
    if (response.status === 204 || !response.ok) return null;
    return response.json();
};

/* 장소 검색 (S2_Home 자동완성) — "강남역" 같은 입력의 후보 목록 */
export const searchPlaces = async (query) => {
    const response = await fetch(
        `${BASE_URL}/api/routes/places/?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.places || [];
};

/* 경로 추천 (S4_RouteResult) — 랭킹된 경로 리스트를 받는다.
   지오코딩·경로수집·공간조인이 들어가 응답이 느리므로,
   같은 조건의 요청이 이미 진행 중이면 그 결과를 함께 쓴다. */
const pendingRecommendations = new Map();

export const getRouteRecommendation = async (requestData) => {
    const key = JSON.stringify(requestData);

    if (!pendingRecommendations.has(key)) {
        const request = postJson('/api/routes/recommend/', requestData).finally(
            () => pendingRecommendations.delete(key)
        );
        pendingRecommendations.set(key, request);
    }

    return pendingRecommendations.get(key);
};

/* 별점 피드백 전송 (S6_Feedback) */
export const sendFeedback = async (ratingScore) => {
    try {
        // TODO: 백엔드 피드백 엔드포인트가 생기면 postJson 으로 교체
        console.log(`별점 ${ratingScore}점 (백엔드 엔드포인트 준비 중)`);
        return { success: true };
    } catch (error) {
        console.error('피드백 전송 API 에러:', error);
        throw error;
    }
};
