import React, { useEffect, useRef, useState } from 'react';

import { searchPlaces } from '../api/naviApi';

/**
 * 장소 입력 + 검색 결과 선택.
 *
 * "강남역"처럼 모호하게 입력하면 후보(강남역 2호선 / 신분당선 / 사거리…)를 보여주고
 * 사용자가 직접 고르게 한다. 고른 장소의 좌표를 함께 전달해 지점을 확정한다.
 *
 * @param {string} icon         입력칸 앞 아이콘
 * @param {string} placeholder
 * @param {object} value        { name, lng, lat } — 확정된 장소(없으면 null)
 * @param {string} text         입력창에 보이는 글자
 * @param {func}   onTextChange 글자가 바뀔 때
 * @param {func}   onSelect     후보를 골랐을 때 ({name, address, lng, lat})
 */
export default function PlaceInput({
    icon,
    placeholder,
    text,
    onTextChange,
    onSelect
}) {
    const [places, setPlaces] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const skipNextSearch = useRef(false);

    // 입력이 멈추면(300ms) 검색한다.
    useEffect(() => {
        if (skipNextSearch.current) {
            skipNextSearch.current = false;
            return undefined;
        }

        const query = (text || '').trim();
        if (query.length < 2) {
            setPlaces([]);
            return undefined;
        }

        let isActive = true;
        const timer = setTimeout(async () => {
            const results = await searchPlaces(query);
            if (!isActive) return;
            setPlaces(results);
            setIsOpen(results.length > 0);
        }, 300);

        return () => {
            isActive = false;
            clearTimeout(timer);
        };
    }, [text]);

    const handleSelect = (place) => {
        skipNextSearch.current = true;   // 선택으로 바뀐 글자는 다시 검색하지 않음
        onTextChange(place.name);
        onSelect(place);
        setIsOpen(false);
        setPlaces([]);
    };

    return (
        <div className="relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <span className="mr-3">{icon}</span>
                <input
                    type="text"
                    value={text}
                    placeholder={placeholder}
                    onChange={(event) => {
                        onTextChange(event.target.value);
                        onSelect(null);   // 글자를 고치면 확정 해제
                    }}
                    onFocus={() => setIsOpen(places.length > 0)}
                    className="flex-1 outline-none text-gray-900 font-medium bg-transparent"
                />
            </div>

            {isOpen && (
                <ul className="absolute z-40 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                    {places.map((place) => (
                        <li key={`${place.name}-${place.lng}-${place.lat}`}>
                            <button
                                type="button"
                                onClick={() => handleSelect(place)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                            >
                                <p className="font-bold text-gray-900 text-sm">
                                    {place.name}
                                </p>
                                {place.address && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {place.address}
                                    </p>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
