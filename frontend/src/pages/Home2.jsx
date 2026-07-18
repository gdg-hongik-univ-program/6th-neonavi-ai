import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatusBar = () => (
    <div className="status-bar">
        <span className="time">9:41</span>
        <span className="status-icons">•••</span>
    </div>
);

const Header = () => {
    const navigate = useNavigate(); // 길잡이 소환!

    return (
        <div className="header">
            <div className="logo-section">
                <div className="logo-square"></div>
                <h1 className="logo-text">너네비</h1>
            </div>
            {/* 👇 마이페이지를 명확한 버튼 형태로 변경 👇 */}
            <button
                className="mypage-btn"
                onClick={() => navigate('/mypage')}
            >
                <span className="user-icon">👤</span>
                <span>마이페이지</span>
            </button>
        </div>
    );
};

const TitleAndSubtitle = () => (
    <div className="title-subtitle-section">
        <h2 className="main-title">오늘 어디로 가세요?</h2>
        <p className="main-subtitle">출발지와 도착지를 입력하면,<br />너에게 꼭 맞는 길을 찾아드려요.</p>
    </div>
);

const InputField = ({ icon, placeholder }) => (
    <div className="input-field">
        <span className="input-icon">{icon}</span>
        <input type="text" placeholder={placeholder} className="input-box" />
    </div>
);

const SavedLocations = () => {
    const locations = ["집", "회사", "최근: 강릉역"];
    return (
        <div className="saved-locations-row">
            {locations.map((loc, index) => (
                <span key={index} className="location-tag">{loc}</span>
            ))}
        </div>
    );
};

const MainActionButton = () => (
    <button className="pathfind-button">경로 찾기</button>
);

const DeviceFooter = () => (
    <div className="device-footer">
        <div className="footer-panel"> 너네비: 경로 입력</div>
    </div>
);

// --- Home2 메인 화면 ---
export default function Home2() {
    return (
        <>
            {/* 상단 상태 바 */}
            <StatusBar />

            {/* 실제 화면 콘텐츠 영역 */}
            <div className="page-content">
                <Header />
                <TitleAndSubtitle />
                <InputField icon="📍" placeholder="출발지" />
                <InputField icon="🏁" placeholder="도착지" />
                <SavedLocations />
                <MainActionButton />
            </div>

            {/* 하단 기기 기능 패널 */}
            <DeviceFooter />
        </>
    );
}