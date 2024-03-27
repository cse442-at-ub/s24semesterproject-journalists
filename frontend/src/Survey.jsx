import React, { useState } from 'react';
import './Survey.css';

const Survey = () => {
    const [responses, setResponses] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    // Example questions
    const questions = [
        { id: 1, text: "How satisfied are you with our service?", type: "radio", options: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very Unsatisfied"], required: true },
        { id: 2, text: "Select the features you use:", type: "checkbox", options: ["Feature A", "Feature B", "Feature C"], required: false },
        { id: 3, text: "Any comments or suggestions?", type: "textarea", required: false }
    ];

    const handleResponseChange = (questionId, answer) => {
        setResponses({...responses, [questionId]: answer});
    };

    const handleAnswerChange = (questionId, event) => {
        const newAnswers = { ...answers, [questionId]: event.target.value };
        setAnswers(newAnswers);
      };

    const goToNextQuestion = () => {
        if (questions[currentQuestionIndex].required && !responses[questions[currentQuestionIndex].id]) {
            alert("This question is required.");
            return;
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const goToPreviousQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const handleSubmit = () => {
        // Submit logic here
        console.log(responses);
    };

    const renderQuestion = (question) => {
        switch (question.type) {
            case 'radio':
                return question.options.map((option, index) => (
                    <label key={index}>
                        <input
                            type="radio"
                            value={option}
                            checked={responses[question.id] === option}
                            onChange={() => handleResponseChange(question.id, option)}
                        />
                        {option}
                    </label>
                ));
            case 'checkbox':
                return question.options.map((option, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            value={option}
                            checked={responses[question.id]?.includes(option)}
                            onChange={(e) => {
                                const newAnswers = responses[question.id] ? [...responses[question.id]] : [];
                                if (e.target.checked) {
                                    newAnswers.push(option);
                                } else {
                                    const optionIndex = newAnswers.indexOf(option);
                                    newAnswers.splice(optionIndex, 1);
                                }
                                handleResponseChange(question.id, newAnswers);
                            }}
                        />
                        {option}
                    </label>
                ));
            case 'textarea':
                return (
                    <textarea
                        value={responses[question.id] || ''}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="survey-container">
            <div className="question-container">
                {renderQuestion(questions[currentQuestionIndex])}
            </div>
            <div className="question">
                <label htmlFor="q1">Question 1:</label>
                <input
                    id="q1"
                    type="text"
                    value={answers.q1 || ''}
                    onChange={(e) => handleAnswerChange('q1', e)}
                />
            </div>
            <div className="navigation-buttons">
                {currentQuestionIndex > 0 && (
                    <button onClick={goToPreviousQuestion}>Previous</button>
                )}
                {currentQuestionIndex < questions.length - 1 && (
                    <button onClick={goToNextQuestion}>Next</button>
                )}
                {currentQuestionIndex === questions.length - 1 && (
                    <button onClick={handleSubmit}>Submit</button>
                )}
            </div>
        </div>
    );
};

export default Survey;
