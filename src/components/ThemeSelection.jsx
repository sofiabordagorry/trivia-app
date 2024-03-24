import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from './Spinner'; // Importa el componente Spinner
import Footer from './Footer';
import Modal from 'react-modal';
import ErrorNotImplemented from './ErrorNotImplemented';

function ThemeSelection() {
    const [loading, setLoading] = useState(true);
    const [themes, setThemes] = useState([]);
    const [questionsModalIsOpen, setQuestionsModalIsOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(null);

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

    const openQuestionsModal = () => {
        setQuestionsModalIsOpen(true);
    };

    const closeQuestionsModal = () => {
        setQuestionsModalIsOpen(false);
    };

    const handleThemeClick = (theme) => {
        setSelectedTheme(theme);
        if (theme.implemented === 'no') {
            // Redirige a la página de error para temas no implementados
            return;
        }
        openQuestionsModal();
    };


    return (
        <div>
            <h1>Selecciona un tema</h1>
            <div className='options-container'>
                <div className="topics-container">
            {themes.map((theme, index) => (
                <div className="topics" key={index}>
                <Link to={theme.implemented === 'no' ? '/error-not-implemented' : '#'}>
                    <button onClick={() => handleThemeClick(theme)}>
                        {theme.name} 
                    </button>
                </Link>             
                </div>
                ))}                 
                {selectedTheme && 
                <Modal
                    isOpen={questionsModalIsOpen}
                    onRequestClose={closeQuestionsModal}
                    contentLabel="Seleccionar cantidad de preguntas"
                >
                    <div className="modal-content">
                        <h2 className="report-error">Seleccionar cantidad de preguntas</h2>
                        <p>Por favor, selecciona la cantidad de preguntas que deseas responder:</p>
                        <div>
                        <Link to={`/trivia/${selectedTheme.name}/10`}>
                        <button>Responder 10 preguntas</button>
                        </Link>
                        </div>
                        <div>
                        <Link to={`/trivia/${selectedTheme.name}/20`}>
                        <button>Responder 20 preguntas</button>
                        </Link>
                        </div>
                        <div>
                        <Link to={`/trivia/${selectedTheme.name}/all`}>
                        <button>Responder todas las preguntas</button>
                        </Link>
                        </div>
                        <div>
                        <button onClick={closeQuestionsModal}>Cerrar</button>
                        </div>
                    </div>
                </Modal>}
                </div>
                <div style={{textAlign: 'center', justifyContent: 'center', marginTop: '0px'}}>
                <div>
                    <Link to="/">
                        <button>Volver al inicio</button>
                    </Link>
                </div>
            </div>
                <div className="options-right">
                    <div className='content'>
                        <img src="/images/PerritoPensando.png" alt="perrito" className="images-preguntas" />
                    </div>
                </div>
            </div>
            {!loading && <Footer />} {/* Renderizar el Footer solo cuando no hay carga */}
        </div>
    );
}

export default ThemeSelection;
