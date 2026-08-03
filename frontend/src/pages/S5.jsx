import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function S5() {
    const navigate = useNavigate();

    return (
        <>
            {/* ✨ 시계(status-bar) 대신 들어간 뒤로 가기 영역 */}
            <div className="w-full py-4 px-5 bg-white flex items-center z-50 relative border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="text-2xl font-bold text-gray-700"
                >
                    ←
                </button>
            </div>

            {/* 전체 화면 컨테이너 */}
            <div className="drive-page-content" style={{ height: 'calc(100vh - 60px)' }}>

                {/* 상단 보라색 방향 안내 패널 */}
                <div className="drive-top-panel">
                    <div className="turn-icon">↱</div>
                    <div className="turn-info">
                        <h2>300m 앞 우회전</h2>
                        <p>강릉대로 방면</p>
                    </div>
                </div>

                {/* 지도 영역 */}
                <div id="driving-map" className="drive-map-section">
                    <div className="floating-mode-badge">
                        🛋 Comfort
                    </div>
                </div>

                {/* 하단 주행 정보 패널 */}
                <div className="drive-bottom-panel">
                    <div className="drive-status-text">
                        <p>남은 시간 28분 · 도착 14:32</p>
                        <p className="distance">남은 거리 12.4km</p>
                    </div>
                    {/* 안내 종료 누르면 피드백(S6)으로 이동 */}
                    <button
                        className="end-drive-btn"
                        onClick={() => navigate('/feedback')}
                    >
                        안내 종료
                    </button>
                </div>

            </div>

            <div className="device-footer">
                <div className="footer-panel">기능 4 · 주행 안내</div>
            </div>
        </>
    );
}