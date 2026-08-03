import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';

export default function S4_RouteResult() {
    const navigate = useNavigate();

    // 선택된 경로의 ID를 관리 (기본값은 0번)
    const [selectedRouteId, setSelectedRouteId] = useState(0);

    // 스크린샷과 유사한 형태의 데이터 구조
    const routes = [
        {
            id: 0,
            title: '✨ 너네비추천',
            time: '2시간 19분',
            arrivalTime: '오후 5:57 도착',
            distance: '152km',
            fee: '4,900원'
        },
        {
            id: 1,
            title: '시간우선',
            time: '2시간 19분',
            arrivalTime: '오후 5:57 도착',
            distance: '152km',
            fee: '4,900원'
        },
        {
            id: 2,
            title: '무료도로',
            time: '3시간 10분',
            arrivalTime: '오후 6:49 도착',
            distance: '162km',
            fee: '0원'
        }
    ];

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col bg-gray-100">

            {/* 1. 상단 네비바 */}
            <div className="relative z-50 bg-white">
                <TopNavBar title="경로 탐색 결과" />
            </div>

            {/* 2. 🗺️ 배경 지도 영역 (전체 화면) */}
            <div className="absolute inset-0 top-[56px] w-full h-full bg-gray-200 z-0">
                <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
                    <span className="text-6xl mb-4">🗺️</span>
                    <p className="text-gray-500 font-bold text-xl">지도 API 영역</p>
                </div>
            </div>

            {/* 3. 하단 UI 컨테이너 (경로 카드 + 안내시작 버튼) */}
            <div className="absolute bottom-0 w-full z-20 pb-8 pt-4 bg-gradient-to-t from-white via-white/90 to-transparent">

                {/* 3-1. 가로 스크롤(스와이프) 경로 카드 영역 */}
                <div className="flex overflow-x-auto gap-3 px-4 pb-4 hide-scrollbar">
                    {routes.map(route => (
                        <div
                            key={route.id}
                            onClick={() => setSelectedRouteId(route.id)}
                            className={`min-w-[160px] flex-shrink-0 p-4 rounded-2xl cursor-pointer transition-all bg-white shadow-sm ${selectedRouteId === route.id
                                    ? 'border-[2.5px] border-blue-600' // 선택된 카드: 두꺼운 파란 테두리
                                    : 'border border-gray-200 opacity-90' // 미선택 카드: 얇은 회색 테두리
                                }`}
                        >
                            {/* 카드 타이틀 & 상세버튼 */}
                            <div className="flex justify-between items-center mb-1">
                                <span className={`font-extrabold text-[15px] ${selectedRouteId === route.id ? 'text-blue-600' : 'text-gray-700'}`}>
                                    {route.title}
                                </span>
                                <button className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded bg-gray-50">
                                    상세
                                </button>
                            </div>

                            {/* 소요 시간 */}
                            <div className="text-2xl font-black text-gray-900 tracking-tight my-1.5">
                                {route.time}
                            </div>

                            {/* 도착 시간 및 상세 정보 */}
                            <div className="text-sm text-gray-600 mb-1 font-medium">
                                {route.arrivalTime}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                                {route.distance} · {route.fee}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3-2. 하단 고정 액션 버튼 영역 (스크린샷 참고) */}
                <div className="px-4 flex gap-2">
                    {/* 다른시간 출발 버튼 (선택적) */}
                    <button className="flex-none w-1/3 bg-gray-500 text-white py-4 rounded-xl font-bold text-[15px] shadow-sm">
                        다른시간 출발
                    </button>

                    {/* 메인 안내 시작 버튼 (클릭 시 S5 주행 안내로 이동) */}
                    <button
                        onClick={() => navigate('/navi')}
                        className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-md active:bg-blue-700 transition-colors"
                    >
                        안내시작
                    </button>
                </div>
            </div>

            {/* 가로 스크롤바 숨기기 CSS */}
            <style jsx="true">{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}