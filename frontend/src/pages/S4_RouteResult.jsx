import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function S4() {
    const navigate = useNavigate();
    const [selectedRoute, setSelectedRoute] = useState('추천');

    return (
        <div className="bg-gray-50 min-h-screen relative pb-36 font-sans">

            {/* 1. 상단 지도 영역 (화면 높이의 약 35% 차지) */}
            <div className="w-full h-[35vh] min-h-[250px] bg-[#F2F4F8] relative flex items-center justify-center overflow-hidden z-0">
                {/* 💡 디테일: 지도 배경 격자무늬 패턴 */}
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <svg className="w-full h-full absolute" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M -10,110 Q 50,50 90,10" stroke="#5C5CFF" strokeWidth="2.5" fill="transparent" strokeLinecap="round" />
                </svg>
                {/* 깃발 마커 */}
                <div className="absolute top-10 right-10 w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center text-white shadow-lg text-sm">🏁</div>
            </div>

            {/* 2. 추천 이유 하이라이트 카드 (지도 위에 살짝 걸치게 -mt-12 적용) */}
            <div className="relative z-10 -mt-12 mx-5 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6">
                <div className="flex justify-center mb-3">
                    <span className="bg-orange-50 text-orange-600 text-xs px-3 py-1.5 rounded-full font-bold shadow-sm">
                        👴 어르신 동승 감지 · Comfort 모드
                    </span>
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 text-center mb-5 leading-snug">
                    급커브 40% 적은<br />편안한 길로 안내해요
                </h3>

                <div className="flex justify-center items-center gap-5 text-sm font-bold text-gray-700 border-t border-b border-gray-100 py-3 mb-4">
                    <span className="flex items-center gap-1"><span className="text-gray-400 font-normal">🕒</span> 32분</span>
                    <span className="flex items-center gap-1"><span className="text-gray-400 font-normal">📍</span> 18.5km</span>
                    <span className="flex items-center gap-1"><span className="text-green-500 font-normal">💳</span> 1,200원</span>
                </div>

                <div className="flex justify-center gap-2">
                    <span className="px-3 py-1.5 bg-[#F4F4FF] text-[#5C5CFF] rounded-full text-[11px] font-bold tracking-wide">평탄함</span>
                    <span className="px-3 py-1.5 bg-[#F4F4FF] text-[#5C5CFF] rounded-full text-[11px] font-bold tracking-wide">곡률 낮음</span>
                    <span className="px-3 py-1.5 bg-[#F4F4FF] text-[#5C5CFF] rounded-full text-[11px] font-bold tracking-wide">완만한 경사</span>
                </div>
            </div>

            {/* 3. 대안 경로 비교 탭 (버튼 크기와 간격 조정) */}
            <div className="mt-8 px-5 space-y-4 relative z-10">
                <div
                    onClick={() => setSelectedRoute('추천')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${selectedRoute === '추천' ? 'border-[#5C5CFF] bg-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                    <div>
                        <div className={`font-bold text-lg ${selectedRoute === '추천' ? 'text-[#5C5CFF]' : 'text-gray-800'}`}>추천 경로</div>
                        <div className="text-gray-500 text-sm mt-0.5">32분 / 18.5km</div>
                    </div>
                    {selectedRoute === '추천' && <span className="text-[#5C5CFF] font-bold text-sm bg-[#F4F4FF] px-3 py-1 rounded-full">선택됨</span>}
                </div>

                <div
                    onClick={() => setSelectedRoute('최단')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${selectedRoute === '최단' ? 'border-[#5C5CFF] bg-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                    <div>
                        <div className={`font-bold text-lg ${selectedRoute === '최단' ? 'text-[#5C5CFF]' : 'text-gray-800'}`}>최단 경로</div>
                        <div className="text-gray-500 text-sm mt-0.5">28분 / 17.2km <span className="text-red-400 ml-1 font-medium">(커브 많음)</span></div>
                    </div>
                    {selectedRoute === '최단' && <span className="text-[#5C5CFF] font-bold text-sm bg-[#F4F4FF] px-3 py-1 rounded-full">선택됨</span>}
                </div>

                <div
                    onClick={() => setSelectedRoute('무료')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${selectedRoute === '무료' ? 'border-[#5C5CFF] bg-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                    <div>
                        <div className={`font-bold text-lg ${selectedRoute === '무료' ? 'text-[#5C5CFF]' : 'text-gray-800'}`}>무료 경로</div>
                        <div className="text-gray-500 text-sm mt-0.5">36분 / 20.1km</div>
                    </div>
                    {selectedRoute === '무료' && <span className="text-[#5C5CFF] font-bold text-sm bg-[#F4F4FF] px-3 py-1 rounded-full">선택됨</span>}
                </div>
            </div>

            {/* 4. 안내 시작 버튼 (하단 여백을 살짝 주어 모바일 기기 하단 쓸어올리기와 겹치지 않게 배치) */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg px-5 py-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-[9999]">
                <button
                    onClick={() => navigate('/navi')}
                    className="w-full bg-[#5C5CFF] text-white py-4 rounded-2xl font-bold text-[17px] shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                >
                    안내 시작
                </button>
            </div>

        </div>
    );
}