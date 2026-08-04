import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TRIP_STORAGE_KEY = 'neonaviTrip';

function readSavedTrip() {
    try {
        return JSON.parse(sessionStorage.getItem(TRIP_STORAGE_KEY) || '{}');
    } catch (error) {
        console.error('저장된 경로 정보를 읽지 못했습니다.', error);
        return {};
    }
}

export default function S5_Navigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const navigationData = useMemo(
        () => ({
            ...readSavedTrip(),
            ...(location.state || {})
        }),
        [location.state]
    );

    const destination = navigationData.destination || '도착지';
    const selectedRoute = navigationData.route || {};

    const [currentMode, setCurrentMode] = useState(
        navigationData.mode || 'Comfort'
    );
    const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);

    const handleModeChange = (newMode) => {
        setCurrentMode(newMode);
        setIsModeMenuOpen(false);

        const nextNavigationData = {
            ...navigationData,
            mode: newMode,
            autoRecommend: false
        };

        sessionStorage.setItem(
            TRIP_STORAGE_KEY,
            JSON.stringify(nextNavigationData)
        );

        console.log(`[경로 재탐색 요청] 현재 모드: ${newMode}`);
    };

    const handleFinishNavigation = () => {
        navigate('/feedback', {
            state: {
                ...navigationData,
                mode: currentMode
            }
        });
    };

    return (
        <div className="w-full h-[100dvh] bg-gray-200 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                <div className="text-center px-6">
                    <p className="text-gray-500 font-bold text-lg">
                        지도 영역 (API 연동)
                    </p>
                    <p className="text-sm text-gray-500 mt-2 break-words">
                        {navigationData.departure || '출발지'} → {destination}
                    </p>
                </div>
            </div>

            <div className="absolute top-4 left-4 right-4 z-10">
                <div className="bg-indigo-600 text-white rounded-2xl p-5 shadow-2xl flex items-center gap-4">
                    <div className="text-5xl">↪️</div>
                    <div className="flex-1 min-w-0">
                        <div className="text-3xl font-extrabold mb-1">300m</div>
                        <div className="text-lg font-medium opacity-90 break-words">
                            {destination} 방면 우회전
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-32 right-4 z-20 flex flex-col items-end gap-2">
                {isModeMenuOpen && (
                    <div className="bg-white rounded-xl shadow-xl p-2 flex flex-col gap-1 mb-2 border border-gray-100 w-32">
                        {['Comfort', 'Sports', 'Eco'].map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => handleModeChange(mode)}
                                className={`py-2 px-3 text-sm font-bold rounded-lg text-left transition-colors ${
                                    currentMode === mode
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {mode} {currentMode === mode && '✓'}
                            </button>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setIsModeMenuOpen((open) => !open)}
                    className="bg-white text-indigo-600 font-extrabold py-3 px-5 rounded-full shadow-lg border-2 border-indigo-100 flex items-center gap-2 active:scale-95 transition-transform"
                >
                    <span className="text-xl">✨</span>
                    {currentMode}
                </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-10">
                <div className="flex justify-between items-end gap-3 mb-4">
                    <div className="min-w-0">
                        <div className="text-3xl font-extrabold text-gray-900">
                            {selectedRoute.arrivalTime || '오후 3:45 도착'}
                        </div>
                        <div className="text-gray-500 font-medium mt-1">
                            <span className="text-indigo-600 font-bold">
                                {selectedRoute.time || '25분'}
                            </span>
                            {' 남음 · '}
                            {selectedRoute.distance || '16km'}
                        </div>
                    </div>

                    <div className="flex-none bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600">
                        {currentMode} 주행 중
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleFinishNavigation}
                    className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-md active:bg-red-600 transition-colors"
                >
                    안내 종료
                </button>
            </div>
        </div>
    );
}
