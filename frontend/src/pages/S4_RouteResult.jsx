import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import TopNavBar from '../components/TopNavBar';
import RouteMap from '../components/RouteMap';
import { getRouteRecommendation } from '../api/naviApi';
import { readProfile } from '../utils/profileStorage';
import { buildRecommendRequest } from '../utils/buildRecommendRequest';

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

    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // 도착 예정 시각 = 지금 + 소요시간
    const formatArrival = (durationMin) => {
        const arrival = new Date(Date.now() + durationMin * 60 * 1000);
        return arrival.toLocaleTimeString('ko-KR', {
            hour: 'numeric',
            minute: '2-digit'
        }) + ' 도착';
    };

    // 프로필 + 여정 정보로 추천 경로를 받아온다.
    // 추천은 무거운 요청(지오코딩·경로수집·공간조인)이라 같은 조건이면 요청을 재사용한다.
    // 요청 자체를 캐시하므로 개발 모드(StrictMode)의 이중 마운트에서도 결과가 그대로 반영된다.
    const requestKey = `${tripData.departure}|${tripData.destination}|${tripData.passenger}|${tripData.loadKg}|${selectedMode}|${autoRecommend}`;

    useEffect(() => {
        let isActive = true;

        const fetchRoutes = async () => {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const request = buildRecommendRequest(readProfile(), {
                    ...tripData,
                    mode: selectedMode,
                    autoRecommend
                });

                const data = await getRouteRecommendation(request);
                if (!isActive) return;

                const list = (data.routes || []).map((route, index) => ({
                    id: index,
                    routeId: route.route_id,
                    title: route.title,
                    description: route.reason,
                    time: `${route.duration_min}분`,
                    arrivalTime: formatArrival(route.duration_min),
                    distance: `${route.distance_km}km`,
                    fee: `${route.toll.toLocaleString()}원`,
                    path: route.path || []      // 지도에 그릴 좌표
                }));

                setRoutes(list);
                setSelectedRouteId(list.length ? 0 : null);
            } catch (error) {
                if (!isActive) return;
                console.error('경로 추천 실패', error);
                setErrorMessage(error.message || '경로를 불러오지 못했습니다.');
                setRoutes([]);
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        fetchRoutes();
        return () => {
            isActive = false;
        };
        // requestKey 가 바뀔 때만 다시 추천을 받는다.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestKey]);

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
                {routes.length > 0 ? (
                    <RouteMap
                        routes={routes}
                        selectedId={selectedRouteId ?? 0}
                        onSelect={setSelectedRouteId}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
                        <span className="text-6xl mb-4">🗺️</span>
                        <p className="text-gray-500 font-bold text-xl">
                            {isLoading ? '경로를 찾는 중' : '표시할 경로가 없습니다'}
                        </p>
                    </div>
                )}
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
                {isLoading && (
                    <div className="px-4 pb-4">
                        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-6 text-center">
                            <p className="font-bold text-gray-700">
                                성향에 맞는 경로를 찾는 중...
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                도로·신호·경사 정보를 분석하고 있어요
                            </p>
                        </div>
                    </div>
                )}

                {!isLoading && errorMessage && (
                    <div className="px-4 pb-4">
                        <div className="bg-white rounded-2xl border border-red-200 px-4 py-5">
                            <p className="font-bold text-red-500 mb-1">
                                경로를 불러오지 못했습니다
                            </p>
                            <p className="text-xs text-gray-600 whitespace-pre-line">
                                {errorMessage}
                            </p>
                        </div>
                    </div>
                )}

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
                        disabled={!selectedRoute}
                        className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-md active:bg-indigo-700 transition-colors disabled:bg-gray-400"
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
