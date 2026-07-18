import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
//export default function Feedback6({ navigate }) { }

export default function Feedback6() {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);

    return (
        <div className="p-6 bg-white min-h-screen flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl mb-6">
                🏁
            </div>
            <h2 className="text-2xl font-bold mb-2">목적지에 도착했습니다</h2>
            <p className="text-gray-500 mb-10 text-sm">
                방금 주행하신 'Comfort 추천 경로'는 어떠셨나요?<br />
                피드백은 다음 맞춤 안내에 반영됩니다.
            </p>

            <div className="flex gap-2 mb-12">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-4xl transition ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                        ★
                    </button>
                ))}
            </div>

            <button
                onClick={() => navigate('/home')}
                className={`w-full py-4 rounded-xl font-bold text-lg transition ${rating > 0 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                disabled={rating === 0}
            >
                피드백 보내기
            </button>
            <button
                onClick={() => navigate('/home')}
                className="mt-4 text-gray-400 text-sm font-semibold"
            >
                다음에 할게요
            </button>
        </div>
    );
}