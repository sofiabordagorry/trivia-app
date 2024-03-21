import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import ReportError from './ReportError'; // Importa el componente ReportError
import Spinner from './Spinner'; // Asegúrate de que este es el camino correcto a tu archivo Spinner.jsx

function Trivia() {
    const [allQuestions, setAllQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [userAnswers, setUserAnswers] = useState([]); // Almacena las respuestas del usuario
    const [compareModalIsOpen, setCompareModalIsOpen] = useState(false);
    const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
    const { type, count } = useParams(); // Obtenemos el tipo y el count de la URL
    const questionCount = parseInt(count);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/data/questions.json')
            .then(response => response.json())
            .then(data => {
                if (type === 'random') {
                    let allData = [];
                    for (let key in data) {
                        allData = allData.concat(data[key]);
                    }
                    setAllQuestions(allData);
                } else {
                    setAllQuestions(data[type]);
                }
            });
    }, [type]);

    useEffect(() => {
        if (allQuestions.length > 0) {
            const shuffled = shuffle(allQuestions);
            const selected = shuffled.slice(0, questionCount); // Usamos questionCount en lugar de un número fijo
            setQuestions(selected);
        }
    }, [allQuestions, questionCount]); // Agregamos questionCount a las dependencias

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
        const updatedUserAnswers = [...userAnswers];
        updatedUserAnswers[currentQuestion] = userAnswer;
        
        if (userAnswer === questions[currentQuestion].answer) {
            setScore(score + 1);
        }
        
        setUserAnswers(updatedUserAnswers);
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

    useEffect(() => {
        // Simula la carga de datos
        setTimeout(() => {
            setLoading(false);
        }, 500); // Cambia este valor al tiempo de carga de tus datos
    }, []);

    useEffect(() => {
        if (currentQuestion === questions.length) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 500); // Cambia este valor al tiempo de carga de tus datos
        }
    }, [currentQuestion, questions]);

    if (loading) {
        return <Spinner />;
    }

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
                        <input className="fill" type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} />
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
            <h1>{type === 'random' ? 'Trivia Aleatoria' : `Trivia de ${type}`}</h1>
            {/* Barra de progreso */}
            <div className="barra" >
                <div style={{ height: '100%', width: `${(currentQuestion / questions.length) * 100}%`, backgroundColor: '#5bdb34' }} />
            </div>
            {questions.length > 0 ? (
                currentQuestion < questions.length ? (
                    <div className="question-container">
                        <p className="question-text">{questions[currentQuestion].question}</p>
                        {renderQuestion()}
                        {(userAnswer || (questions[currentQuestion].type === 'fillInTheBlank' && userAnswer !== '')) && (
                            <button onClick={handleAnswer}>Siguiente pregunta</button>
                        )}
                    <div style={{ textAlign: 'right' }}>
                        <Link to="/">
                            <button>Volver al inicio</button>
                        </Link>
                    </div>
                    </div>
            ) : (
                loading ? (
                    <Spinner /> // Muestra el spinner mientras se cargan los resultados
                ) : (                    <div className="results-container">
                        <h2>¡Has terminado la trivia!</h2>
                        <p className="final-score">Tu puntuación final es: {score}</p>
                        <button onClick={() => setCurrentQuestion(0)}>Volver a jugar</button>
                        <Link to="/"><button>Volver al inicio</button></Link>
                        <button onClick={openCompareModal}>Comparar mis respuestas</button>
                        
                                            <Modal
                        isOpen={compareModalIsOpen}
                        onRequestClose={closeCompareModal}
                        contentLabel="Comparar respuestas"
                    >
                        <div className="modal-content">
                            <h2 className="compare-answer">Comparar respuestas</h2>
                            {questions.map((question, index) => (
                                <div key={index}>
                                    <div className="question-info">
                                        <p>
                                            {userAnswers[index] == question.answer ? (
                                                <i className="bi bi-check"></i>
                                            ) : (
                                                <i className="bi bi-x"></i>
                                            )}
                                            {question.question}
                                        </p>
                                    </div>
                                    <div className="answer-info">
                                        <div className="answer-item">Tu respuesta: {userAnswers[index]}</div>
                                        <div className="answer-item">Respuesta correcta: {question.answer}</div>
                                    </div>
                                    <button onClick={openReportModal}>Reportar error</button>
                                    <Modal
                                        isOpen={reportModalIsOpen}
                                        onRequestClose={closeReportModal}
                                        contentLabel="Reportar error"
                                    >
                                        <div className="modal-content">
                                            <h2 className="report-error">Reportar error</h2>
                                            <ReportError
                                                question={question.question}
                                                closeModal={closeReportModal}
                                            />
                                            <button onClick={closeReportModal}>Cerrar</button>
                                        </div>
                                    </Modal>
                                </div>
                            ))}
                            <button onClick={closeCompareModal}>Cerrar</button>
                        </div>
                    </Modal>

                    </div>
                )
                )
            ) : (
                <p>Cargando preguntas...</p>
            )}
        </div>
    );
}

export default Trivia;
