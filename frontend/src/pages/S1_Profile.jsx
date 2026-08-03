import { React, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function S1() {
    const navigate = useNavigate();
    const location = useLocation();

    const isFromMyPage = location.state?.fromMyPage || false;

    const handleBottomButtonClick = () => {
        if (isFromMyPage) {
            alert("저장 완료");
            navigate(-1);
        } else {
            navigate('/home'); // ✨ 기존 preference 대신 홈으로 바로 이동
        }
    };

    // ✨ passenger 항목 제거됨
    const [profile, setProfile] = useState({
        age: '',
        gender: 'M',
        carType: 'sedan',
        loadKg: 0,
        carAge: 0
    });

    const updateProfile = (key, value) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen pb-24">
            <h1 className="text-2xl font-bold mb-8 mt-2">{isFromMyPage ? '프로필 수정' : '기본 정보를 알려주세요'}</h1>

            <div className="space-y-8">
                {/* 1. 나이 */}
                <div>
                    <label className="block text-base font-extrabold text-gray-900 mb-3">나이</label>
                    <input
                        type="number" placeholder="예: 42" value={profile.age}
                        onChange={(e) => updateProfile('age', e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 p-4 rounded-2xl outline-none focus:border-indigo-600 focus:ring-0 transition-colors font-bold text-gray-900"
                    />
                </div>

                {/* 2. 성별 */}
                <div>
                    <label className="block text-base font-extrabold text-gray-900 mb-3">성별</label>
                    <div className="flex space-x-3">
                        {[{ id: 'M', label: '남성' }, { id: 'F', label: '여성' }].map(g => (
                            <button
                                key={g.id} onClick={() => updateProfile('gender', g.id)}
                                className={`flex-1 py-3 rounded-full font-bold transition-colors duration-200 border-2 ${profile.gender === g.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'}`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. 차종 (동승자 제거되고 바로 차종으로 연결) */}
                <div>
                    <label className="block text-base font-extrabold text-gray-900 mb-3">차종</label>
                    <div className="grid grid-cols-4 gap-2">
                        {[{ id: 'sedan', label: '세단' }, { id: 'suv', label: 'SUV' }, { id: 'compact', label: '경차' }, { id: 'truck', label: '트럭' }].map(c => (
                            <button
                                key={c.id} onClick={() => updateProfile('carType', c.id)}
                                className={`text-sm py-3 rounded-full font-bold transition-colors duration-200 border-2 ${profile.carType === c.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'}`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. 적재량 */}
                <div>
                    <label className="block text-base font-extrabold text-gray-900 mb-3">
                        차량 적재량 <span className="text-indigo-600 ml-2">{profile.loadKg} kg</span>
                    </label>
                    <input
                        type="range" min="0" max="100" step="5" value={profile.loadKg}
                        onChange={(e) => updateProfile('loadKg', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>

                {/* 5. 차량 연식 */}
                <div>
                    <label className="block text-base font-extrabold text-gray-900 mb-3">
                        차량 연식 <span className="text-indigo-600 ml-2">{profile.carAge} 년</span>
                    </label>
                    <input
                        type="range" min="0" max="10" step="1" value={profile.carAge}
                        onChange={(e) => updateProfile('carAge', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t">
                <button
                    onClick={handleBottomButtonClick}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg"
                >
                    {isFromMyPage ? '저장하기' : '다음으로'}
                </button>
            </div>
        </div>
    );
}