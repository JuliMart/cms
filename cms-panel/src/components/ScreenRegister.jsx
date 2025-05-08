import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const ScreenRegister = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [screenKey, setScreenKey] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // 👈 necesario
      await axios.post(`${API_URL}/screens/`, {
        name,
        location,
        screen_key: screenKey,
      }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`  // 👈 importante
          },
        });
      setMessage('Pantalla registrada con éxito ✅');
      setName('');
      setLocation('');
      setScreenKey('');
    } catch (error) {
      setMessage('❌ Error al registrar pantalla');
      console.error(error);
    }
  };
  
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Registrar pantalla</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Clave única (screenKey)"
          value={screenKey}
          onChange={(e) => setScreenKey(e.target.value)}
          required
        />
        <button type="submit">Registrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ScreenRegister;
