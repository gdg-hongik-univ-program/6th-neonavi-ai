import React from 'react';

export default function Navi5() {
    return (
        <>
            {/* 상단 상태 바 (주행 중에는 보라색 배경에 맞추거나 흰색으로 둠) */}
            <div className="status-bar" style={{ backgroundColor: '#FFFFFF' }}>
                <span className="time">9:41</span>
                <span className="status-icons">•••</span>
            </div>

            {/* 전체 화면을 채우기 위해 꽉 차는 컨테이너 사용 */}
            <div className="drive-page-content">

                {/* 상단 보라색 방향 안내 패널 */}
                <div className="drive-top-panel">
                    <div className="turn-icon">↱</div> {/* 우회전 화살표 아이콘 */}
                    <div className="turn-info">
                        <h2>300m 앞 우회전</h2>
                        <p>강릉대로 방면</p>
                    </div>
                </div>

                {/* 👇 실제 지도 API가 화면을 꽉 채울 빈 공간 👇 */}
                <div id="driving-map" className="drive-map-section">

                    {/* 지도 우측 상단에 떠 있는 모드 뱃지 */}
                    <div className="floating-mode-badge">
                        🛋 Comfort
                    </div>

                </div>
                {/* 👆 지도 영역 끝 👆 */}

                {/* 하단 주행 정보 및 안내 종료 패널 */}
                <div className="drive-bottom-panel">
                    <div className="drive-status-text">
                        <p>남은 시간 28분 · 도착 14:32</p>
                        <p className="distance">남은 거리 12.4km</p>
                    </div>
                    <button className="end-drive-btn">
                        안내 종료
                    </button>
                </div>

            </div>

            {/* 하단 기기 기능 패널 */}
            <div className="device-footer">
                <div className="footer-panel">기능 4 · 주행 안내</div>
            </div>
        </>
    );
}