import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000";

const PlayerScreen = () => {
  const { screenKey } = useParams();
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(0);

  // Obtener playlist asociada al screenKey
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(`${API_URL}/screens/${screenKey}/playlist`);
        setPlaylist(res.data.map(p => p.content)); // asumimos que cada playlist tiene `content`
      } catch (error) {
        console.error("Error al obtener la playlist:", error);
      }
    };

    fetchPlaylist();
  }, [screenKey]);

  // Rotar cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (playlist.length ? (prev + 1) % playlist.length : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, [playlist]);

  const current = playlist[index];

  return (
    <div style={{ backgroundColor: "#000", height: "100vh", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {current ? (
        current.type === "image" ? (
          <img
            src={`http://localhost:8000${current.url}`}
            alt={current.name}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            src={`http://localhost:8000${current.url}`}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        )
      ) : (
        <p>Cargando contenido...</p>
      )}
    </div>
  );
};

export default PlayerScreen;
