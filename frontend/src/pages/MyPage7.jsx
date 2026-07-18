//export default function MyPage7({ navigate }) { }
import { useNavigate } from 'react-router-dom';

export default function MyPage7() {
    const navigate = useNavigate();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <button onClick={() => navigate(-1)} className="mb-6 text-xl">←</button>
            <h2 className="text-2xl font-bold mb-8">마이페이지</h2>

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">😎</div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800">김운전 님</h3>
                    <p className="text-sm text-gray-500">42세 · 남성 · 세단 오너</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
                <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50" onClick={() => navigate('/profile')}>
                    <span className="font-bold text-gray-700">프로필 수정</span>
                    <span className="text-gray-400">→</span>
                </div>
                <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50" onClick={() => navigate('/preference')}>
                    <span className="font-bold text-gray-700">운전 성향 설문 다시하기</span>
                    <span className="text-gray-400">→</span>
                </div>
                <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                    <span className="font-bold text-gray-700">주행 기록 및 피드백 내역</span>
                    <span className="text-gray-400">→</span>
                </div>
            </div>
        </div>
    );
}