import React from 'react';
import './App.css';
import './page.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Onboarding0 from './pages/Onboarding0';
import ProfileSetup1 from './pages/ProfileSetup1';
import Preference from './pages/Preference';
import Home2 from './pages/Home2';
import RouteOption3 from './pages/RouteOption3';
import Suggest4 from './pages/Suggest4';
import Navi5 from './pages/Navi5';
import Feedback6 from './pages/Feedback6';
import MyPage7 from './pages/MyPage7';

export default function App() {
  return (
    // Wrapper부분인데 pc화면에 맞추려면 삭제해도 됩니다
    <div className="min-h-screen bg-gray-200 flex justify-center items-center">

      <div className="w-full max-w-lg h-screen bg-white relative shadow-2xl overflow-y-auto overflow-x-hidden">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Onboarding0 />} />
            <Route path="/profile" element={<ProfileSetup1 />} />
            <Route path="/preference" element={<Preference />} />
            <Route path="/home" element={<Home2 />} />
            <Route path="/option" element={<RouteOption3 />} />
            <Route path="/suggest" element={<Suggest4 />} />
            <Route path="/navi" element={<Navi5 />} />
            <Route path="/feedback" element={<Feedback6 />} />
            <Route path="/mypage" element={<MyPage7 />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}