import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Trivia() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const { type } = useParams(); // Obtenemos el tipo de la URL

    useEffect(() => {
        fetch('/data/questions.json')
            .then(response => response.json())
            .then(data => setQuestions(data[type]));
    }, [type]);

    const handleAnswer = (answer) => {
        if (answer === questions[currentQuestion].answer) {
            setScore(score + 1);
        }
        setCurrentQuestion(currentQuestion + 1);
    };

    return (
        <div>
            <h1>Trivia de {type}</h1>
            {questions.length > 0 ? (
                <div>
                    <p>{questions[currentQuestion].question}</p>
                    {questions[currentQuestion].options ? (
                        questions[currentQuestion].options.map((option, index) => (
                            <button key={index} onClick={() => handleAnswer(option)}>
                                {option}
                            </button>
                        ))
                    ) : (
                        <p>Esta pregunta no tiene opciones.</p>
                    )}
                </div>
            ) : (
                <p>Cargando preguntas...</p>
            )}
            <p>Puntuación: {score}</p>
        </div>
    );
}

export default Trivia;
