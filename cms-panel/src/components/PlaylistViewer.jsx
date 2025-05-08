import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const PlaylistViewer = () => {
  const [screenKey, setScreenKey] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [screens, setScreens] = useState([]);
  const [error, setError] = useState('');

  const fetchPlaylist = async () => {
    if (!screenKey) return;
    try {
      const res = await axios.get(`${API_URL}/screens/${screenKey}/playlist`);
      setPlaylist(res.data);
      setError('');
    } catch {
      setPlaylist([]);
      setError('Pantalla no encontrada o sin contenidos.');
    }
  };

  useEffect(() => {
    axios.get(`${API_URL}/screens/`).then(res => setScreens(res.data));
  }, []);

  useEffect(() => {
    fetchPlaylist(); // Actualiza al cambiar screenKey
  }, [screenKey]);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Ver playlist por pantalla</h3>

      <select value={screenKey} onChange={(e) => setScreenKey(e.target.value)}>
        <option value="">Seleccionar pantalla</option>
        {screens.map((s) => (
          <option key={s.id} value={s.screen_key}>
            {s.name} ({s.screen_key})
          </option>
        ))}
      </select>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {playlist.length > 0 && (
        <ul>
          {playlist.map((item) => (
            <li key={item.id}>
              #{item.order_index} - {item.content.name} ({item.content.type})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaylistViewer;
