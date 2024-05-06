import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import ReportError from './ReportError'; 
import Spinner from './Spinner'; 
import Footer from './Footer';

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
    const [showErrorMessage, setShowErrorMessage] = useState(false); // Estado para controlar si se muestra el mensaje de error

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
            let selected;
            if (count === 'all') {
                selected =  shuffle(allQuestions);
            } else {
                selected = shuffle(allQuestions).slice(0, parseInt(count));
            }
            setQuestions(selected);
        }
    }, [allQuestions, count]);

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
            // Verificar si la pregunta es de tipo fillInTheBlank y el usuario no ha escrito nada
            if (questions[currentQuestion].type === 'fillInTheBlank' && !userAnswer.trim()) {
                setShowErrorMessage(true);
                return;
            }
        
            // Verificar si la pregunta es de tipo multipleChoice o trueOrFalse y el usuario no ha seleccionado ninguna respuesta
            if ((questions[currentQuestion].type === 'multipleChoice' || questions[currentQuestion].type === 'trueOrFalse') && !userAnswer) {
                console.log('Multiple choice or true or false question with no answer provided');
                setShowErrorMessage(true);
                return;
            }
        
            // Ocultar el mensaje de error si el usuario ha proporcionado una respuesta
            setShowErrorMessage(false);

        if (questions[currentQuestion].type==='fillInTheBlank'){
            // Convertir la respuesta del usuario y la respuesta correcta a minúsculas y quitar los tildes antes de comparar
            const userAnswerNormalized = userAnswer.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const correctAnswerNormalized = questions[currentQuestion].answer.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const updatedUserAnswers = [...userAnswers];
            updatedUserAnswers[currentQuestion] = userAnswerNormalized;
            if (userAnswerNormalized === correctAnswerNormalized) {
                setScore(score + 1);
            }
            setUserAnswers(updatedUserAnswers);
            setCurrentQuestion(currentQuestion + 1);
            setUserAnswer(''); // Reseteamos la respuesta del usuario
        }
        else{
        const updatedUserAnswers = [...userAnswers];
        updatedUserAnswers[currentQuestion] = userAnswer;
            
        if (userAnswer === questions[currentQuestion].answer) {
            setScore(score + 1);
        }
        setUserAnswers(updatedUserAnswers);
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer(''); // Reseteamos la respuesta del usuario
        }
    };

    useEffect(() => {
        if (currentQuestion < questions.length) {
            if (questions[currentQuestion].type === 'fillInTheBlank' && !userAnswer.trim()) {
                setShowErrorMessage(true);
            } else if ((questions[currentQuestion].type === 'multipleChoice' || questions[currentQuestion].type === 'trueOrFalse') && !userAnswer) {
                setShowErrorMessage(true);
            } else {
                setShowErrorMessage(false);
            }
        }
    }, [currentQuestion, questions, userAnswer]);
    
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
                            <button key={index} onClick={() => setUserAnswer(option)} className={userAnswer === option ? "selected-button" : ""}>
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
                        <button onClick={() => setUserAnswer("true")}  className={userAnswer === "true" ? "selected-button" : ""}>Verdadero</button>
                        <button onClick={() => setUserAnswer("false")} className={userAnswer === "false" ? "selected-button" : ""}>Falso</button>
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
                    {showErrorMessage  && ( // Mostrar mensaje de error si no hay respuesta seleccionada
                        <p style={{ color: 'red' }}>Seleccione una respuesta antes de pasar a la siguiente pregunta</p>
                    )}
                    <button onClick={handleAnswer} disabled={!userAnswer}>
                        Siguiente pregunta
                    </button>
                    <div>
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
                        <div>
                        <p className="final-score">Tu puntuación final es: {score}/{questions.length}</p>
                        <button onClick={() => setCurrentQuestion(0)} style={{ verticalAlign: 'middle' }}>Volver a jugar</button>
                        <Link to="/"><button style={{ verticalAlign: 'middle' }}>Volver al inicio</button></Link>
                        <button style={{ verticalAlign: 'middle' }} onClick={openCompareModal}>Comparar mis respuestas</button>
                        </div>
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
            ) : (+
                <p>Cargando preguntas...</p>
            )}
            {!loading && <Footer />} {/* Renderizar el Footer solo cuando no hay carga */}
        </div>
    );
}

export default Trivia;
