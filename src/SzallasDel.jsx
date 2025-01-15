import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import * as THREE from 'three';
import NET from "vanta/dist/vanta.net.min";
import './SzallasList.css';

export const SzallasDel = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const vantaRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();

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
                //console.error("Hiba az adatok lekérése során: ", error);
            }
        }
        fetchData();
    }, [id]);
    useEffect(() => {
        const vantaEffect = NET({
          el: vantaRef.current,
          THREE,
          color: 0xff0000, // Karácsonyi piros
          //backgroundColor: 0x001f3f, // Mélykék háttér
          backgroundColor: 0xffffff,
          points: 12.0,
          maxDistance: 20.0,
          spacing: 18.0,
        });
    
        return () => {
          if (vantaEffect) vantaEffect.destroy();
        };
      }, []);
      const handleSubmit = event => {
        event.preventDefault();
        const token = localStorage.getItem('jwt');
        if(!token) {
            throw new Error('Nem található JWT token!');
        }
        axios.delete(`https://szallasjwt.sulla.hu/data/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        )
        .then(() => {
            navigate("/SzallasList");
        })
        .catch(error => {
            console.log('Hiba az adatok törlése során:', error);
        });
    };
    
    return (
        <div id="vanta-container" ref={vantaRef} style={{ minHeight: "100vh" }}>
    <div id="content">
        <h2>A törlendő szállás részletei</h2>
        {error && <p style={{ color: 'red'}}> {error} </p>}
        {data ? (
          <ul> 
          <li key={data.id}>{data.name} - {data.hostname} - {data.location} - {data.price} - {data.minimum_nights}
          
<Link to={"/SzallasList"}>
<i className="bi bi-backspace fs-6 btn btn-primary">
    </i></Link>&nbsp;&nbsp;&nbsp;
<Link to={"/data-mod/" + data.id}>
<i className="bi bi-pencil-square fs-6 btn btn-warning">
    </i></Link>&nbsp;&nbsp;&nbsp;
<button type="submit" className="bi bi-trash3 fs-6 btn btn-danger" onClick={handleSubmit}></button>
<br /><br />
          </li>
        </ul> ) : ( <p>Nem találhatók az adatok!</p>)
    } 
    </div>
    </div>
    );
}