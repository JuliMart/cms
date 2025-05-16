import React, { useEffect, useState } from 'react';
import { getContents } from '../api/api';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const ContentList = ({ token }) => {
  const [contents, setContents] = useState([]);

  const fetchContents = async () => {
    try {
      const data = await getContents(token);
      setContents(data);
    } catch (error) {
      console.error('Error al cargar contenidos:', error);
    }
  };

  useEffect(() => {
    if (token) fetchContents();
  }, [token]);



  const handleEdit = async (item) => {
    const newName = prompt('Editar nombre del contenido:', item.name);
    if (newName && newName !== item.name) {
      try {
        await axios.put(`${API_URL}/content/${item.id}`, { name: newName },          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchContents();
      } catch (err) {
        console.error('Error al editar contenido:', err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este contenido?')) {
      try {
        await axios.delete(`${API_URL}/content/${id}`);
        fetchContents();
      } catch (err) {
        console.error('Error al eliminar contenido:', err);
      }
    }
  };

  return (
    <section>
      <h2>Contenidos cargados</h2>
      {contents.length === 0 ? (
        <p>No hay contenidos aún.</p>
      ) : (
        <div className="content-grid">
          {contents.map((content) => (
            <div className="content-card" key={content.id}>
              <h3>{content.name} <span>({content.type})</span></h3>

              {content.type === 'image' ? (
                <img
                  src={`${API_URL}${content.url}`}
                  alt={content.name}
                  className="media"
                />
              ) : (
                <video className="media" controls>
                  <source src={`${API_URL}${content.url}`} type="video/mp4" />
                  Tu navegador no soporta video HTML5.
                </video>
              )}

              <p className="timestamp">
                {new Date(content.created_at).toLocaleString()}
              </p>

              <div className="card-actions">
                <button onClick={() => handleEdit(content)}>Editar</button>
                <button className="danger" onClick={() => handleDelete(content.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ContentList;
