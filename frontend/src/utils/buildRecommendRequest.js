// src/utils/buildRecommendRequest.js
// 화면 상태(프로필 + 여정) → 백엔드 추천 API 요청 형식으로 변환한다.
// 표기 차이(한글 동승자, camelCase, 모드 대문자)를 여기서 한 번에 맞춘다.

const PASSENGER_MAP = {
    혼자: 'alone',
    가족: 'family',
    노약자: 'vulnerable',
    친구: 'friend'
};

/**
 * @param {object} profile  { age, gender, carType, carAge }  — 고정 프로필
 * @param {object} trip     { departure, destination, passenger, loadKg, mode, autoRecommend }
 */
export function buildRecommendRequest(profile, trip) {
    if (!profile) {
        throw new Error('프로필 정보가 없습니다. 기본 정보를 먼저 입력해 주세요.');
    }

    return {
        profile: {
            age: Number(profile.age),
            gender: profile.gender || 'M',
            car_type: profile.carType || 'sedan',
            car_age: Number(profile.carAge || 0)
        },
        passenger: PASSENGER_MAP[trip.passenger] || trip.passenger || 'alone',
        load_kg: Number(trip.loadKg || 0),
        origin: trip.departure,
        destination: trip.destination,
        mode: (trip.mode || 'comfort').toLowerCase(),
        auto_recommend: trip.autoRecommend ?? true
    };
}
