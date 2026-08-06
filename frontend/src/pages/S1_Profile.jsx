import { React, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { saveProfile } from '../api/naviApi';
import {
    DEFAULT_PROFILE,
    readProfile,
    writeProfile
} from '../utils/profileStorage';

export default function S1() {
    const navigate = useNavigate();
    const location = useLocation();

    const isFromMyPage = location.state?.fromMyPage || false;

    // 동승자·짐은 여정마다 바뀌는 값이라 홈(S2)에서 입력받는다.
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // 저장해 둔 프로필이 있으면 불러와 채운다(수정 진입 포함).
    useEffect(() => {
        const saved = readProfile();
        if (saved) {
            setProfile((prev) => ({ ...prev, ...saved }));
        }
    }, []);

    const updateProfile = (key, value) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    const handleBottomButtonClick = async () => {
        if (!profile.age) {
            setErrorMessage('나이를 입력해 주세요.');
            return;
        }

        setIsSaving(true);
        setErrorMessage('');

        try {
            // 서버 저장 + 브라우저 캐시(추천 요청에 사용)
            const saved = await saveProfile(profile);
            writeProfile({ ...profile, id: saved.id });

            if (isFromMyPage) {
                navigate(-1);
            } else {
                navigate('/home');
            }
        } catch (error) {
            console.error('프로필 저장 실패', error);
            setErrorMessage(
                '프로필을 저장하지 못했습니다. 서버 상태를 확인해 주세요.'
            );
        } finally {
            setIsSaving(false);
        }
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

                {/* 4. 차량 연식 */}
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
                {errorMessage && (
                    <p className="mb-3 text-sm font-semibold text-red-500">
                        {errorMessage}
                    </p>
                )}

                <button
                    onClick={handleBottomButtonClick}
                    disabled={isSaving}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-400"
                >
                    {isSaving
                        ? '저장 중...'
                        : isFromMyPage
                            ? '저장하기'
                            : '다음으로'}
                </button>
            </div>
        </div>
    );
}