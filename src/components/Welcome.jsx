import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import SuggestQuestion from './SuggestQuestion';
import Spinner from './Spinner'; // Asegúrate de que este es el camino correcto a tu archivo Spinner.jsx
import Footer from './Footer';


function Welcome() {
    const [loading, setLoading] = useState(true);
    const [suggestModalIsOpen, setSuggestModalIsOpen] = useState(false);
    const handleRandomClick = (count) => {
        // Redirige al usuario a /trivia/random/count
        window.location.href = `/trivia/random/${count}`;
    };
    const openSuggestModal = () => {
        setSuggestModalIsOpen(true);
    };

    const closeSuggestModal = () => {
        setSuggestModalIsOpen(false);
    };

    useEffect(() => {
        // Simula la carga de datos
        setTimeout(() => {
            setLoading(false);
        }, 1000); // Cambia este valor al tiempo de carga de tus datos
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <h1>Bienvenido a la Trivia de Sistemas Operativos</h1>
            <div className="options-container">
            <p class="options-text">Elige una opción para comenzar:</p>
            <button onClick={() => handleRandomClick(10)}>Random 10 preguntas</button>
            <button onClick={() => handleRandomClick(30)}>Random 30 preguntas</button>
            <button onClick={() => handleRandomClick(50)}>Random 50 preguntas</button>
            <Link to="/select-theme">
            <button>Seleccionar Tema</button>
            </Link>
            <p class="options-text">O puedes:</p>
            <button onClick={openSuggestModal}>Sugerir Pregunta</button>
            <Modal
                isOpen={suggestModalIsOpen}
                onRequestClose={closeSuggestModal}
                contentLabel="Sugerir Pregunta"
            >
                <div className="modal-content">
                <h2 className="suggest">Sugerir Pregunta</h2>
                <SuggestQuestion closeModal={closeSuggestModal} /> {/* Pasa closeModal como una prop */}
                <button onClick={closeSuggestModal}>Cerrar</button>
                </div>
            </Modal>
            </div>
            <div className="options-container">
                <p className="info-text">
                    Este proyecto fue creado con el propósito de ayudar a los estudiantes de Sistemas Operativos a estudiar la parte teórica del curso. Está basado en el curso de 
                    Sistemas Operativos de la Facultad de Ingeniería (FING) de la Universidad de la República, específicamente en las ediciones de 2023 y 2024 (porque la cursé dos veces).
                    Contiene preguntas basadas en las diapositivas del curso, de los parciales y de los éxamenes. Si tienes alguna sugerencia o pregunta que quieras agregar, puedes hacerlo en la sección de "Sugerir Pregunta".
                    ¡Mucho éxito!
                </p>
                <p className='info-text'>
                    PD: Los temás de la sección "Seleccionar Tema" se irán actualizando y por ahora todas las preguntas son exclusivamente teóricas, en un futuro se espera poder tener preguntas más prácticas también :).
                </p>
            </div>
            {!loading && <Footer />} {/* Renderizar el Footer solo cuando no hay spinner */}
        </div>
    );
}

export default Welcome;
