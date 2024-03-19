import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
    return (
        <div>
            <h1>Bienvenido a la Trivia de Sistemas Operativos</h1>
            <p>Elige una opción para comenzar:</p>
            <button><Link to="/trivia/random">Random</Link></button>
            <button><Link to="/select-theme">Seleccionar Tema</Link></button>
            <p>O puedes:</p>
            <button><Link to="/suggest-question">Sugerir Pregunta</Link></button>
            <button><Link to="/add-question">Añadir Pregunta</Link></button>
        </div>
    );
}

export default Welcome;
