import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import * as THREE from 'three';
import NET from "vanta/dist/vanta.net.min";
import './SzallasList.css';

export const SzallasMod = () => {
//új felírás:
const { id } = useParams();
// régi felírás:
// const params = useParams();
// const id = params.id;
const navigate = useNavigate();
const [data, setData] = useState({
    "name": '',
    "hostname": '',
    "location": '',
    "price": 0,
    "minimum_nights": ''
});
  const vantaRef = useRef(null);
useEffect(() => {
    const fetchData = async () => {
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
            console.error("Hiba az adatok lekérése során: ", error);
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


const handleInputChange = event => {
    const { name, value } = event.target;
    setData(prevState => ({
        ...prevState,
        [name]: value
    }));
};

const handleSubmit = event => {
    event.preventDefault();
    const token = localStorage.getItem('jwt');
    if(!token) {
        throw new Error('Nem található JWT token!');
    }
    axios.put(`https://szallasjwt.sulla.hu/data/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    )
    .then(() => {
        navigate("/SzallasList");
    })
    .catch(error => {
        console.log('Hiba az adatok frissítése során:', error);
    });
};

return (
    <div id="vanta-container" ref={vantaRef} style={{ minHeight: "80vh" }}>
    <div className="p-5 content bg-whitesmoke text-center" id="content">
        <h2>Egy szálláshely módosítása</h2>
        <form onSubmit={handleSubmit}>
            
            <div className="form-group row pb-3">
                <label className="col-sm-3 col-form-label">Szálláshely neve:</label>
                <div className="col-sm-9">
                    <input type="text" name="name" className="form-control" defaultValue={data.name} onChange={handleInputChange}/>
                </div>
            </div>
            <div className="form-group row pb-3">
                <label className="col-sm-3 col-form-label">Szállásadó (webhely) neve:</label>
                <div className="col-sm-9">
                    <input type="text" name="hostname" className="form-control" defaultValue={data.hostname} onChange={handleInputChange}/>
                </div>
            </div>
            <div className="form-group row pb-3">
                <label className="col-sm-3 col-form-label">Helyszín:</label>
                <div className="col-sm-9">
                    <input type="text" name="location" className="form-control" defaultValue={data.location} onChange={handleInputChange}/>
                </div>
            </div>
            <div className="form-group row pb-3">
                <label className="col-sm-3 col-form-label">Szállás ára/éjszaka:</label>
                <div className="col-sm-9">
                    <input type="number" name="price" className="form-control" value={data.price} onChange={handleInputChange}/>
                </div>
            </div>
            <div className="form-group row pb-3">
                <label className="col-sm-3 col-form-label">Minimum foglalható éjszakák száma:</label>
                <div className="col-sm-9">
                    <input type="text" name="minimum_nights" className="form-control" defaultValue={data.minimum_nights} onChange={handleInputChange}/>
                </div>
            </div>
            <Link to="/SzallasList" className="bi bi-backspace-fill fs-5 btn btn-danger">Vissza</Link>
            &nbsp;&nbsp;&nbsp;
            <button type="submit" className="btn btn-success fs-5">Küldés</button>
        </form>
    </div>
    </div>
);
};
