import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const ScreenRegister = () => {
  const [form, setForm] = useState({
    name: '',
    alias: '',
    location: '',
    address: '',
    screenKey: '',
    orientation: 'horizontal',
    deviceType: 'generic',
    group: '',
    notes: '',
    resolution: '1920x1080',
  });
  const [message, setMessage] = useState('');

  const resolutions = [
    { label: 'HD (1280x720)', value: '1280x720' },
    { label: 'Full HD (1920x1080)', value: '1920x1080' },
    { label: '4K (3840x2160)', value: '3840x2160' },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const [width, height] = form.resolution.split('x').map(Number);
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/screens/`, {
        name: form.name,
        alias: form.alias,
        location: form.location,
        address: form.address,
        screen_key: form.screenKey,
        resolution_width: width,
        resolution_height: height,
        layout_type: 'full',
        status: 'online',
        notes: form.notes,
        orientation: form.orientation,
        device_type: form.deviceType,
        group: form.group,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('✅ Pantalla registrada con éxito');
      setForm({
        name: '', alias: '', location: '', address: '', screenKey: '',
        orientation: 'horizontal', deviceType: 'generic', group: '', notes: '',
        resolution: '1920x1080',
      });
    } catch (error) {
      setMessage('❌ Error al registrar pantalla');
      console.error(error);
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Registrar nueva pantalla</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nombre de la pantalla" className="input" required />
        <input type="text" name="alias" value={form.alias} onChange={handleChange} placeholder="Alias opcional" className="input" />
        <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Ubicación geográfica" className="input" />
        <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Dirección física o referencia" className="input" />
        <input type="text" name="screenKey" value={form.screenKey} onChange={handleChange} placeholder="Clave única de pantalla" className="input" required />

        <select name="orientation" value={form.orientation} onChange={handleChange} className="input">
          <option value="horizontal">Orientación Horizontal</option>
          <option value="vertical">Orientación Vertical</option>
        </select>

        <select name="resolution" value={form.resolution} onChange={handleChange} className="input">
          {resolutions.map(res => (
            <option key={res.value} value={res.value}>{res.label}</option>
          ))}
        </select>

        <input type="text" name="deviceType" value={form.deviceType} onChange={handleChange} placeholder="Tipo de dispositivo (ej: raspberry, smarttv)" className="input" />
        <input type="text" name="group" value={form.group} onChange={handleChange} placeholder="Grupo o zona (opcional)" className="input" />

        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notas adicionales o mantenimiento..." className="input md:col-span-2 h-20" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-2">Registrar</button>
      </form>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </section>
  );
};

export default ScreenRegister;
