import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

const ScreenList = ({ token }) => {
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/screens`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then((res) => setScreens(res.data))
    .catch((err) => console.error("Error al cargar pantallas:", err));
  }, [token]);

  return (
    <div>
      <h2>Mis Pantallas</h2>
      <ul>
        {screens.map((screen) => (
          <li key={screen.id}>
            {screen.name} - {screen.location} - {screen.screen_key}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScreenList;
