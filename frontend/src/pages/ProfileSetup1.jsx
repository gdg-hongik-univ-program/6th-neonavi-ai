import { useState } from 'react';
//export default function ProfileSetup1({ navigate }) { }
import { useNavigate } from 'react-router-dom';

export default function ProfileSetup1() {
    const navigate = useNavigate();
    const [gender, setGender] = useState('남성');
    const [carType, setCarType] = useState('세단');

    return (
        <div className="p-6 bg-white min-h-screen">
            <h2 className="text-2xl font-bold mb-6 mt-4">기본 정보를 알려주세요</h2>
            <p className="text-gray-500 mb-8 text-sm">한 번만 설정하면 이후 맞춤 안내에 사용됩니다.</p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">나이</label>
                    <input type="number" placeholder="예: 42" className="w-full bg-gray-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">성별</label>
                    <div className="flex space-x-2">
                        {['남성', '여성'].map(g => (
                            <button
                                key={g}
                                onClick={() => setGender(g)}
                                className={`flex-1 py-4 rounded-xl font-bold transition ${gender === g ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">차종</label>
                    <div className="grid grid-cols-4 gap-2">
                        {['세단', 'SUV', '스포츠', '경차'].map(c => (
                            <button
                                key={c}
                                onClick={() => setCarType(c)}
                                className={`py-3 rounded-xl text-sm font-bold transition ${carType === c ? 'bg-indigo-600 text-white' : 'border border-gray-200 text-gray-600'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={() => navigate('/preference')}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg mt-12 hover:bg-indigo-700 transition"
            >
                다음으로
            </button>
        </div>
    );
}