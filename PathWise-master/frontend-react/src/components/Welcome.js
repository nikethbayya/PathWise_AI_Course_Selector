import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate('/chatbot');
  };

  return (
    <div className="welcome-wrapper">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1>Welcome to PathWise!</h1>
        </div>
        <div className="welcome-content">
          <p>Let's find the perfect course for you. PathWise helps you discover and choose the most suitable courses based on your interests, goals, and preferences.</p>
          <p>Click the button below to start chatting with our AI-powered assistant.</p>
          <button className="primary-button" onClick={handleNextClick}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Welcome; 