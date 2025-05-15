import React, { useState } from 'react';
import { uploadContent } from '../api/api.js';

const ContentUploadForm = ({ token }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('image');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Selecciona un archivo');

    const formData = new FormData();
    formData.append('name', contentName);
    formData.append('type', contentType);
    formData.append('uploaded_by', 1); // ID fijo para demo
    formData.append('file', selectedFile);

    try {
      await uploadContent(formData, token);
      setMessage('Contenido subido exitosamente');
    } catch (err) {
      setMessage('Error al subir contenido');
      console.error(err);
    }
  };

  return (
  <section>

    <form onSubmit={handleSubmit}>
      <h3>Subir contenido</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="image">Imagen</option>
        <option value="video">Video</option>
        <option value="html">HTML</option>
      </select>
      <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Subir</button>
      {message && <p>{message}</p>}
    </form>
    </section>

  );
};

export default ContentUploadForm;
