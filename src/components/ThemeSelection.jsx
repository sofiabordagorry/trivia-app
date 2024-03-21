import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from './Spinner'; // Importa el componente Spinner

function ThemeSelection() {
    const [loading, setLoading] = useState(true);
    const [themes, setThemes] = useState([]);

    useEffect(() => {
        fetch('/data/topics.json')
            .then(response => response.json())
            .then(data => setThemes(data.topics)); // Aquí leemos los temas desde data.topics
    }, []);

    
    useEffect(() => {
        // Simula la carga de datos
        setTimeout(() => {
            setLoading(false);
        }, 500); // Cambia este valor al tiempo de carga de tus datos
    }, []);

    if (loading) {
        return <Spinner />;
    }



    return (
        <div>
            <h1>Selecciona un tema</h1>
            <div className='options-container'>
            {themes.map((theme, index) => (
                <Link to={`/trivia/${theme}/10`}>
                <button key={index}>
                {theme}
                </button>
                </Link>
            ))}
            </div>
        </div>
    );
}

export default ThemeSelection;
