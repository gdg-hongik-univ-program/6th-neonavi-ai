// src/api/naviApi.js
const BASE_URL = '';

/*경로 추천 API (S4_RouteResult 에서 사용)
 출발지, 도착지, 동승자, 모드 정보를 보내고 추천경로 받기*/
export const getRouteRecommendation = async (requestData) => {
    try {
        // [백엔드 연동 시 주석 해제할 부분]
        // const response = await fetch(`${BASE_URL}/route/recommend`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(requestData)
        // });
        // return await response.json();

        // 테스트용 가짜 데이터를 0.5초 뒤에 반환
        console.log("서버로 데이터 전송:", requestData);
        return new Promise((resolve) => setTimeout(() => {
            resolve({
                success: true,
                time: "32분",
                distance: "18.5km",
                cost: "1,200원",
                reason: "어르신 동승 감지 · Comfort 모드"
            });
        }, 500));

    } catch (error) {
        console.error("경로 추천 API 에러:", error);
        throw error;
    }
};


/* 별점 피드백 전송 API (S6_Feedback 에서 사용) 사용자의 별점을 전송*/
export const sendFeedback = async (ratingScore) => {
    try {
        // [백엔드 연동 시 주석 해제할 부분]
        // const response = await fetch(`${BASE_URL}/feedback`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ rating: ratingScore })
        // });
        // return await response.json();

        // 테스트용 콘솔 출력
        console.log(`백엔드로 별점 ${ratingScore}점 전송 완료!`);
        return { success: true };

    } catch (error) {
        console.error("피드백 전송 API 에러:", error);
        throw error;
    }
};