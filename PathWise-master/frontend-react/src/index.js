import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Add an event listener to clear chat data on page reload/refresh
// and set a flag to redirect to home
window.addEventListener('beforeunload', () => {
  localStorage.removeItem('chatMessages');
  localStorage.setItem('pageReloaded', 'true');
});

// Check on initial load if it was a reload and we're not on the home page
if (localStorage.getItem('pageReloaded') === 'true' && window.location.pathname !== '/') {
  // Force redirect to home page using window.location
  window.location.href = '/';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 