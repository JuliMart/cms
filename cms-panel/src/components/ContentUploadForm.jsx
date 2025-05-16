import React, { useState } from 'react';
import { uploadContent } from '../api/api.js';

const ContentUploadForm = ({ token }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('image');
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(800);  // valores por defecto
  const [height, setHeight] = useState(600);
  const [message, setMessage] = useState('');

  const resizeImage = (file, width, height) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, { type: file.type });
          resolve(resizedFile);
        }, file.type);
      };

      reader.readAsDataURL(file);
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Selecciona un archivo');

    let fileToSend = file;

    // Solo redimensionar si es imagen
    if (type === 'image') {
      fileToSend = await resizeImage(file, width, height);
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('file', file);
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

        {/* Mostrar opciones solo si es imagen */}
        {type === 'image' && (
          <>
            <input
              type="number"
              placeholder="Ancho"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Alto"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </>
        )}
     
      <button type="submit">Subir</button>
      {message && <p>{message}</p>}
    </form>
    </section>

  );
};

export default ContentUploadForm;
