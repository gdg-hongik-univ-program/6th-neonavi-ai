import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopNavBar({
    title,
    hideBack = false,
    backTo = null
}) {
    const navigate = useNavigate();

    const handleBack = () => {
        // 이동할 주소가 지정된 경우에는 해당 주소로 이동
        if (backTo) {
            navigate(backTo, { replace: true });
            return;
        }

        // 주소가 지정되지 않은 페이지는 일반적인 이전 페이지로 이동
        navigate(-1);
    };

    return (
        <div className="w-full py-4 px-5 bg-white flex items-center z-50 relative border-b border-gray-100">
            {hideBack ? (
                <div className="w-8" />
            ) : (
                <button
                    type="button"
                    onClick={handleBack}
                    className="text-2xl font-bold text-gray-700 hover:text-gray-900 transition-colors"
                    style={{
                        WebkitTapHighlightColor: 'transparent'
                    }}
                    aria-label="뒤로가기"
                >
                    ←
                </button>
            )}

            {title && (
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-gray-800">
                    {title}
                </h1>
            )}
        </div>
    );
}