import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopNavBar from '../components/TopNavBar';

const TRIP_STORAGE_KEY = 'neonaviTrip';

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className="header mt-2">
            <div className="logo-section">
                <div className="logo-square"></div>
                <h1 className="logo-text">너네비</h1>
            </div>

            <button
                type="button"
                className="mypage-btn"
                onClick={() => navigate('/mypage')}
            >
                <span className="user-icon">👤</span>
                <span>마이페이지</span>
            </button>
        </div>
    );
};

export default function S2_Home() {
    const navigate = useNavigate();

    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [passenger, setPassenger] = useState('혼자');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFindRoute = () => {
        const trimmedDeparture = departure.trim();
        const trimmedDestination = destination.trim();

        if (!trimmedDeparture || !trimmedDestination) {
            setErrorMessage('출발지와 도착지를 모두 입력해주세요.');
            return;
        }

        const tripData = {
            departure: trimmedDeparture,
            destination: trimmedDestination,
            passenger
        };

        sessionStorage.setItem(
            TRIP_STORAGE_KEY,
            JSON.stringify(tripData)
        );

        setErrorMessage('');

        navigate('/option', {
            state: tripData
        });
    };

    const handleSavedLocation = (location) => {
        if (location.startsWith('최근:')) {
            setDestination(
                location.replace('최근:', '').trim()
            );
            return;
        }

        if (location === '집') {
            setDeparture('집');
            return;
        }

        if (location === '회사') {
            setDestination('회사');
        }
    };

    return (
        <>
            {/*
                이 페이지의 화살표는 방문 기록을 따르지 않고
                항상 시작 페이지 "/"로 이동
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

                <div className="input-field">
                    <span className="input-icon">
                        📍
                    </span>

                    <input
                        type="text"
                        value={departure}
                        onChange={(event) =>
                            setDeparture(event.target.value)
                        }
                        placeholder="출발지"
                        className="input-box"
                        aria-label="출발지"
                    />
                </div>

                <div className="input-field">
                    <span className="input-icon">
                        🏁
                    </span>

                    <input
                        type="text"
                        value={destination}
                        onChange={(event) =>
                            setDestination(event.target.value)
                        }
                        placeholder="도착지"
                        className="input-box"
                        aria-label="도착지"
                    />
                </div>

                <div className="saved-locations-row">
                    {[
                        '집',
                        '회사',
                        '최근: 강릉역'
                    ].map((location) => (
                        <button
                            key={location}
                            type="button"
                            className="location-tag"
                            onClick={() =>
                                handleSavedLocation(location)
                            }
                        >
                            {location}
                        </button>
                    ))}
                </div>

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

                {errorMessage && (
                    <p className="mt-3 px-1 text-sm font-semibold text-red-500">
                        {errorMessage}
                    </p>
                )}

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