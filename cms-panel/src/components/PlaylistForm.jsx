import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const PlaylistForm = () => {
  const [screens, setScreens] = useState([]);
  const [contents, setContents] = useState([]);
  const [screenId, setScreenId] = useState('');
  const [contentId, setContentId] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/screens/`).then(res => setScreens(res.data));
    axios.get(`${API_URL}/contents/`).then(res => setContents(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/playlists/`, {
        screen_id: parseInt(screenId),
        content_id: parseInt(contentId),
        order_index: parseInt(orderIndex),
      });
      setMessage('🎯 Contenido asignado a pantalla');
      setScreenId('');
      setContentId('');
      setOrderIndex(0);
    } catch (error) {
      console.error(error);
      setMessage('❌ Error al asignar contenido');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Asignar contenido a pantalla</h3>
      <form onSubmit={handleSubmit}>
        <select value={screenId} onChange={(e) => setScreenId(e.target.value)} required>
          <option value="">Seleccionar pantalla</option>
          {screens.map((s) => (
            <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
          ))}
        </select>

        <select value={contentId} onChange={(e) => setContentId(e.target.value)} required>
          <option value="">Seleccionar contenido</option>
          {contents.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
          ))}
        </select>

        <input
          type="number"
          value={orderIndex}
          onChange={(e) => setOrderIndex(e.target.value)}
          placeholder="Orden (0, 1, 2...)"
        />

        <button type="submit">Asignar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PlaylistForm;
