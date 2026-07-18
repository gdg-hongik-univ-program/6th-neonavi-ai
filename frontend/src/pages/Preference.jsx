import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Preference() {
    const navigate = useNavigate();

    // 사용자가 선택한 값을 저장하는 공간 (초기값 세팅)
    const [age, setAge] = useState('42');
    const [gender, setGender] = useState('여성');
    const [carType, setCarType] = useState('세단');
    const [passenger, setPassenger] = useState('노약자');
    const [mode, setMode] = useState('');

    return (
        <>
            {/* 상단 상태 바 */}
            <div className="status-bar">
                <span className="time">9:41</span>
                <span className="status-icons">•••</span>
            </div>

            <div className="page-content" style={{ overflowY: 'auto', paddingBottom: '40px' }}>

                {/* 뒤로가기 및 타이틀 */}
                <div className="pref-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h2 className="pref-title">어떻게 운전하세요?</h2>
                </div>
                <p className="pref-subtitle">정보를 입력하면 AI가 당신에게<br />맞는 성향을 분석해요.</p>

                {/* 나이 입력 */}
                <div className="pref-section">
                    <label className="pref-label">나이</label>
                    <input
                        type="number"
                        className="pref-input-box"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                </div>

                {/* 성별 선택 (토글) */}
                <div className="pref-section">
                    <label className="pref-label">성별</label>
                    <div className="gender-toggle">
                        <button
                            className={`gender-btn ${gender === '남성' ? 'active' : ''}`}
                            onClick={() => setGender('남성')}
                        >남성</button>
                        <button
                            className={`gender-btn ${gender === '여성' ? 'active' : ''}`}
                            onClick={() => setGender('여성')}
                        >여성</button>
                    </div>
                </div>

                {/* 차종 선택 */}
                <div className="pref-section">
                    <label className="pref-label">차종</label>
                    <div className="pill-group">
                        {['세단', 'SUV', '스포츠', '경차'].map((type) => (
                            <button
                                key={type}
                                className={`pill-btn ${carType === type ? 'active' : ''}`}
                                onClick={() => setCarType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 동승자 선택 */}
                <div className="pref-section">
                    <label className="pref-label">동승자</label>
                    <div className="pill-group">
                        {['혼자', '가족', '노약자', '친구'].map((type) => (
                            <button
                                key={type}
                                className={`pill-btn ${passenger === type ? 'active' : ''}`}
                                onClick={() => setPassenger(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 모드 직접 선택 */}
                <div className="pref-section" style={{ marginTop: '30px' }}>
                    <p className="mode-hint">원하면 모드를 직접 고를 수도 있어요</p>
                    <div className="pill-group mode-group">
                        <button className={`pill-btn mode-btn ${mode === 'Comfort' ? 'active' : ''}`} onClick={() => setMode('Comfort')}>🛋 Comfort</button>
                        <button className={`pill-btn mode-btn ${mode === 'Sports' ? 'active' : ''}`} onClick={() => setMode('Sports')}>🏎 Sports</button>
                        <button className={`pill-btn mode-btn ${mode === 'Eco' ? 'active' : ''}`} onClick={() => setMode('Eco')}>🌱 Eco</button>
                    </div>
                </div>

                {/* 하단 완료 버튼 */}
                <button className="pathfind-button" style={{ marginTop: '20px', marginBottom: '10px' }}>
                    분석하고 경로 추천받기
                </button>

            </div>

            {/* 하단 기기 기능 패널 */}
            <div className="device-footer">
                <div className="footer-panel">기능 2 · 성향 정보 입력</div>
            </div>
        </>
    );
}