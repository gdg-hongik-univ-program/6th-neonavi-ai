// src/components/TopNavBar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopNavBar({ title, hideBack = false }) {
    const navigate = useNavigate();

    return (
        <div className="w-full py-4 px-5 bg-white flex items-center z-50 relative border-b border-gray-100">
            {hideBack ? (
                <div className="w-8"></div>
            ) : (
                <button
                    onClick={() => navigate(-1)}
                    className="text-2xl font-bold text-gray-700 hover:text-gray-900 transition-colors"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    ←
                </button>
            )}

            {/* 페이지 제목을 넘겨주면 가운데에 표시해주는 기능 (지워도됨) */}
            {title && (
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-gray-800">
                    {title}
                </h1>
            )}
        </div>
    );
}