// ErrorNotImplemented.jsx
import React from 'react';
import Spinner from './Spinner';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ErrorNotImplemented() {
    const [loading, setLoading] = useState(true);
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
        <div>
            <h1 className="error">Lo sentimos, aún no está implementada la trivia para este tema :(</h1>
        </div>
        {!loading && <Footer />} 
        <div style={{ textAlign: 'center', justifyContent: 'center' }}>
            <Link to="/">
                <button>Volver al inicio</button>
            </Link>
        </div>
        <div>
            <img src="images/PerritoTrabajando.png" alt="Cute Dog" className="images-cute" />
        </div>
        </div>
    );
}

export default ErrorNotImplemented;
