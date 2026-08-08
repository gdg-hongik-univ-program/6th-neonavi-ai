import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function S7a() {
    const navigate = useNavigate();

    // 💡 백엔드 API 연동 시 이 부분을 실제 fetch 데이터로 교체하시면 됩니다.
    // 명세: 출발지, 도착지, 주행거리, 선택 모드, 비용, 주행 시간, 별점
    const dummyHistories = [
        {
            id: 1,
            date: '2026-08-07 14:30',
            departure: '정발산역 3호선',
            destination: '일산동구 풍산동',
            distance: '4.2', // km 단위 숫자 (총합 계산용)
            mode: 'Comfort (승차감)',
            fee: '0',
            time: '15분',
            rating: 5 // 별점 5점
        },
        {
            id: 2,
            date: '2026-08-05 09:00',
            departure: '서울역',
            destination: '부산역',
            distance: '398.5',
            mode: 'Eco (연비)',
            fee: '21,500',
            time: '4시간 30분',
            rating: 4 // 별점 4점
        },
        {
            id: 3,
            date: '2026-08-01 18:15',
            departure: '강남역',
            destination: '판교역',
            distance: '12.8',
            mode: 'Time (최단 시간)',
            fee: '1,200',
            time: '25분',
            rating: null // 피드백 미작성
        }
    ];

    // 배열에 있는 모든 주행 거리를 합산하여 총 주행 거리 계산 (소수점 1자리까지)
    const totalDistance = dummyHistories
        .reduce((acc, curr) => acc + parseFloat(curr.distance), 0)
        .toFixed(1);

    // 별점 렌더링 함수 (SVG 아이콘 사용)
    const renderStars = (score) => {
        if (!score) return <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">피드백 대기</span>;

        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < score ? 'text-yellow-400' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-1.5 text-sm font-extrabold text-gray-700">{score}점</span>
            </div>
        );
    };

    return (
        <div className="relative w-full min-h-[100dvh] bg-gray-100 flex flex-col">
            {/* 상단 네비게이션 바 */}
            <div className="sticky top-0 z-50 bg-white px-4 py-4 flex items-center border-b border-gray-200 shadow-sm">
                <button onClick={() => navigate(-1)} className="text-xl font-bold mr-4 text-gray-800">
                    ←
                </button>
                <h2 className="text-lg font-bold text-gray-800">주행 기록 및 피드백</h2>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 px-4 pt-6 pb-10">

                {/* 🌟 누적 주행 거리 헤더 (너네비와 함께한 거리) */}
                <div className="bg-indigo-600 rounded-2xl p-6 shadow-md mb-6 text-white">
                    <p className="text-indigo-100 text-sm font-medium mb-1">지금까지 너네비와 함께</p>
                    <div className="flex items-end gap-1">
                        <span className="text-4xl font-black tracking-tight">{totalDistance}</span>
                        <span className="text-lg font-bold mb-1">km</span>
                        <span className="text-lg font-bold mb-1 ml-1">달렸어요! 🚗</span>
                    </div>
                </div>

                {/* 주행 기록 리스트 */}
                <div className="space-y-4">
                    {dummyHistories.map((history) => (
                        <div key={history.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

                            {/* 날짜 및 별점 헤더 */}
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                                <span className="text-sm font-bold text-gray-500">{history.date}</span>
                                {renderStars(history.rating)}
                            </div>

                            {/* 경로 (출발지 -> 도착지) */}
                            <div className="mb-5">
                                <p className="text-xs text-gray-400 mb-1">탐색 경로</p>
                                <p className="font-extrabold text-gray-900 text-lg flex items-center flex-wrap gap-2">
                                    {history.departure}
                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                    {history.destination}
                                </p>
                            </div>

                            {/* 주행 상세 정보 (Grid) */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">주행 거리</p>
                                    <p className="font-bold text-gray-800">{history.distance} km</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">주행 시간</p>
                                    <p className="font-bold text-gray-800">{history.time}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">선택 모드</p>
                                    <p className="font-bold text-indigo-600">{history.mode}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">비용 (통행료)</p>
                                    <p className="font-bold text-gray-800">{history.fee}원</p>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {dummyHistories.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <span className="text-5xl block mb-4">📭</span>
                        <p className="font-bold">아직 주행 기록이 없습니다.</p>
                        <p className="text-sm mt-1">너내비와 함께 첫 주행을 시작해 보세요!</p>
                    </div>
                )}

            </div>
        </div>
    );
}