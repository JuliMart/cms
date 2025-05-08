import React, { useState, useEffect } from "react";
import { login } from "../api/api";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Si ya hay token guardado, lo usamos
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      onLogin(savedToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await login(email, password);
      console.log("Login success", data); // 👈 agregá esto
      onLogin(data.access_token);
      localStorage.setItem("token", data.access_token);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales inválidas");
    }
  };
  

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
