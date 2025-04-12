import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './components/Welcome';
import ChatBot from './components/ChatBot';
import Courses from './components/Courses';
import EnrolledCourses from './components/EnrolledCourses';
import { ChatProvider } from './context/ChatContext';
import './App.css';

// Helper component to handle the page reload redirect
function RedirectHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if page was reloaded
    const wasReloaded = localStorage.getItem('pageReloaded');
    if (wasReloaded === 'true') {
      // Navigate to home page
      navigate('/');
      // Clear the flag
      localStorage.removeItem('pageReloaded');
    }
  }, [navigate]);
  
  return null;
}

function App() {
  useEffect(() => {
    document.title = "PathWise";
  }, []);

  return (
    <ChatProvider>
      <Router>
        <RedirectHandler />
        <Routes>
          <Route path="/" element={
            <Layout>
              <Welcome />
            </Layout>
          } />
          <Route path="/courses" element={
            <Layout>
              <Courses />
            </Layout>
          } />
          <Route path="/enrolled" element={
            <Layout>
              <EnrolledCourses />
            </Layout>
          } />
          <Route path="/chatbot" element={
            <Layout>
              <ChatBot />
            </Layout>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
}

export default App; 