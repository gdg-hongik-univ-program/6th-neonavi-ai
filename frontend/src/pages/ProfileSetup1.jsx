import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileSetup1() {
    const navigate = useNavigate();

    // Schema(UserProfile) 규칙에 맞춘 상태 관리
    const [profile, setProfile] = useState({
        age: '',
        gender: 'M',
        passenger: 'alone',
        carType: 'sedan',
        loadKg: 0,
        carAge: 0
    });

    const updateProfile = (key, value) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        console.log("저장될 프로필:", profile);
        navigate('/preference');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen pb-24">
            <h2 className="text-2xl font-bold mb-6 mt-4">기본 정보를 알려주세요</h2>
            <p className="text-gray-500 mb-8 text-sm">한 번만 설정하면 이후 맞춤 안내에 사용됩니다.</p>

            <div className="space-y-8">

                {/* 1. 나이 */}
                <div>
                    <label className="block text-base font-extrabold text-gray-900 mb-3">나이</label>
                    <input
                        type="number"
                        placeholder="예: 42"
                        value={profile.age}
                        onChange={(e) => updateProfile('age', e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 p-4 rounded-2xl outline-none focus:border-indigo-600 focus:ring-0 transition-colors font-bold text-gray-900"
                    />
                </div>

                {/* 2. 성별 */}
                <div>
                    <label className="block text-base font-extrabold text-gray-900 mb-3">성별</label>
                    <div className="flex space-x-3">
                        {[
                            { id: 'M', label: '남성' },
                            { id: 'F', label: '여성' }
                        ].map(g => (
                            <button
                                key={g.id}
                                onClick={() => updateProfile('gender', g.id)}
                                className={`flex-1 py-3 rounded-full font-bold transition-colors duration-200 border-2 ${profile.gender === g.id
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                                    }`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. 동승자 */}
                <div>
                    <label className="block text-base font-extrabold text-gray-900 mb-3">동승자</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'alone', label: '혼자' },
                            { id: 'family', label: '가족' },
                            { id: 'vulnerable', label: '노약자' },
                            { id: 'friend', label: '친구/지인' }
                        ].map(p => (
                            <button
                                key={p.id}
                                onClick={() => updateProfile('passenger', p.id)}
                                className={`py-3 rounded-full font-bold transition-colors duration-200 border-2 ${profile.passenger === p.id
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. 차종 */}
                <div>
                    <label className="block text-base font-extrabold text-gray-900 mb-3">차종</label>
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { id: 'sedan', label: '세단' },
                            { id: 'suv', label: 'SUV' },
                            { id: 'compact', label: '경차' },
                            { id: 'truck', label: '트럭' }
                        ].map(c => (
                            <button
                                key={c.id}
                                onClick={() => updateProfile('carType', c.id)}
                                className={`text-sm py-3 rounded-full font-bold transition-colors duration-200 border-2 ${profile.carType === c.id
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                                    }`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 5. 적재량 (슬라이더) */}
                <div>
                    <label className="block text-base font-extrabold text-gray-900 mb-3">
                        차량 적재량 <span className="text-indigo-600 ml-2">{profile.loadKg} kg</span>
                    </label>
                    <input
                        type="range"
                        min="0" max="100" step="5"
                        value={profile.loadKg}
                        onChange={(e) => updateProfile('loadKg', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2 font-bold">
                        <span>0 kg</span>
                        <span>100 kg</span>
                    </div>
                </div>

                {/* 6. 차량 연식 (슬라이더) */}
                <div>
                    <label className="block text-base font-extrabold text-gray-900 mb-3">
                        차량 연식 <span className="text-indigo-600 ml-2">{profile.carAge} 년</span>
                    </label>
                    <input
                        type="range"
                        min="0" max="10" step="1"
                        value={profile.carAge}
                        onChange={(e) => updateProfile('carAge', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2 font-bold">
                        <span>0 년</span>
                        <span>10 년</span>
                    </div>
                </div>

            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white py-4 rounded-full font-bold text-lg mt-12 hover:bg-indigo-700 transition-colors shadow-lg"
            >
                다음으로
            </button>
        </div>
    );
}