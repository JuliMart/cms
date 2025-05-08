import React, { useEffect, useState } from 'react';
import { getContents } from '../api/api';

const ContentList = () => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await getContents();
        setContents(data);
      } catch (error) {
        console.error('Error al cargar contenidos:', error);
      }
    };

    fetchContents();
  }, []);

  return (
    <div>
      <h3>Contenidos cargados</h3>
      {contents.length === 0 ? (
        <p>No hay contenidos aún.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {contents.map((content) => (
            <li key={content.id} style={{ marginBottom: '1rem' }}>
              <strong>{content.name}</strong> ({content.type}) <br />
              {content.type === 'image' && (
                <img
                  src={`http://localhost:8000${content.url}`}
                  alt={content.name}
                  width="200"
                />
              )}
              {content.type === 'video' && (
                <video width="300" controls>
                  <source src={`http://localhost:8000${content.url}`} type="video/mp4" />
                  Tu navegador no soporta video HTML5.
                </video>
              )}
              <br />
              <small>{new Date(content.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContentList;
