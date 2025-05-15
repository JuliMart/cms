import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

const ScreenList = () => {
  const [screens, setScreens] = useState([]);
  const token = localStorage.getItem("token");

  const fetchScreens = async () => {
    try {
      const res = await axios.get(`${API_URL}/screens`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScreens(res.data);
    } catch (err) {
      console.error("Error al cargar pantallas:", err);
    }
  };

  const handleEdit = async (screen) => {
    const newName = prompt("Nuevo nombre:", screen.name);
    const newLocation = prompt("Nueva ubicación:", screen.location);
    if (newName && newLocation) {
      try {
        await axios.put(
          `${API_URL}/screens/${screen.id}`,
          { name: newName, location: newLocation },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchScreens();
      } catch (err) {
        console.error("Error al editar pantalla:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar pantalla?")) {
      try {
        await axios.delete(`${API_URL}/screens/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchScreens();
      } catch (err) {
        console.error("Error al eliminar pantalla:", err);
      }
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  return (
    <section>
      <h2>Mis Pantallas</h2>
      <table className="screen-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Clave</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {screens.map((screen) => (
            <tr key={screen.id}>
              <td>{screen.name}</td>
              <td>{screen.location}</td>
              <td>{screen.screen_key}</td>
              <td>
                <button onClick={() => handleEdit(screen)}>Editar</button>
                <button className="danger" onClick={() => handleDelete(screen.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ScreenList;
