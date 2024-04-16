import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [ciudades, setCiudades] = useState({});
    const [ciudadesSeleccionadas, setCiudadesSeleccionadas] = useState({});
    const [marcaSeleccionada, setMarcaSeleccionada] = useState('Nacional');

    useEffect(() => {
        handleChangeMarca({ target: { value: marcaSeleccionada } });
    }, []);

    const handleChangeMarca = async (event) => {
        const value = event.target.value;
        setMarcaSeleccionada(value);
        try {
            let response;
            if (value === 'Nacional') {
                response = await axios.get('http://localhost:3000/ciudades');
            } else {
                response = await axios.get(`http://localhost:3000/ciudades?marca=${value}`);
            }
            const ciudadesAgrupadas = organizarCiudades(response.data);
            setCiudades(ciudadesAgrupadas);
            // Establecer todas las ciudades como seleccionadas al inicio
            const ciudadesSeleccionadasInicial = {};
            Object.keys(ciudadesAgrupadas).forEach(division => {
                ciudadesSeleccionadasInicial[division] = {};
                Object.keys(ciudadesAgrupadas[division]).forEach(region => {
                    ciudadesSeleccionadasInicial[division][region] = ciudadesAgrupadas[division][region].slice();
                });
            });
            setCiudadesSeleccionadas(ciudadesSeleccionadasInicial);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const organizarCiudades = (ciudades) => {
        const ciudadesAgrupadas = {};
        ciudades.forEach(ciudad => {
            const { division, region, ciudad: nombreCiudad } = ciudad;
            const ciudadObj = { division, region, ciudad: nombreCiudad };
            const divisionKey = `${division}`;
            if (!ciudadesAgrupadas[divisionKey]) {
                ciudadesAgrupadas[divisionKey] = {};
            }
            const regionKey = `${region}`;
            if (!ciudadesAgrupadas[divisionKey][regionKey]) {
                ciudadesAgrupadas[divisionKey][regionKey] = [];
            }
            ciudadesAgrupadas[divisionKey][regionKey].push(ciudadObj);
        });
        return ciudadesAgrupadas;
    };

    const handleToggleDivision = (division) => {
        const nuevasSelecciones = { ...ciudadesSeleccionadas };
        const todasLasCiudades = ciudades[division]
            ? Object.values(ciudades[division]).reduce((acc, region) => acc.concat(region), [])
            : [];
        if (todasLasCiudades.every((ciudad) => nuevasSelecciones[division]?.[ciudad.region]?.some((c) => c.ciudad === ciudad.ciudad))) {
            // Si todas las ciudades de esta división están seleccionadas, deselecciónalas
            nuevasSelecciones[division] = {};
        } else {
            // De lo contrario, selecciónalas todas
            nuevasSelecciones[division] = {};
            Object.keys(ciudades[division]).forEach(region => {
                nuevasSelecciones[division][region] = ciudades[division][region].slice();
            });
        }
        // Verificar si la división está deseleccionada, si lo está, deseleccionar todas las ciudades asociadas
        if (Object.keys(nuevasSelecciones[division]).length === 0) {
            todasLasCiudades.forEach(ciudad => {
                nuevasSelecciones[division][ciudad.region] = [];
            });
        }
        setCiudadesSeleccionadas(nuevasSelecciones);
    };
    
    const handleToggleRegion = (division, region) => {
        const nuevasSelecciones = { ...ciudadesSeleccionadas };
        const ciudadesRegion = ciudades[division][region] || [];
        if (ciudadesRegion.every((ciudad) => nuevasSelecciones[division]?.[region]?.some((c) => c.ciudad === ciudad.ciudad))) {
            // Si todas las ciudades de esta región están seleccionadas, deselecciónalas
            nuevasSelecciones[division][region] = [];
        } else {
            // De lo contrario, selecciónalas todas
            nuevasSelecciones[division][region] = ciudadesRegion.slice();
        }
        // Verificar si todas las regiones de la división están deseleccionadas, si lo están, deseleccionar todas las ciudades asociadas
        const todasLasRegiones = Object.keys(ciudades[division]);
        const regionesSeleccionadas = todasLasRegiones.filter(region => nuevasSelecciones[division][region].length > 0);
        if (regionesSeleccionadas.length === 0) {
            todasLasRegiones.forEach(region => {
                nuevasSelecciones[division][region] = [];
            });
        }
        setCiudadesSeleccionadas(nuevasSelecciones);
    };

    const handleToggleCiudad = (ciudad) => {
        const nuevasSelecciones = { ...ciudadesSeleccionadas };
        if (nuevasSelecciones[ciudad.division] && nuevasSelecciones[ciudad.division][ciudad.region]) {
            if (nuevasSelecciones[ciudad.division][ciudad.region].some((c) => c.ciudad === ciudad.ciudad)) {
                // Si la ciudad ya está seleccionada, quítala
                nuevasSelecciones[ciudad.division][ciudad.region] = nuevasSelecciones[ciudad.division][ciudad.region].filter((c) => c.ciudad !== ciudad.ciudad);
            } else {
                // Si la ciudad no está seleccionada, agrégala
                nuevasSelecciones[ciudad.division][ciudad.region].push(ciudad);
            }
        } else {
            // Si la región o división no existe en las selecciones, agrégala y selecciona la ciudad
            nuevasSelecciones[ciudad.division] = {};
            nuevasSelecciones[ciudad.division][ciudad.region] = [ciudad];
        }
        setCiudadesSeleccionadas(nuevasSelecciones);
    };

    return (
        <div className="container">
            <h1 className="mt-5 mb-4">Crear Comunicado</h1>
            <form>
                <div className="mt-3">
                    <h2>Marcas</h2>
                    <div className="form-group mt-2">
                        <label htmlFor="selectOption">Selecciona una opción:</label>
                        <select
                            name="marca"
                            id="selectOption"
                            className="form-control"
                            value={marcaSeleccionada}
                            onChange={handleChangeMarca}
                        >
                            <option value="Nacional">Nacional</option>
                            <option value="izzi">izzi</option>
                            <option value="wizz">wizz</option>
                            <option value="wizz plus">wizz plus</option>
                        </select>
                    </div>
                    <p className="mt-2">Seleccionaste: {marcaSeleccionada}</p>
                </div>
                <hr />
                <div className="mt-2 mb-2">
                    <h2>Divisiones, Regiones y Ciudades</h2>
                </div>
                {Object.keys(ciudades).map((division) => (
                    <div key={division}>
                        <hr />
                        <label>
                            <input
                                type="checkbox"
                                checked={ciudadesSeleccionadas[division] && Object.values(ciudadesSeleccionadas[division]).flat().length > 0}
                                onChange={() => handleToggleDivision(division)}
                            /> {division}
                        </label>
                        <div className="row">
                            {Object.keys(ciudades[division]).map((region) => (
                                <div key={region} className="col-md-4">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={
                                                ciudades[division][region].length > 0 &&
                                                ciudades[division][region].length === Object.values(ciudadesSeleccionadas[division]?.[region] || {}).length
                                            }
                                            onChange={() => handleToggleRegion(division, region)}
                                        /> {region}
                                    </label>
                                    <ul className="list-group">
                                        {ciudades[division][region].map((ciudad, idx) => (
                                            <li key={idx} className="list-group-item">
                                                <input
                                                    type="checkbox"
                                                    checked={ciudadesSeleccionadas[ciudad.division]?.[ciudad.region]?.some((c) => c.ciudad === ciudad.ciudad)}
                                                    onChange={() => handleToggleCiudad(ciudad)}
                                                />
                                                <label htmlFor={`ciudad-${ciudad.ciudad}`}>{ciudad.ciudad}</label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                        </div>
                    </div>
                ))}
                <button type="submit" className="btn btn-primary mt-5">Guardar</button>
            </form>
            <div>
                <h2>Ciudades Seleccionadas por Región y División</h2>
                <pre>{JSON.stringify(ciudadesSeleccionadas, null, 2)}</pre>
            </div>
        </div>
    );
}

export default App;