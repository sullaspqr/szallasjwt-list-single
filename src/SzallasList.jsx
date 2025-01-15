import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as THREE from 'three';
import BIRDS from "vanta/dist/vanta.birds.min";
import './SzallasList.css';

export const SzallasList = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const vantaRef = useRef(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("jwt");
          if (!token) {
            throw new Error("Nem található JWT token!");
          }
          const valasz = await axios.get("https://szallasjwt.sulla.hu/data", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData(valasz.data);
        } catch (error) {
          setError(
            "Az adatok lekérése sikertelen. Lehet, hogy nem vagy bejelentkezve?"
          );
        }
      };
      fetchData();
    }, []);
  
    useEffect(() => {
      let vantaEffect;
      if (vantaRef.current) {
        try {
          vantaEffect = BIRDS({
            el: vantaRef.current,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 700.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            colorMode: "lerp",
            wingSpan: 10.00,
            speedLimit: 2.00,
            alignment: 10.00,
            backgroundColor: 0x001f3f,
            color1: 0xff4500,
            color2: 0x28a745,
          });
        } catch (error) {
          console.error("[vanta.js] birds init error:", error);
        }
      }
      return () => {
        if (vantaEffect) vantaEffect.destroy();
      };
    }, []);
  
    const containerStyle = {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "20px",
      padding: "20px",
    };
  
    const itemStyle = {
      backgroundColor: "transparent", // Átlátszó háttér
      color: "white", // Fehér szöveg
      padding: "15px",
      borderRadius: "10px",
      border: "1px solid rgba(255, 255, 255, 0.3)", // Halvány fehér keret
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
    };
  
    const buttonGroupStyle = {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
    };
  
    const responsiveStyle = {
      width: "100%",
      margin: "0 auto",
    };
  
    return (
      <div id="vanta-container" ref={vantaRef} style={{ minHeight: "320vh" }}>
        <div id="content" style={responsiveStyle}>
          <h2 style={{ color: "white", textAlign: "center" }}>Szállások listája</h2>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          {data.length > 0 ? (
            <div style={containerStyle}>
              {data.map((item) => (
                <div key={item.id} style={itemStyle}>
                  <p>
                    <strong>{item.name}</strong> <br />
                    {item.hostname} - {item.location} - {item.price} Ft - {item.minimum_nights} éjszaka
                  </p>
                  <div style={buttonGroupStyle}>
                    <Link to={`/data/${item.id}`} className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-text-paragraph"></i>
                    </Link>
                    <Link to={`/data-mod/${item.id}`} className="btn btn-outline-warning btn-sm">
                      <i className="bi bi-pencil-square"></i>
                    </Link>
                    <Link to={`/data-del/${item.id}`} className="btn btn-outline-danger btn-sm">
                      <i className="bi bi-trash3"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "white", textAlign: "center" }}>Nem találhatók az adatok!</p>
          )}
        </div>
      </div>
    );
  };
  