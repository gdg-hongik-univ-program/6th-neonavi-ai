import React from 'react';

// API 연결 전 임시 컴포넌트
export default function Navigation() {
    return (
        <div style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "#e5e7eb",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
        }}>
            <h2 style={{ color: "#374151", fontWeight: "bold" }}>🗺️ 지도 영역 (임시)</h2>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
                API연동
            </p>
        </div>
    );
}