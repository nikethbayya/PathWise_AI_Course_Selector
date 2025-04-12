import React from 'react';
import { useChatContext } from '../context/ChatContext';
import './EnrolledCourses.css';

function EnrolledCourses() {
  const { enrolledCourses, removeEnrolledCourse } = useChatContext();

  // Handle unenrolling from a course
  const handleUnenroll = (courseCode, courseSection) => {
    const success = removeEnrolledCourse(courseCode, courseSection);
    if (success) {
      window.alert(`You've been unenrolled from this course.`);
    } else {
      window.alert(`Error: Could not unenroll from this course.`);
    }
  };

  return (
    <div className="enrolled-wrapper">
      <div className="enrolled-container">
        <div className="enrolled-header">
          <h2>Enrollment Cart</h2>
        </div>
        
        <div className="enrolled-content">
          {enrolledCourses.length > 0 ? (
            <div className="enrolled-list">
              {enrolledCourses.map((course, index) => (
                <div key={index} className="enrolled-course-card">
                  <div className="enrolled-course-header">
                    <h3>{course.name}</h3>
                  </div>
                  <div className="enrolled-course-details">
                    <p><strong>Course Code:</strong> {course.code}</p>
                    <p><strong>Instructor:</strong> {course.instructor}</p>
                    <p><strong>Schedule:</strong> {course.day}, {course.time}</p>
                    <p><strong>Location:</strong> {course.location}</p>
                    <p><strong>Credits:</strong> {course.credits}</p>
                    <p><strong>Program:</strong> {course.program}</p>
                    <p><strong>Section:</strong> {course.section}</p>
                  </div>
                  <div className="enrolled-course-actions">
                    <button 
                      className="remove-button"
                      onClick={() => handleUnenroll(course.code, course.section)}
                    >
                      Unenroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-enrolled-courses">
              <div className="empty-cart-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00a8e8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <p>You haven't enrolled in any courses yet.</p>
              <p>Browse the courses tab to find and enroll in courses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnrolledCourses; 