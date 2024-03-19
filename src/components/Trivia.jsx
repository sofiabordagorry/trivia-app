import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import ReportError from './ReportError'; // Importa el componente ReportError

function Trivia() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { type } = useParams(); // Obtenemos el tipo de la URL

    useEffect(() => {
        fetch('/data/questions.json')
            .then(response => response.json())
            .then(data => {
                // Elegimos 10 preguntas aleatorias
                const shuffled = data[type].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 10);
                setQuestions(selected);
            });
    }, [type]);

    const handleAnswer = () => {
        if (userAnswer === questions[currentQuestion].answer) {
            setScore(score + 1);
        }
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer(''); // Reseteamos la respuesta del usuario
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const renderQuestion = () => {
        switch (questions[currentQuestion].type) {
            case 'multipleChoice':
                return (
                    <div>
                        {questions[currentQuestion].options.map((option, index) => (
                            <button key={index} onClick={() => setUserAnswer(option)}>
                                {option}
                            </button>
                        ))}
                    </div>
                );
            case 'fillInTheBlank':
                return (
                    <div>
                        <input type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} />
                    </div>
                );
            case 'trueOrFalse':
                return (
                    <div>
                        <button onClick={() => setUserAnswer(true)}>Verdadero</button>
                        <button onClick={() => setUserAnswer(false)}>Falso</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <h1>Trivia de {type}</h1>
            {/* Barra de progreso */}
            <div style={{ height: '20px', width: '100%', backgroundColor: '#f3f3f3' }}>
                <div style={{ height: '100%', width: `${(currentQuestion / questions.length) * 100}%`, backgroundColor: 'cyan' }} />
            </div>
            {questions.length > 0 ? (
                currentQuestion < questions.length ? (
                    <div>
                        <p>{questions[currentQuestion].question}</p>
                        {renderQuestion()}
                        {(userAnswer || (questions[currentQuestion].type === 'fillInTheBlank' && userAnswer !== '')) && (
                            <button onClick={handleAnswer}>Siguiente pregunta</button>
                        )}
                        <button onClick={openModal}>Reportar error</button>
                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            contentLabel="Reportar error"
                        >
                            <h2>Reportar error</h2>
                            <ReportError question={questions[currentQuestion].question} closeModal={closeModal} /> {/* Pasa closeModal como una prop */}
                            <button onClick={closeModal}>Cerrar</button>
                        </Modal>
                    </div>
                ) : (
                    <div>
                        <h2>¡Has terminado la trivia!</h2>
                        <p>Tu puntuación final es: {score}</p>
                    </div>
                )
            ) : (
                <p>Cargando preguntas...</p>
            )}
        </div>
    );
}

export default Trivia;
