import React, { useState } from 'react';
import './SurveySection.css'; // Importing CSS for styling the survey components

// Main functional component for the survey section
const SurveySection = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Tracks the current question
  const [responses, setResponses] = useState({}); // Stores user responses
  const [errors, setErrors] = useState({}); // Stores validation errors

  // Sample structure for survey questions
  const questions = [
    { id: 1, text: "What's your favorite color?", type: 'single-choice', options: ['Red', 'Blue', 'Green'], required: true },
    { id: 2, text: "Select your hobbies", type: 'multi-select', options: ['Reading', 'Gaming', 'Traveling', 'Cooking'], required: false },
    { id: 3, text: "Any suggestions for us?", type: 'text', required: false },
    // Add more questions as needed
  ];

  // Handles changes in response (e.g., radio button selection, checkbox toggle)
  const handleResponseChange = (questionId, response) => {
    setResponses({ ...responses, [questionId]: response });
    // Clears error for a question if the user corrects their response
    if (errors[questionId]) {
      const newErrors = { ...errors };
      delete newErrors[questionId];
      setErrors(newErrors);
    }
  };

  // Advances to the next question, with validation for required questions
  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.required && !responses[currentQuestion.id]) {
      setErrors({ ...errors, [currentQuestion.id]: 'This question is required.' });
      return; // Stops navigation if validation fails
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1); // Moves to the next question
  };

  // Moves back to the previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handles survey submission (placeholder for actual submission logic)
  const handleSubmit = () => {
    console.log('Survey responses:', responses);
    // Ideally, you would send 'responses' to the server here
  };

  // Renders the current question based on its type (single-choice, multi-select, or text)
  const renderQuestion = (question) => {
    switch (question.type) {
      case 'single-choice': // For single-choice questions, render radio buttons
        return (
          <div>
            {question.options.map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={() => handleResponseChange(question.id, option)}
                />
                {option}
              </label>
            ))}
          </div>
        );
      case 'multi-select': // For multi-select questions, render checkboxes
        return (
          <div>
            {question.options.map((option, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  name={`question-${question.id}`}
                  value={option}
                  checked={responses[question.id]?.includes(option)}
                  onChange={(e) => {
                    const newResponses = responses[question.id] ? [...responses[question.id]] : [];
                    if (e.target.checked) {
                      newResponses.push(option);
                    } else {
                      const optionIndex = newResponses.indexOf(option);
                      newResponses.splice(optionIndex, 1);
                    }
                    handleResponseChange(question.id, newResponses);
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        );
      case 'text': // For open-ended questions, render a textarea
        return (
          <textarea
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
          />
        );
      default:
        return null; // In case of an unrecognized question type
    }
  };

  return (
    <div className="journal-layout">
      <div className="logo-section">
        {/* Render your logo or any other content for the left side here */}
        <h1>Journalist</h1> {/* Example logo text */}
      </div>
      <div className="survey-section">
        {questions.length > 0 && (
          <div>
            <div>{renderQuestion(questions[currentQuestionIndex])}</div>
            {/* Displays error message if present for the current question */}
            {errors[questions[currentQuestionIndex].id] && <div className="error">{errors[questions[currentQuestionIndex].id]}</div>}
            {/* Previous and Next buttons to navigate through questions */}
            <button disabled={currentQuestionIndex === 0} onClick={handlePrevious}>Previous</button>
            <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
            {/* Submit button shown on the last question */}
            {currentQuestionIndex === questions.length - 1 && <button onClick={handleSubmit}>Submit</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveySection;
