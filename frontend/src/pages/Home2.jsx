import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home2() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col relative font-sans pb-32">

            {/* 상단 헤더: 로고 및 마이페이지 */}
            <div className="px-6 pt-12 pb-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#5C5CFF] rounded-xl shadow-sm"></div>
                    <span className="font-extrabold text-2xl text-gray-900 tracking-tight">너네비</span>
                </div>
                <button
                    onClick={() => navigate('/mypage')}
                    className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                    마이페이지
                </button>
            </div>

            {/* 메인 카피 텍스트 */}
            <div className="px-6 mt-8 mb-10">
                <h1 className="text-[28px] font-extrabold text-gray-900 leading-[1.3] mb-3">
                    오늘 어디로 가세요?
                </h1>
                <p className="text-gray-500 text-[15px] leading-relaxed font-medium">
                    출발지와 도착지를 입력하면,<br />
                    너에게 꼭 맞는 길을 찾아드려요.
                </p>
            </div>

            {/* 경로 입력창 영역 */}
            <div className="px-6 space-y-4">
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📍</div>
                    <input
                        type="text"
                        placeholder="출발지 입력"
                        className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-bold focus:outline-none focus:border-[#5C5CFF] focus:ring-1 focus:ring-[#5C5CFF] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all placeholder:text-gray-400 placeholder:font-medium"
                    />
                </div>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🏁</div>
                    <input
                        type="text"
                        placeholder="도착지 입력"
                        className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-bold focus:outline-none focus:border-[#5C5CFF] focus:ring-1 focus:ring-[#5C5CFF] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all placeholder:text-gray-400 placeholder:font-medium"
                    />
                </div>
            </div>

            {/* 퀵 태그 버튼들 */}
            <div className="px-6 mt-5 flex gap-2">
                <button className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">집</button>
                <button className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">회사</button>
                <button className="px-5 py-2 bg-white border border-[#5C5CFF] rounded-full text-sm font-bold text-[#5C5CFF] bg-[#F4F4FF] shadow-sm transition-colors">최근: 강릉역</button>
            </div>

            {/* 하단 고정 버튼 */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg px-5 py-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-[9999]">
                <button
                    onClick={() => navigate('/preference')}
                    className="w-full bg-[#5C5CFF] text-white py-4 rounded-2xl font-bold text-[17px] shadow-[0_8px_20px_rgba(92,92,255,0.3)] hover:bg-indigo-600 active:scale-95 transition-transform"
                >
                    경로 찾기
                </button>
            </div>
        </div>
    );
}