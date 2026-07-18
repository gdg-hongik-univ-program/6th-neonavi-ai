import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Preference() {
    const navigate = useNavigate();

    // 버튼 클릭 시 색상이 변하도록 상태(State) 관리
    const [gender, setGender] = useState('여성');
    const [car, setCar] = useState('세단');
    const [passenger, setPassenger] = useState('노약자');
    const [mode, setMode] = useState('');

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col relative font-sans pb-36">

            {/* 상단 뒤로가기 및 타이틀 */}
            <div className="px-5 pt-12 pb-2 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-2xl text-gray-800 font-bold hover:text-gray-500 p-2 -ml-2">←</button>
                <h2 className="font-extrabold text-[22px] text-gray-900 tracking-tight">어떻게 운전하세요?</h2>
            </div>

            <div className="px-7 mt-1 mb-8">
                <p className="text-gray-500 text-[15px] leading-relaxed font-medium">
                    정보를 입력하면 AI가 당신에게<br />
                    맞는 성향을 분석해요.
                </p>
            </div>

            {/* 입력 폼 영역 */}
            <div className="px-6 space-y-7">

                {/* 나이 */}
                <div>
                    <label className="block text-[15px] font-extrabold text-gray-800 mb-3">나이</label>
                    <input
                        type="number"
                        defaultValue={42}
                        className="w-1/3 bg-white border border-gray-200 rounded-2xl py-3 px-4 text-gray-900 font-bold text-lg focus:outline-none focus:border-[#5C5CFF] shadow-sm text-center"
                    />
                </div>

                {/* 성별 토글 */}
                <div>
                    <label className="block text-[15px] font-extrabold text-gray-800 mb-3">성별</label>
                    <div className="flex bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm">
                        {['남성', '여성'].map(g => (
                            <button
                                key={g} onClick={() => setGender(g)}
                                className={`flex-1 py-3.5 rounded-xl font-bold text-[15px] transition-all ${gender === g ? 'bg-[#5C5CFF] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 차종 */}
                <div>
                    <label className="block text-[15px] font-extrabold text-gray-800 mb-3">차종</label>
                    <div className="flex gap-2.5">
                        {['세단', 'SUV', '스포츠', '경차'].map(c => (
                            <button
                                key={c} onClick={() => setCar(c)}
                                className={`flex-1 py-3 rounded-full border-2 text-[14px] font-bold transition-all ${car === c ? 'border-[#5C5CFF] bg-[#5C5CFF] text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 동승자 */}
                <div>
                    <label className="block text-[15px] font-extrabold text-gray-800 mb-3">동승자</label>
                    <div className="flex gap-2.5">
                        {['혼자', '가족', '노약자', '친구'].map(p => (
                            <button
                                key={p} onClick={() => setPassenger(p)}
                                className={`flex-1 py-3 rounded-full border-2 text-[14px] font-bold transition-all ${passenger === p ? 'border-[#5C5CFF] bg-[#5C5CFF] text-white shadow-sm' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 주행 모드 선택 (선택 사항) */}
                <div className="pt-2">
                    <p className="text-[13px] font-bold text-gray-400 mb-3">원하면 모드를 직접 고를 수도 있어요</p>
                    <div className="flex gap-3">
                        {['Comfort', 'Sports', 'Eco'].map(m => (
                            <button
                                key={m} onClick={() => setMode(m)}
                                className={`flex-1 py-3.5 rounded-2xl border-2 text-[14px] font-extrabold flex justify-center items-center gap-1.5 transition-all ${mode === m ? 'border-[#5C5CFF] bg-[#F4F4FF] text-[#5C5CFF]' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
                            >
                                {m === 'Comfort' && '🚙'}
                                {m === 'Sports' && '🏎️'}
                                {m === 'Eco' && '🌱'}
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 하단 고정 버튼 */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg px-5 py-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-[9999]">
                <button
                    onClick={() => navigate('/suggest')}
                    className="w-full bg-[#5C5CFF] text-white py-4 rounded-2xl font-bold text-[17px] shadow-[0_8px_20px_rgba(92,92,255,0.3)] hover:bg-indigo-600 active:scale-95 transition-transform"
                >
                    분석하고 경로 추천받기
                </button>
            </div>

        </div>
    );
}