import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import { useChatContext } from '../context/ChatContext';
import './ChatBot.css';

function ChatBot() {
  const { 
    messages, 
    setMessages, 
    inputText, 
    setInputText, 
    isLoading, 
    setIsLoading 
  } = useChatContext();
  
  const chatboxRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null); // Create ref for the input element

  // Auto-scroll to bottom and auto-focus input when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage = { text: inputText, isUser: true };
    setMessages([...messages, userMessage]);
    
    // Clear input and focus it again
    setInputText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Set loading state
    setIsLoading(true);

    try {
      // Connect to backend API for chatbot response
      const response = await axios.post('/chat', { query: inputText });
      // Add bot message from the API response
      const botMessage = { text: response.data.response, isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        text: 'Sorry, I encountered an error. Please try again.', 
        isUser: false,
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h1>Smart Course Selector</h1>
        </div>
        
        <div className="chatbox" ref={chatboxRef}>
          {messages.map((message, index) =>
            message.isUser ? (
              <div key={index} className="message user-message">
                {message.text}
              </div>
            ) : (
              <div key={index} className={`message bot-message ${message.isError ? 'error-message' : ''}`}>
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            )
          )}
          {isLoading && (
            <div className="message bot-message loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="input-area">
          <input 
            type="text" 
            ref={inputRef} // Attach the input ref here
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question here..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;