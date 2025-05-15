import React, { useEffect, useState } from "react";
import axios from "axios";


const API_URL = "http://localhost:8000";

const ContentAssignment = ({ token }) => {
  const [screens, setScreens] = useState([]);
  const [contents, setContents] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState("");
  const [selectedContent, setSelectedContent] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);

  useEffect(() => {
    // 🟩 Cargar pantallas del usuario
    axios.get(`${API_URL}/screens/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then(res => setScreens(res.data))
      .catch(err => console.error("Error al cargar pantallas", err));
      axios.get(`${API_URL}/content/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then(res => setContents(res.data))
        .catch(err => console.error("Error al cargar contenidos", err));
    }, [token]);

  const assign = async () => {
    try {
      await axios.post(`${API_URL}/screens/${selectedScreen}/playlist`, {
        content_id: parseInt(selectedContent),
        start_time: new Date().toISOString(), // o elegí una hora
        end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hora después
        order_index: parseInt(orderIndex),
        screen_id: parseInt(selectedScreen)  // 👈 Asegurate de incluir esto también

      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      
      alert("Contenido asignado");
    } catch (err) {
      console.error(err);
      alert("Error al asignar contenido");
    }
  };

  return (
  <section>

    <div>
      <h3>Asignar contenido a pantalla</h3>
      <select value={selectedScreen} onChange={(e) => setSelectedScreen(e.target.value)}>
        <option value="">Seleccionar pantalla</option>
        {screens.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.id})
          </option>
        ))}
      </select>
      <select value={selectedContent} onChange={(e) => setSelectedContent(e.target.value)}>
        <option value="">Seleccionar contenido</option>
        {contents.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.type})
          </option>
        ))}
      </select>
      <input
        type="number"
        value={orderIndex}
        onChange={(e) => setOrderIndex(e.target.value)}
        placeholder="Orden"
      />
      <button onClick={assign}>Asignar</button>
    </div>
    </section>

  );
};

export default ContentAssignment;
