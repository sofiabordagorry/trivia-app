import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ThemeSelection() {
    const [themes, setThemes] = useState([]);

    useEffect(() => {
        fetch('/data/topics.json')
            .then(response => response.json())
            .then(data => setThemes(data.topics)); // Aquí leemos los temas desde data.topics
    }, []);

    return (
        <div>
            <h1>Selecciona un tema</h1>
            {themes.map((theme, index) => (
                <button key={index}>
                    <Link to={`/trivia/${theme}/10`}>{theme}</Link>
                </button>
            ))}
        </div>
    );
}

export default ThemeSelection;
