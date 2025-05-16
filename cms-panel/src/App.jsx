import React, { useState, useEffect } from 'react';
import ContentUploadForm from './components/ContentUploadForm';
import ContentList from './components/ContentList';
import ScreenRegister from './components/ScreenRegister';
import ContentAssignment from './components/ContentAssignment';
import PlaylistViewer from './components/PlaylistViewer';
import { jwtDecode } from "jwt-decode";
import ScreenList from "./components/ScreenList";
import './App.css';
import { useNavigate, Navigate } from 'react-router-dom';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserEmail(decoded.sub);
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="container">
      <h1>Panel CMS</h1>
      <p>Sesión iniciada como: <strong>{userEmail}</strong></p>
      <ScreenList token={token} />
      <ScreenRegister token={token} />
      <ContentAssignment token={token} />
      <PlaylistViewer />
      <ContentUploadForm token={token} />
      <ContentList token={token}/>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default App;
