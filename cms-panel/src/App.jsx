import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import ContentUploadForm from './components/ContentUploadForm';
import ContentList from './components/ContentList';
import ScreenRegister from './components/ScreenRegister';
import ContentAssignment from './components/ContentAssignment';
import PlaylistViewer from './components/PlaylistViewer';
import { jwtDecode } from "jwt-decode";
import ScreenList from "./components/ScreenList";


function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserEmail(decoded.sub);
    }
  }, [token]);

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return (
    <div>
      <h1>Panel CMS</h1>
      <p>Sesión iniciada como: <strong>{userEmail}</strong></p>
      <ScreenRegister token={token} />
      <ContentAssignment token={token} />
      <ScreenList token={token} />

      <PlaylistViewer />
      <ContentUploadForm token={token} />
      <ContentList />
      <button
        onClick={() => {
          localStorage.removeItem("token");
          setToken(null); // esto ahora funciona porque fuerza el rerender
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default App;