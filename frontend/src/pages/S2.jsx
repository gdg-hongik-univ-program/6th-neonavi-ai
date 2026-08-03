import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✨ 시계 대신 '뒤로 가기' 역할을 하는 상단 바 컴포넌트 생성
const TopNavBar = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full pt-4 pb-2 px-6 flex items-center bg-transparent">
            <button
                onClick={() => navigate(-1)}
                className="text-2xl font-bold text-gray-700 hover:text-gray-900 transition-colors"
            >
                ←
            </button>
        </div>
    );
};

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="header mt-2">
            <div className="logo-section">
                <div className="logo-square"></div>
                <h1 className="logo-text">너네비</h1>
            </div>
            <button className="mypage-btn" onClick={() => navigate('/mypage')}>
                <span className="user-icon">👤</span>
                <span>마이페이지</span>
            </button>
        </div>
    );
};

export default function S2() {
    const navigate = useNavigate();
    const [passenger, setPassenger] = useState('혼자');

    return (
        <>
            {/* ✨ 최상단에 뒤로 가기 바 배치 */}
            <TopNavBar />

            <div className="page-content" style={{ paddingBottom: '80px' }}>
                <Header />

                <div className="title-subtitle-section">
                    <h2 className="main-title">오늘 어디로 가세요?</h2>
                    <p className="main-subtitle">출발지와 도착지를 입력하면,<br />너에게 꼭 맞는 길을 찾아드려요.</p>
                </div>

                <div className="input-field">
                    <span className="input-icon">📍</span>
                    <input type="text" placeholder="출발지" className="input-box" />
                </div>
                <div className="input-field">
                    <span className="input-icon">🏁</span>
                    <input type="text" placeholder="도착지" className="input-box" />
                </div>

                <div className="saved-locations-row">
                    {["집", "회사", "최근: 강릉역"].map((loc, index) => (
                        <span key={index} className="location-tag">{loc}</span>
                    ))}
                </div>

                {/* 동승자 빠른 설정 */}
                <div className="mt-8 mb-4 px-1">
                    <label className="block text-sm font-bold text-gray-700 mb-3">누구와 함께 가시나요?</label>
                    <div className="flex gap-2">
                        {['혼자', '가족', '노약자', '친구'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPassenger(p)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition ${passenger === p ? 'bg-indigo-600 text-white shadow-md' : 'border border-gray-200 text-gray-600 bg-white'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 경로 찾기 버튼 */}
                <button className="pathfind-button mt-4" onClick={() => navigate('/option')}>
                    경로 찾기
                </button>
            </div>

            <div className="device-footer">
                <div className="footer-panel"> 너네비: 경로 입력</div>
            </div>
        </>
    );
}