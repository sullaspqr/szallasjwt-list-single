import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as THREE from "three";
import WAVES from "vanta/dist/vanta.waves.min";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect;
    if (vantaRef.current) {
      try {
        vantaEffect = WAVES({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 150.0,
          minWidth: 150.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x001f3f,
          color1: 0xff4500,
          color2: 0x28a745,
        });
      } catch (error) {
        console.error("[vanta.js] waves init error:", error);
      }
    }
  
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const valasz = await axios.post("https://szallasjwt.sulla.hu/login", {
        username,
        password,
      });
      const token = valasz.data.token;
      localStorage.setItem("jwt", token);
      setError("");
      navigate("/SzallasList");
    } catch (error) {
      setError(
        "Hitelesítés sikertelen. Ellenőrízd a bejelentkezési adatokat!"
      );
    }
  };

  return (
    <div ref={vantaRef} style={{ height: "100vh", width: "100%", position: "relative" }}>
      <div style={styles.container}>
        <h1 style={styles.title}> Bejelentkezés </h1>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Felhasználónév:</label>
          <input
            type="text"
            placeholder="felhasználónév"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Jelszó:</label>
          <input
            type="password"
            placeholder="jelszó"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handleLogin} style={styles.button}>
          Bejelentkezés
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fehér áttetsző háttér
    borderRadius: "15px",
    padding: "20px 30px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "300px",
  },
  title: {
    color: "#ff4500", // Karácsonyi piros szöveg
    marginBottom: "20px",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#28a745", // Zöld gomb
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};