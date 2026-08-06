// src/utils/kakaoMap.js
// 카카오 지도 SDK를 필요할 때 한 번만 불러온다.
// JavaScript 키는 frontend/.env 의 REACT_APP_KAKAO_JS_KEY 에 넣는다.
// (REST API 키가 아니라 같은 앱의 'JavaScript 키'. Web 플랫폼에 도메인 등록 필요)

const SDK_URL = 'https://dapi.kakao.com/v2/maps/sdk.js';

let loadPromise = null;

export function loadKakaoMap() {
    if (window.kakao?.maps) return Promise.resolve(window.kakao);
    if (loadPromise) return loadPromise;

    const appKey = process.env.REACT_APP_KAKAO_JS_KEY;
    if (!appKey) {
        return Promise.reject(
            new Error(
                '지도 키가 없습니다. frontend/.env 에 REACT_APP_KAKAO_JS_KEY 를 설정해 주세요.'
            )
        );
    }

    loadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        // autoload=false → load() 호출 시점에 초기화
        script.src = `${SDK_URL}?appkey=${appKey}&autoload=false`;
        script.async = true;
        script.onload = () => window.kakao.maps.load(() => resolve(window.kakao));
        script.onerror = () => {
            loadPromise = null;
            reject(
                new Error(
                    '지도를 불러오지 못했습니다. 키와 등록된 도메인을 확인해 주세요.'
                )
            );
        };
        document.head.appendChild(script);
    });

    return loadPromise;
}
