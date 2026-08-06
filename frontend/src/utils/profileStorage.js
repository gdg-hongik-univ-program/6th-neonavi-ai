// src/utils/profileStorage.js
// 프로필은 백엔드에 저장하고, 브라우저에도 캐시해 둔다.
// (추천 요청 때마다 서버를 다시 부르지 않기 위해)

const PROFILE_STORAGE_KEY = 'neonaviProfile';

export const DEFAULT_PROFILE = {
    age: '',
    gender: 'M',
    carType: 'sedan',
    carAge: 0
};

/** 브라우저에 캐시된 프로필 (없으면 null) */
export function readProfile() {
    try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error('프로필을 불러오지 못했습니다.', error);
        return null;
    }
}

/** 프로필 캐시 저장 */
export function writeProfile(profile) {
    try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
        console.error('프로필을 저장하지 못했습니다.', error);
    }
}

/** 서버 응답(snake_case) → 화면 상태(camelCase) */
export function fromApi(data) {
    if (!data) return null;
    return {
        id: data.id,
        age: data.age ?? '',
        gender: data.gender ?? 'M',
        carType: data.car_type ?? 'sedan',
        carAge: data.car_age ?? 0
    };
}
