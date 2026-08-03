import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function S6() {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);

    // 점수에 따라 변하는 다이나믹 컬러 & 텍스트 설정
    const getFeedbackConfig = () => {
        if (rating === 0) return { starColor: 'text-gray-300', btnColor: 'bg-gray-200 text-gray-400', btnText: '피드백 보내기' };
        if (rating <= 2) return { starColor: 'text-orange-400', btnColor: 'bg-orange-500 text-white shadow-lg', btnText: `별 ${rating}개 · 아쉬워요` };
        if (rating === 3) return { starColor: 'text-yellow-400', btnColor: 'bg-yellow-400 text-white shadow-lg', btnText: `별 3개 · 무난했어요` };
        return { starColor: 'text-indigo-600', btnColor: 'bg-indigo-600 text-white shadow-lg', btnText: `별 ${rating}개 · 아주 만족해요!` };
    };

    const config = getFeedbackConfig();

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

            {/* ✨ 빈 별(☆)과 꽉 찬 별(★)이 직관적으로 바뀌는 영역 */}
            <div className="flex justify-center gap-3 w-full px-4 mb-16">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-5xl focus:outline-none transition-colors duration-200 ${rating >= star ? config.starColor : 'text-gray-300'
                            }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        {/* ✨ 핵심 변경 포인트: 점수에 도달했으면 ★, 아니면 ☆ */}
                        {rating >= star ? '★' : '☆'}
                    </button>
                ))}
            </div>

            {/* 하단 버튼 */}
            <button
                onClick={() => navigate('/home')}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${config.btnColor}`}
                disabled={rating === 0}
            >
                {config.btnText}
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