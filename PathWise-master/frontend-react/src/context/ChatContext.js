import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the chat context
const ChatContext = createContext();

// Custom hook to use the chat context
export const useChatContext = () => useContext(ChatContext);

// Provider component for chat data
export const ChatProvider = ({ children }) => {
  // Initialize state with data from localStorage or default values
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { text: 'Hello! Ask me anything about courses.', isUser: false }
    ];
  });
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Function to clear chat history (for example on manual refresh)
  const clearChat = () => {
    setMessages([{ text: 'Hello! Ask me anything about courses.', isUser: false }]);
    localStorage.removeItem('chatMessages');
  };

  // Function to enroll in a course
  const enrollInCourse = (course) => {
    // Check if course is already enrolled
    if (!enrolledCourses.some(c => c.code === course.code && c.section === course.section)) {
      setEnrolledCourses([...enrolledCourses, course]);
      return true; // Enrollment successful
    }
    return false; // Already enrolled
  };

  // Function to remove a course from enrolled courses
  const removeEnrolledCourse = (courseCode, courseSection) => {
    // Check if the course is actually enrolled
    const isEnrolled = enrolledCourses.some(
      course => course.code === courseCode && course.section === courseSection
    );
    
    if (isEnrolled) {
      setEnrolledCourses(enrolledCourses.filter(
        course => !(course.code === courseCode && course.section === courseSection)
      ));
      return true; // Successfully unenrolled
    }
    return false; // Not enrolled, nothing to remove
  };

  // Context value to be provided
  const value = {
    messages,
    setMessages,
    inputText,
    setInputText,
    isLoading,
    setIsLoading,
    clearChat,
    enrolledCourses,
    enrollInCourse,
    removeEnrolledCourse
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 