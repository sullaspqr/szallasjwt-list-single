import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import * as THREE from 'three';
import BIRDS from "vanta/dist/vanta.birds.min";
import './SzallasList.css';

export const SzallasSingle = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const vantaRef = useRef(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () =>{
            try {
                const token = localStorage.getItem('jwt');
                if(!token) {
                    throw new Error('Nem található JWT token!');
                }
                const valasz = await axios.get('https://szallasjwt.sulla.hu/data/' + id, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(valasz.data);
            }
            catch(error) {
                setError('Az adatok lekérése sikertelen. Lehet, hogy nem vagy bejelentkezve?');
                console.error("Hiba az adatok lekérése során: ", error);
            }
        }
        fetchData();
    }, [id]);
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
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
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
    return (
        <div id="vanta-container" ref={vantaRef} style={{ minHeight: "100vh" }}>
    <div id="content">
        <h2 style={{ color: 'white'}}>Egy szállás részletei</h2>
        {error && <p style={{ color: 'red'}}> {error} </p>}
        {data ? (
          <ul> 
          <li key={data.id} style={{ color: 'white'}}>{data.name} - {data.hostname} - {data.location} - {data.price} - {data.minimum_nights}
          
<Link to={"/SzallasList"}>
<i className="bi bi-backspace fs-6 btn btn-primary">
    </i></Link>&nbsp;&nbsp;&nbsp;
<Link to={"/data-mod/" + data.id}>
<i className="bi bi-pencil-square fs-6 btn btn-warning">
    </i></Link>&nbsp;&nbsp;&nbsp;
<Link to={"/data-del/" + data.id}>
<i className="bi bi-trash3 fs-6 btn btn-danger">
    </i></Link><br /><br />
          </li>
        </ul> ) : ( <p>Nem találhatók az adatok!</p>)
    } 
    </div>
    </div>
    );
}