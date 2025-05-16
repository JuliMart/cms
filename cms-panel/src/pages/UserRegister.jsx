import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ 1. Importar

const API_URL = "http://localhost:8000";

const UserRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ 2. Crear instancia

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email,
        password
      });
      alert("Usuario creado correctamente");
      navigate("/"); // ✅ 3. Redirigir al login
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      alert("Error al registrar usuario");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Registrar nuevo usuario</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default UserRegister;
