import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import PlayerScreen from './pages/PlayerScreen';
import Login from './pages/Login';
import UserRegister from './pages/UserRegister';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} /> {/* 👈 agregá esto */}

      <Route path="/register" element={<UserRegister />} />
      <Route path="/dashboard" element={<App />} />
      <Route path="/player/:screenKey" element={<PlayerScreen />} />
    </Routes>
  </BrowserRouter>
);
