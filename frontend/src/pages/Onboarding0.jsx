import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding0() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col relative font-sans pb-32">

            {/* 메인 콘텐츠 영역: 화면 중앙 정렬 */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 mt-16">

                {/* 앱 로고 아이콘 (보라색 포인트 컬러 적용) */}
                <div className="w-24 h-24 bg-[#5C5CFF] rounded-[2rem] shadow-[0_10px_25px_rgba(92,92,255,0.3)] flex items-center justify-center mb-10">
                    <span className="text-[48px]">🚙</span>
                </div>

                {/* 메인 타이틀 (텍스트는 검정색, 브랜드 이름만 보라색 포인트) */}
                <h1 className="text-gray-900 text-[32px] font-extrabold text-center leading-[1.35] mb-5 tracking-tight">
                    너만을 위한<br />맞춤 내비, <span className="text-[#5C5CFF]">너네비</span>
                </h1>

                {/* 서브 설명 텍스트 (다른 페이지와 동일한 톤의 회색) */}
                <p className="text-gray-500 text-center text-[16px] font-medium leading-relaxed">
                    운전자의 성향과 동승자를 분석하여<br />
                    가장 편안하고 안전한 길을 찾아드려요.
                </p>

            </div>

            {/* 하단 고정 '시작하기' 버튼 (다른 페이지들과 완벽하게 동일한 스타일) */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg px-5 py-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-[9999]">
                <button
                    onClick={() => navigate('/home')}
                    className="w-full bg-[#5C5CFF] text-white py-4 rounded-2xl font-bold text-[17px] shadow-[0_8px_20px_rgba(92,92,255,0.3)] hover:bg-indigo-600 active:scale-95 transition-transform"
                >
                    시작하기
                </button>
            </div>

        </div>
    );
}