import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import ReportError from './ReportError'; // Importa el componente ReportError

function Trivia() {
    const [allQuestions, setAllQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [userAnswers, setUserAnswers] = useState([]); // Almacena las respuestas del usuario
    const [compareModalIsOpen, setCompareModalIsOpen] = useState(false);
    const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
    const { type } = useParams(); // Obtenemos el tipo de la URL

    useEffect(() => {
        fetch('/data/questions.json')
            .then(response => response.json())
            .then(data => {
                setAllQuestions(data[type]);
            });
    }, [type]);

    useEffect(() => {
        // Seleccionar 10 preguntas aleatorias al principio
        if (allQuestions.length > 0) {
            const shuffled = shuffle(allQuestions);
            const selected = shuffled.slice(0, 10);
            setQuestions(selected);
        }
    }, [allQuestions]);

    const shuffle = array => {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // Mientras haya elementos para mezclar
        while (0 !== currentIndex) {
            // Selecciona un elemento sin mezclar
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // Intercambia con el elemento actual
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };
    
    const handleAnswer = () => {
        if (userAnswer === questions[currentQuestion].answer) {
            setScore(score + 1);
        }
        setUserAnswers([...userAnswers, userAnswer]); // Añade la respuesta del usuario al array
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer(''); // Reseteamos la respuesta del usuario
    };

    const openCompareModal = () => {
        setCompareModalIsOpen(true);
    };

    const closeCompareModal = () => {
        setCompareModalIsOpen(false);
    };

    const openReportModal = () => {
        setReportModalIsOpen(true);
    };

    const closeReportModal = () => {
        setReportModalIsOpen(false);
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
                        <button onClick={() => setUserAnswer("true")}>Verdadero</button>
                        <button onClick={() => setUserAnswer("false")}>Falso</button>
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
                    </div>
                ) : (
                    <div>
                        <h2>¡Has terminado la trivia!</h2>
                        <p>Tu puntuación final es: {score}</p>
                        <button onClick={() => setCurrentQuestion(0)}>Volver a jugar</button>
                        <button onClick={openCompareModal}>Comparar mis respuestas</button>
                        <Modal
                            isOpen={compareModalIsOpen}
                            onRequestClose={closeCompareModal}
                            contentLabel="Comparar respuestas"
                        >
                            <h2>Comparar respuestas</h2>
                            {questions.map((question, index) => (
                                <div key={index}>
                                    <span>{userAnswers[index] === question.answer ? <i className="bi bi-check"></i> : <i className="bi bi-x"></i>}</span>
                                    <p>Pregunta: {question.question}</p>
                                    <p>Respuesta correcta: {question.answer}</p>
                                    <p>Tu respuesta: {userAnswers[index]}</p>
                                    <button onClick={openReportModal}>Reportar error</button>
                                    <Modal
                                        isOpen={reportModalIsOpen}
                                        onRequestClose={closeReportModal}
                                        contentLabel="Reportar error"
                                    >
                                        <h2>Reportar error</h2>
                                        <ReportError question={question.question} closeModal={closeReportModal} /> {/* Pasa closeModal como una prop */}
                                        <button onClick={closeReportModal}>Cerrar</button>
                                    </Modal>
                                </div>
                            ))}
                            <button onClick={closeCompareModal}>Cerrar</button>
                        </Modal>
                    </div>
                )
            ) : (
                <p>Cargando preguntas...</p>
            )}
        </div>
    );
}

export default Trivia;
