import { useState } from 'react';
//export default function RouteOption3({ navigate }) { }
import { useNavigate } from 'react-router-dom';

export default function RouteOption3() {
    const navigate = useNavigate();
    const [passenger, setPassenger] = useState('노약자');
    const [mode, setMode] = useState('Comfort');
    const [autoRecommend, setAutoRecommend] = useState(true);

    return (
        <div className="p-6 bg-white min-h-screen">
            <button onClick={() => navigate(-1)} className="mb-6 text-xl">←</button>
            <h2 className="text-2xl font-bold mb-8">현재 주행 환경 설정</h2>

            <div className="space-y-8">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">이번 주행 동승자</label>
                    <div className="grid grid-cols-4 gap-2">
                        {['혼자', '가족', '노약자', '친구'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPassenger(p)}
                                className={`py-3 rounded-xl text-sm font-bold transition ${passenger === p ? 'bg-indigo-600 text-white shadow-md' : 'border border-gray-200 text-gray-600'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-800">AI 성향 자동 추천</span>
                        <input type="checkbox" checked={autoRecommend} onChange={() => setAutoRecommend(!autoRecommend)} className="toggle-checkbox w-6 h-6 accent-indigo-600" />
                    </div>

                    <p className="text-sm text-gray-500 mb-4">원하시면 모드를 직접 고를 수도 있어요</p>
                    <div className="flex space-x-2">
                        {['Comfort', 'Sports', 'Eco'].map(m => (
                            <button
                                key={m}
                                disabled={autoRecommend}
                                onClick={() => setMode(m)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition ${autoRecommend ? 'opacity-50 bg-gray-200' : mode === m ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={() => navigate('/suggest')}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg absolute bottom-8 left-0 right-0 mx-6 w-[calc(100%-3rem)]"
            >
                분석하고 경로 추천받기
            </button>
        </div>
    );
}