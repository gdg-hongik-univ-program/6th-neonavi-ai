import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import TopNavBar from '../components/TopNavBar';

const TRIP_STORAGE_KEY = 'neonaviTrip';

function readSavedTrip() {
    try {
        return JSON.parse(sessionStorage.getItem(TRIP_STORAGE_KEY) || '{}');
    } catch (error) {
        console.error('저장된 경로 정보를 읽지 못했습니다.', error);
        return {};
    }
}

export default function S4_RouteResult() {
    const navigate = useNavigate();
    const location = useLocation();

    const tripData = useMemo(
        () => ({
            ...readSavedTrip(),
            ...(location.state || {})
        }),
        [location.state]
    );

    const selectedMode = tripData.mode || 'Comfort';
    const autoRecommend = tripData.autoRecommend ?? true;

    const [selectedRouteId, setSelectedRouteId] = useState(0);

    const modeDescriptions = {
        Comfort: '급커브와 잦은 정차가 적은 편안한 경로',
        Sports: '주행 흐름과 속도를 고려한 역동적인 경로',
        Eco: '연료비와 불필요한 정차를 줄인 경제적인 경로'
    };

    // 백엔드 연결 전 사용하는 임시 경로 카드 데이터입니다.
    const routes = [
        {
            id: 0,
            title: autoRecommend
                ? '✨ 너네비추천'
                : `✨ ${selectedMode} 추천`,
            description:
                modeDescriptions[selectedMode] ||
                '사용자 성향에 맞춘 추천 경로',
            time: '42분',
            arrivalTime: '오후 3:45 도착',
            distance: '16km',
            fee: '0원'
        },
        {
            id: 1,
            title: '시간우선',
            description: '도착 시간이 빠른 경로',
            time: '39분',
            arrivalTime: '오후 3:42 도착',
            distance: '17km',
            fee: '0원'
        },
        {
            id: 2,
            title: '무료도로',
            description: '통행료가 없는 경로',
            time: '46분',
            arrivalTime: '오후 3:49 도착',
            distance: '15km',
            fee: '0원'
        }
    ];

    const selectedRoute =
        routes.find((route) => route.id === selectedRouteId) || routes[0];

    const handleStartNavigation = () => {
        const navigationData = {
            ...tripData,
            mode: selectedMode,
            autoRecommend,
            route: selectedRoute
        };

        sessionStorage.setItem(
            TRIP_STORAGE_KEY,
            JSON.stringify(navigationData)
        );

        navigate('/navi', {
            state: navigationData
        });
    };

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col bg-gray-100">
            <div className="relative z-50 bg-white">
                <TopNavBar title="경로 탐색 결과" />
            </div>

            <div className="absolute inset-0 top-[56px] w-full h-full bg-gray-200 z-0">
                <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
                    <span className="text-6xl mb-4">🗺️</span>
                    <p className="text-gray-500 font-bold text-xl">
                        지도 API 영역
                    </p>
                </div>
            </div>

            <div className="absolute top-[72px] left-4 right-4 z-30 space-y-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">탐색 경로</p>
                    <p className="font-bold text-gray-900 break-words">
                        {tripData.departure || '출발지'}
                        <span className="mx-2 text-indigo-500">→</span>
                        {tripData.destination || '도착지'}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">
                        현재 적용 모드
                    </p>
                    <div className="flex items-center justify-between">
                        <p className="font-extrabold text-indigo-600">
                            {autoRecommend ? 'AI 자동 추천' : selectedMode}
                        </p>
                        <span className="text-xs text-gray-500">
                            {autoRecommend ? '성향 기반' : '직접 선택'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white/95 to-transparent pt-8 pb-8">
                <div className="flex overflow-x-auto gap-3 px-4 pb-4 hide-scrollbar">
                    {routes.map((route) => {
                        const isSelected = selectedRouteId === route.id;

                        return (
                            <div
                                key={route.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedRouteId(route.id)}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === 'Enter' ||
                                        event.key === ' '
                                    ) {
                                        setSelectedRouteId(route.id);
                                    }
                                }}
                                className={`min-w-[180px] flex-shrink-0 p-4 rounded-2xl cursor-pointer transition-all bg-white shadow-sm ${
                                    isSelected
                                        ? 'border-[2.5px] border-indigo-600'
                                        : 'border border-gray-200 opacity-90'
                                }`}
                            >
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <span
                                        className={`font-extrabold text-[15px] ${
                                            isSelected
                                                ? 'text-indigo-600'
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {route.title}
                                    </span>

                                    <button
                                        type="button"
                                        className="flex-none text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded bg-gray-50"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        상세
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 mb-2 leading-5">
                                    {route.description}
                                </p>

                                <div className="text-2xl font-black text-gray-900 tracking-tight my-1.5">
                                    {route.time}
                                </div>

                                <div className="text-sm text-gray-600 mb-1 font-medium">
                                    {route.arrivalTime}
                                </div>

                                <div className="text-xs text-gray-500 font-medium">
                                    {route.distance} · {route.fee}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="px-4 flex gap-2">
                    <button
                        type="button"
                        className="flex-none w-1/3 bg-gray-500 text-white py-4 rounded-xl font-bold text-[15px] shadow-sm active:bg-gray-600 transition-colors"
                    >
                        다른시간 출발
                    </button>

                    <button
                        type="button"
                        onClick={handleStartNavigation}
                        className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-md active:bg-indigo-700 transition-colors"
                    >
                        안내시작
                    </button>
                </div>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
