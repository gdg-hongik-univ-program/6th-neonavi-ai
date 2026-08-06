import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopNavBar from '../components/TopNavBar';

const TRIP_STORAGE_KEY = 'neonaviTrip';
const RECENT_DESTINATION_KEY = 'neonaviRecentDestination';

/**
 * 브라우저에 저장된 최근 도착지를 불러옵니다.
 */
const getRecentDestination = () => {
    try {
        return localStorage.getItem(RECENT_DESTINATION_KEY) || '';
    } catch (error) {
        console.error('최근 도착지를 불러오지 못했습니다.', error);
        return '';
    }
};

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className="header mt-2">
            <div className="logo-section">
                <div className="logo-square" />

                <h1 className="logo-text">
                    너네비
                </h1>
            </div>

            <button
                type="button"
                className="mypage-btn"
                onClick={() => navigate('/mypage')}
            >
                <span className="user-icon">
                    👤
                </span>

                <span>
                    마이페이지
                </span>
            </button>
        </div>
    );
};

export default function S2_Home() {
    const navigate = useNavigate();

    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    // 동승자·짐은 여정마다 달라지므로 프로필이 아니라 여기서 받는다.
    const [passenger, setPassenger] = useState('혼자');
    const [loadKg, setLoadKg] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    // 마지막으로 검색한 도착지를 불러옴
    const [recentDestination, setRecentDestination] =
        useState(getRecentDestination);

    /**
     * 출발지와 도착지를 저장하고 경로 옵션 페이지로 이동합니다.
     */
    const handleFindRoute = () => {
        const trimmedDeparture = departure.trim();
        const trimmedDestination = destination.trim();

        if (!trimmedDeparture || !trimmedDestination) {
            setErrorMessage(
                '출발지와 도착지를 모두 입력해주세요.'
            );
            return;
        }

        const tripData = {
            departure: trimmedDeparture,
            destination: trimmedDestination,
            passenger,
            loadKg
        };

        try {
            // 현재 경로 정보는 이번 탭에서 사용
            sessionStorage.setItem(
                TRIP_STORAGE_KEY,
                JSON.stringify(tripData)
            );

            // 최근 도착지는 브라우저를 다시 열어도 유지
            localStorage.setItem(
                RECENT_DESTINATION_KEY,
                trimmedDestination
            );

            setRecentDestination(trimmedDestination);
        } catch (error) {
            console.error(
                '경로 정보를 저장하지 못했습니다.',
                error
            );
        }

        setErrorMessage('');

        navigate('/option', {
            state: tripData
        });
    };

    /**
     * 집, 회사, 최근 목적지 버튼을 눌렀을 때 입력칸에 적용합니다.
     */
    const handleSavedLocation = (location) => {
        if (location.type === 'departure') {
            setDeparture(location.value);
            return;
        }

        setDestination(location.value);
    };

    const savedLocations = [
        {
            id: 'home',
            label: '집',
            value: '집',
            type: 'departure'
        },
        {
            id: 'company',
            label: '회사',
            value: '회사',
            type: 'destination'
        },
        ...(recentDestination
            ? [
                  {
                      id: 'recent',
                      label: `최근: ${recentDestination}`,
                      value: recentDestination,
                      type: 'destination'
                  }
              ]
            : [])
    ];

    return (
        <>
            {/*
                방문 기록과 관계없이 홈 화면의 뒤로가기는
                항상 시작 페이지로 이동합니다.
            */}
            <TopNavBar backTo="/" />

            <div
                className="page-content"
                style={{ paddingBottom: '80px' }}
            >
                <Header />

                <div className="title-subtitle-section">
                    <h2 className="main-title">
                        오늘 어디로 가세요?
                    </h2>

                    <p className="main-subtitle">
                        출발지와 도착지를 입력하면,
                        <br />
                        너에게 꼭 맞는 길을 찾아드려요.
                    </p>
                </div>

                {/* 출발지 입력 */}
                <div className="input-field">
                    <span className="input-icon">
                        📍
                    </span>

                    <input
                        type="text"
                        value={departure}
                        onChange={(event) => {
                            setDeparture(event.target.value);
                            setErrorMessage('');
                        }}
                        placeholder="출발지"
                        className="input-box"
                        aria-label="출발지"
                    />
                </div>

                {/* 도착지 입력 */}
                <div className="input-field">
                    <span className="input-icon">
                        🏁
                    </span>

                    <input
                        type="text"
                        value={destination}
                        onChange={(event) => {
                            setDestination(event.target.value);
                            setErrorMessage('');
                        }}
                        placeholder="도착지"
                        className="input-box"
                        aria-label="도착지"
                    />
                </div>

                {/* 저장 장소 및 최근 목적지 */}
                <div className="saved-locations-row">
                    {savedLocations.map((location) => (
                        <button
                            key={location.id}
                            type="button"
                            className="location-tag"
                            onClick={() =>
                                handleSavedLocation(location)
                            }
                        >
                            {location.label}
                        </button>
                    ))}
                </div>

                {/* 동승자 선택 */}
                <div className="mt-8 mb-4 px-1">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                        누구와 함께 가시나요?
                    </label>

                    <div className="flex gap-2">
                        {[
                            '혼자',
                            '가족',
                            '노약자',
                            '친구'
                        ].map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() =>
                                    setPassenger(item)
                                }
                                className={`
                                    flex-1
                                    py-3
                                    rounded-xl
                                    text-sm
                                    font-bold
                                    transition
                                    ${
                                        passenger === item
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'border border-gray-200 text-gray-600 bg-white'
                                    }
                                `}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 짐 정도 선택 */}
                <div className="mt-6 mb-4 px-1">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                        짐은 얼마나 싣나요?
                        <span className="text-indigo-600 ml-2">
                            {loadKg} kg
                        </span>
                    </label>

                    <div className="flex gap-2">
                        {[
                            { label: '거의 없음', value: 0 },
                            { label: '보통', value: 30 },
                            { label: '많음', value: 70 }
                        ].map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setLoadKg(item.value)}
                                className={`
                                    flex-1
                                    py-3
                                    rounded-xl
                                    text-sm
                                    font-bold
                                    transition
                                    ${
                                        loadKg === item.value
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'border border-gray-200 text-gray-600 bg-white'
                                    }
                                `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 입력 오류 안내 */}
                {errorMessage && (
                    <p className="mt-3 px-1 text-sm font-semibold text-red-500">
                        {errorMessage}
                    </p>
                )}

                {/* 경로 찾기 */}
                <button
                    type="button"
                    className="pathfind-button mt-4"
                    onClick={handleFindRoute}
                >
                    경로 찾기
                </button>
            </div>

            <div className="device-footer">
                <div className="footer-panel">
                    너네비: 경로 입력
                </div>
            </div>
        </>
    );
}