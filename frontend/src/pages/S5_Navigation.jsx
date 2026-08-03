import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function S5_Navigation() {
    const navigate = useNavigate();

    // S5b: 주행 중 현재 모드 상태 관리
    const [currentMode, setCurrentMode] = useState('Comfort');

    // 모드 선택 팝업을 열고 닫는 상태
    const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);

    // 모드 변경 함수 (클릭 시 팝업 닫고 모드 변경)
    const handleModeChange = (newMode) => {
        setCurrentMode(newMode);
        setIsModeMenuOpen(false);
        // 💡 실무 연동 팁: 여기서 백엔드로 "현재 위치(GPS) 기준, 새로운 모드로 경로 다시 짜줘(Re-routing)" API를 호출합니다!
        console.log(`[경로 재탐색 요청] 현재 모드: ${newMode}`);
    };

    return (
        <div className="w-full h-screen bg-gray-200 relative overflow-hidden flex flex-col">

            {/* 🗺️ 배경 지도 영역 (전체 화면 차지) */}
            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500 font-bold text-lg">지도 영역 (API 연동)</p>
            </div>

            {/* =========================================
                S5a: 턴바이턴 (Turn-by-Turn) 영역
                운전 중 가장 시선이 많이 가는 최상단 배치
            ========================================= */}
            <div className="absolute top-4 left-4 right-4 z-10">
                <div className="bg-indigo-600 text-white rounded-2xl p-5 shadow-2xl flex items-center gap-4">
                    <div className="text-5xl">↪️</div> {/* 우회전 아이콘 */}
                    <div className="flex-1">
                        <div className="text-3xl font-extrabold mb-1">300m</div>
                        <div className="text-lg font-medium opacity-90">강릉역 방면 우회전</div>
                    </div>
                </div>
            </div>

            {/* =========================================
                S5b: 주행 중 모드 전환 영역 (우측 하단 플로팅)
            ========================================= */}
            <div className="absolute bottom-32 right-4 z-20 flex flex-col items-end gap-2">

                {/* 모드 선택 팝업 메뉴 (버튼 누르면 열림) */}
                {isModeMenuOpen && (
                    <div className="bg-white rounded-xl shadow-xl p-2 flex flex-col gap-1 mb-2 border border-gray-100 w-32">
                        {['Comfort', 'Sports', 'Eco'].map((m) => (
                            <button
                                key={m}
                                onClick={() => handleModeChange(m)}
                                className={`py-2 px-3 text-sm font-bold rounded-lg text-left transition-colors ${currentMode === m ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {m} {currentMode === m && '✓'}
                            </button>
                        ))}
                    </div>
                )}

                {/* 현재 모드를 보여주는 메인 버튼 (클릭 시 팝업 토글) */}
                <button
                    onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                    className="bg-white text-indigo-600 font-extrabold py-3 px-5 rounded-full shadow-lg border-2 border-indigo-100 flex items-center gap-2 active:scale-95 transition-transform"
                >
                    <span className="text-xl">✨</span>
                    {currentMode}
                </button>
            </div>

            {/* 하단 정보 바 (도착 예정 시간 등) */}
            <div className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-10">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-3xl font-extrabold text-gray-900">오후 3:45 도착</div>
                        <div className="text-gray-500 font-medium mt-1">
                            <span className="text-indigo-600 font-bold">25분</span> 남음 · 16km
                        </div>
                    </div>
                    {/* 경로 요약 뱃지 */}
                    <div className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600">
                        {currentMode} 주행 중
                    </div>
                </div>

                {/* 주행 종료 버튼 (S6 피드백 화면으로 이동) */}
                <button
                    onClick={() => navigate('/feedback')}
                    className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-md active:bg-red-600 transition-colors"
                >
                    안내 종료
                </button>
            </div>

        </div>
    );
}