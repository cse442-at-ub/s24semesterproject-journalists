import React, { useState } from 'react';
import './SurveySection.css'; // Importing CSS for styling the survey components
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Main functional component for the survey section
const SurveySection = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Tracks the current question
  const [responses, setResponses] = useState({}); // Stores user responses
  const [errors, setErrors] = useState({}); // Stores validation errors
  const navigate = useNavigate();
  // Sample structure for survey questions
  const questions = [
    { 
      id: 1, 
      text: "Pick a color", 
      type: 'single-choice', 
      options: ['Red', 'Blue', 'Green'], 
      required: true 
    },
    { 
      id: 2, 
      text: "Pick an activity", 
      type: 'single-choice', 
      options: ['Reading', 'Gaming', 'Traveling', 'Cooking'], 
      required: true 
    },
    { 
      id: 3, 
      text: "A little bit about yourself you want to share to the world.", 
      type: 'text', 
      required: false 
    },
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
 // Handles survey submission
const handleSubmit = async () => {
  event.preventDefault();

  // Array to hold all the Axios promises for submitting each question-answer pair
  const submitPromises = [];

  // Token for Authorization header
  const token = localStorage.getItem("token");

  // Iterate over the responses state object
  for (const questionId in responses) {
    const question = questions.find(q => q.id.toString() === questionId);
    if (!question) continue;  // Skip if no matching question found (defensive)

    const payload = {
      question: question.text,
      answer: responses[questionId]
    };

    // Create a POST request for each question-answer pair
    const submitPromise = axios.post('/backend/survey/add_survey.php', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    submitPromises.push(submitPromise);
  }

  try {
    // Wait for all Axios requests to complete
    await Promise.all(submitPromises);
    console.log('All survey responses submitted successfully.');
    // Navigate to another route upon successful submission
    navigate('/Friend_Dashboard');
  } catch (error) {
    console.error('Error submitting survey responses:', error);
  }
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
      case 'text': // Added case for an open-ended text question
        return (
          <div key={question.id}>
            <label>{question.text}</label>
            <textarea
              value={responses[question.id] || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder="Your answer..."
            />
          </div>
        );
      default:
        return null; // In case of an unrecognized question type
    }
  };

  return (
    <div className="journal-layout">
      <div className="logo-section">
        <h1>Journalist</h1>
      </div>
      <div className="survey-section">
        {questions.length > 0 && (
          <>
            <div className="question-container">
              <h2>{questions[currentQuestionIndex].text}</h2>
              {renderQuestion(questions[currentQuestionIndex])}
              {errors[questions[currentQuestionIndex].id] && (
                <div className="error-message">{errors[questions[currentQuestionIndex].id]}</div>
              )}
            </div>
            <div className="navigation-buttons">
              <button 
                className="prev-button" 
                onClick={handlePrevious} 
                disabled={currentQuestionIndex === 0}>
                Previous
              </button>
              {currentQuestionIndex < questions.length - 1 && (
                <button 
                  className="next-button" 
                  onClick={handleNext}>
                  Next
                </button>
              )}
              {currentQuestionIndex === questions.length - 1 && (
                <button 
                  className="submit-button" 
                  onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
  
};

export default SurveySection;
