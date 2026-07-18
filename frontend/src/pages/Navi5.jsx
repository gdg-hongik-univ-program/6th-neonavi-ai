import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/base/Navigation';

export default function Navi5() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-100 h-screen flex flex-col relative overflow-hidden font-sans">

            {/* 1. 상단 턴바이턴 안내바 (와이어프레임 스타일 적용) */}
            {/* 배경을 메인 컬러로 맞추고, 하단 모서리만 둥글게(rounded-b-3xl) 처리했습니다. */}
            <div className="absolute top-0 w-full bg-[#5C5CFF] text-white p-6 pt-10 shadow-md z-20 rounded-b-[2rem]">
                <div className="flex items-center gap-5 mt-2">
                    <div className="text-5xl font-light">↱</div>
                    <div>
                        <div className="text-3xl font-bold tracking-tight mb-1">300m 앞 우회전</div>
                        <div className="text-indigo-100 text-sm font-medium">강릉대로 방면</div>
                    </div>
                </div>
            </div>

            {/* 2. 지도 영역 */}
            <div className="w-full h-full relative z-0">
                <Navigation />

                {/* 주행 모드 뱃지 (지도 우측 상단 띄움) */}
                <div className="absolute top-44 right-5 bg-white px-4 py-2 rounded-full shadow-lg font-bold text-[#5C5CFF] text-xs flex items-center gap-1.5 z-10 border border-gray-100">
                    <span>🚙</span> Comfort
                </div>
            </div>

            {/* 3. 하단 주행 정보 & 종료 버튼 */}
            <div className="absolute bottom-0 w-full bg-white p-6 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.08)] flex justify-between items-center z-20 pb-10">
                <div>
                    <div className="text-sm font-bold text-gray-800 mb-1">
                        남은 시간 <span className="text-[#5C5CFF] text-lg">28분</span>
                        <span className="text-gray-400 font-normal ml-2">도착 14:32</span>
                    </div>
                    <div className="text-gray-500 text-sm font-medium">남은 거리 12.4km</div>
                </div>

                {/* 와이어프레임처럼 종료 버튼은 눈에 띄게 빨간색으로 유지하되 모양을 둥글게 다듬었습니다. */}
                <button
                    onClick={() => navigate('/feedback')}
                    className="bg-[#FF4B4B] text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:bg-red-600 transition-colors"
                >
                    안내 종료
                </button>
            </div>

        </div>
    );
}