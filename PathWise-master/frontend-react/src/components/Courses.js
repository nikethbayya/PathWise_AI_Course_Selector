import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Courses.css';
import useScrollBehavior from './CourseScroll';
import { useChatContext } from '../context/ChatContext';

// Helper function to pick a random element from an array
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Arrays of possible random values
const instructorsList = [
  "Dr. Clara Lee",
  "Dr. Dan Patel",
  "Dr. Alice Johnson",
  "Prof. Emily Davis",
  "Prof. Bob Smith",
  "Dr. Michael Brown"
];

const daysList = ["Mon/Wed", "Tue/Thu", "Fri", "Sat"];
const timesList = [
  "9:00 AM - 10:30 AM",
  "11:00 AM - 12:30 PM",
  "1:00 PM - 2:30 PM",
  "3:00 PM - 4:30 PM"
];
const locationsList = [
  "Main Bldg/Room 101",
  "Main Bldg/Room 102",
  "Main Bldg/Room 103",
  "Main Bldg/Room 104",
  "Main Bldg/Room 105",
  "Main Bldg/Room 106"
];

/* 
  --- Fetched Courses ---
  Primary courses include a selection of CSCI-A courses along with key MSDS core courses.
*/
const fetchedCourses = [
  // CSCI-A courses
  {
    program: "Computer Science",
    name: "CSCI-A 504 Introductory C++ Programming",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 2,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 504"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 506 Object-Oriented Programming in C++",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 2,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 506"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 521 Computing Tools for Scientific Research",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 521"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 538 Network Technologies and Systems Administration",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 538"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 541 Computing and Technology Bootcamp",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 541"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 542 Technical Foundations of Cybersecurity",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 542"
  },
  // MSDS core courses (fetched)
  {
    program: "Master of Data Science",
    name: "STAT-S 520 Introduction to Statistics",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "Core",
    code: "STAT-S 520"
  },
  {
    program: "Master of Data Science",
    name: "CSCI-B 551 Elements of Artificial Intelligence",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "Core",
    code: "CSCI-B 551"
  },
  {
    program: "Master of Data Science",
    name: "CSCI-B 561 Advanced Database Concepts",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "Core",
    code: "CSCI-B 561"
  },
  {
    program: "Master of Data Science",
    name: "ENGR-E 583 Information Visualization",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "Core",
    code: "ENGR-E 583"
  },
  // Continue with more primary courses if needed...
];

// Additional courses (secondary set; includes remaining CSCI-A courses and further MSDS courses)
const additionalCourses = [
  // Remaining CSCI-A courses
  {
    program: "Computer Science",
    name: "CSCI-A 590 Topics in Programming",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 1,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 590"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 591 Introduction to Computer Science",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 591"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 592 Introduction to Software Systems",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 592"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 593 Computer Structures",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 593"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 594 Data Structures",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 594"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 595 Fundamentals of Computing Theory",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 595"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 596 Programming Languages",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 596"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 597 Introduction to Programming I",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 597"
  },
  {
    program: "Computer Science",
    name: "CSCI-A 598 Introduction to Programming II",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "A",
    code: "CSCI-A 598"
  },
  // MSDS additional courses
  {
    program: "Master of Data Science",
    name: "INFO-I 520 Security for Networked Systems",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "Domain",
    code: "INFO-I 520"
  },
  {
    program: "Master of Data Science",
    name: "INFO-I 507 Introduction to Health Informatics",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "Domain",
    code: "INFO-I 507"
  },
  {
    program: "Master of Data Science",
    name: "DSCI-D 590 Topics in Data Science",
    instructor: getRandom(instructorsList),
    day: getRandom(daysList),
    time: getRandom(timesList),
    credits: 3,
    location: getRandom(locationsList),
    section: "Project",
    code: "DSCI-D 590"
  }
];

// Combine all courses into one array
const allCourses = [...fetchedCourses, ...additionalCourses];

function Courses() {
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [page, setPage] = useState(1);
  const [dayFilter, setDayFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const coursesPerPage = 15;
  
  const { enrollInCourse, removeEnrolledCourse, enrolledCourses } = useChatContext();
  const navigate = useNavigate();
  useScrollBehavior();

  // Load courses from the combined array
  useEffect(() => {
    setCoursesData(allCourses);
    setLoading(false);
  }, []);

  // Filter courses based on search term and filters
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = (
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesDay = dayFilter === '' ||
      course.day === dayFilter ||
      (course.day.includes('/') &&
        (course.day.split('/')[0] === dayFilter || course.day.split('/')[1] === dayFilter));
    
    const matchesProgram = programFilter === '' || course.program === programFilter;
    
    return matchesSearch && matchesDay && matchesProgram;
  });

  // Pagination calculations
  const indexOfLastCourse = page * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const viewCourseDetails = (course) => {
    console.log("Viewing course details for:", course.name);
    setSelectedCourse(course);
  };

  const backToCourses = () => {
    setSelectedCourse(null);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDayFilter('');
    setProgramFilter('');
    setPage(1);
  };

  const handleEnroll = (course) => {
    const success = enrollInCourse(course);
    if (success) {
      const viewCart = window.confirm(`You've enrolled in ${course.name}!\n\nWould you like to view your Enrollment Cart?`);
      if (viewCart) {
        navigate('/enrolled');
      }
    } else {
      window.alert(`You are already enrolled in ${course.name}.`);
    }
  };

  const handleUnenroll = (course) => {
    const success = removeEnrolledCourse(course.code, course.section);
    if (success) {
      window.alert(`You've been unenrolled from ${course.name}.`);
      if (selectedCourse && selectedCourse.code === course.code && selectedCourse.section === course.section) {
        setSelectedCourse(null);
      }
    } else {
      window.alert(`Couldn't unenroll from ${course.name}. You might not be enrolled in this course.`);
    }
  };

  const generateDescription = (course) => {
    const name = course.name.toLowerCase();
    const program = course.program;
    if (name.includes('python')) {
      return `This comprehensive course introduces students to Python programming language, a versatile tool widely used in data science, machine learning, web development, and automation. Students will learn core programming concepts, data structures, and Python libraries essential for ${program}s. The course includes practical coding exercises and real-world applications.`;
    } else if (name.includes('machine learning')) {
      return `This course provides a solid foundation in machine learning algorithms, techniques, and applications. Students will explore supervised and unsupervised learning, model evaluation, and practical implementation using industry-standard tools and libraries. Designed specifically for aspiring ${program}s, this course balances theoretical concepts with hands-on experience.`;
    } else if (name.includes('deep learning')) {
      return `An advanced course covering neural networks, deep learning architectures, and their applications in solving complex problems. Students will learn to design, train, and evaluate neural networks for tasks such as image recognition, natural language processing, and generative models. Essential for ${program}s looking to specialize in AI technologies.`;
    } else if (name.includes('ux design')) {
      return `This course focuses on user experience design principles, methodologies, and best practices. Students will learn to conduct user research, create wireframes, develop prototypes, and perform usability testing. Tailored for aspiring ${program}s, the course emphasizes human-centered design approaches for creating intuitive and engaging digital products.`;
    } else if (name.includes('product management')) {
      return `A comprehensive introduction to product management in the tech industry. Students will learn to identify market opportunities, define product requirements, create roadmaps, and collaborate with cross-functional teams. This course equips aspiring ${program}s with the skills needed to guide products from conception to market.`;
    } else if (name.includes('data science')) {
      return `This course provides a comprehensive introduction to the field of data science, covering statistical analysis, data visualization, and predictive modeling. Students will learn to extract insights from complex datasets using industry-standard tools and techniques. Designed for those pursuing careers as ${program}s, the course emphasizes practical applications and real-world case studies.`;
    } else if (name.includes('ai fundamentals')) {
      return `An essential course covering the core concepts, algorithms, and applications of artificial intelligence. Students will explore problem-solving methods, knowledge representation, machine learning, and ethical considerations in AI development. This foundational course is crucial for ${program}s looking to understand and implement AI solutions.`;
    } else if (name.includes('product strategy')) {
      return `An advanced course focusing on strategic product management in competitive markets. Students will learn to develop product vision, conduct market analysis, create positioning strategies, and measure product success. This course prepares ${program}s to make data-driven decisions that align products with business goals and user needs.`;
    } else if (name.includes('applied data science')) {
      return `This hands-on course focuses on the practical applications of data science in solving real-world problems. Students will work with large datasets, implement machine learning models, and create data-driven solutions. Designed specifically for ${program}s, the course emphasizes industry-relevant skills and project-based learning.`;
    } else {
      return `This course provides students with comprehensive knowledge and practical skills in ${name}. Students will explore various concepts, methodologies, and real-world applications related to this field, preparing them for careers as ${program}s.`;
    }
  };

  const getPrerequisites = (course) => {
    const code = course.code;
    const level = parseInt(code.replace(/\D/g, ''));
    if (level >= 300) {
      return "Intermediate programming experience and completion of introductory courses in the subject area.";
    } else if (level >= 200) {
      return "Basic understanding of programming concepts and completion of introductory courses.";
    } else {
      return "No prerequisites required. This course is suitable for beginners.";
    }
  };

  const renderCourseDetails = () => {
    if (!selectedCourse) return null;
    const isEnrolled = enrolledCourses.some(
      course => course.code === selectedCourse.code && course.section === selectedCourse.section
    );
    return (
      <div className="course-details-view">
        <div className="course-details-header">
          <button className="back-button" onClick={backToCourses}>
            ← Back to Courses
          </button>
          <h2>{selectedCourse.name}</h2>
          <div className="course-code-details">
            <span>{selectedCourse.code}</span>
            <span>{selectedCourse.program} Path</span>
            <span>{selectedCourse.credits} Credits</span>
          </div>
        </div>
        <div className="course-details-content">
          <div className="detail-section">
            <h3>Course Information</h3>
            <div className="detail-items-grid">
              <div className="detail-item">
                <span className="detail-label">Instructor:</span>
                <span className="detail-value">{selectedCourse.instructor}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Schedule:</span>
                <span className="detail-value">{selectedCourse.day}, {selectedCourse.time}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{selectedCourse.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Credits:</span>
                <span className="detail-value">{selectedCourse.credits}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Section:</span>
                <span className="detail-value">{selectedCourse.section}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Program:</span>
                <span className="detail-value">{selectedCourse.program} Path</span>
              </div>
            </div>
          </div>
          <div className="detail-section">
            <h3>Course Description</h3>
            <p>{generateDescription(selectedCourse)}</p>
          </div>
          <div className="detail-section">
            <h3>Prerequisites</h3>
            <p>{getPrerequisites(selectedCourse)}</p>
          </div>
          <div className="detail-section">
            <h3>Learning Outcomes</h3>
            <ul className="outcomes-list">
              <li>Demonstrate proficiency in core concepts and techniques relevant to the subject</li>
              <li>Apply theoretical knowledge to solve practical problems in the field</li>
              <li>Develop critical thinking and analytical skills specific to the discipline</li>
              <li>Create portfolio-worthy projects showcasing acquired skills</li>
              <li>Collaborate effectively in team environments common in industry settings</li>
            </ul>
          </div>
          <div className="detail-section">
            <h3>Required Materials</h3>
            <p>All course materials will be provided digitally. Students should bring a laptop to each session. Additional software requirements will be discussed during the first class.</p>
          </div>
          {isEnrolled ? (
            <button 
              className="unenroll-button course-enroll-button"
              onClick={() => handleUnenroll(selectedCourse)}
              style={{ backgroundColor: '#ff3b30', color: 'white' }}
            >
              Unenroll from Course
            </button>
          ) : (
            <button 
              className="enroll-button course-enroll-button"
              onClick={() => handleEnroll(selectedCourse)}
              style={{ backgroundColor: '#007ea7', color: 'white' }}
            >
              Enroll in Course
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderCoursesList = () => {
    const uniqueDays = [...new Set(coursesData.flatMap(course => {
      if (course.day.includes('/')) {
        return course.day.split('/');
      }
      return course.day;
    }))];
    const dayOrder = { "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6, "Sun": 7 };
    uniqueDays.sort((a, b) => dayOrder[a] - dayOrder[b]);
    const uniquePrograms = [...new Set(coursesData.map(course => course.program))].sort();
    
    return (
      <>
        <div className="courses-header">
          <h1>Available Courses</h1>
          <div className="courses-filters">
            <input 
              type="text" 
              placeholder="Search courses by name, instructor, program, or code..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
            <select 
              className="filter-select"
              value={dayFilter}
              onChange={(e) => {
                setDayFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Days</option>
              {uniqueDays.map((day, index) => (
                <option key={index} value={day}>{day}</option>
              ))}
            </select>
            <select 
              className="filter-select"
              value={programFilter}
              onChange={(e) => {
                setProgramFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Programs</option>
              {uniquePrograms.map((program, index) => (
                <option key={index} value={program}>{program}</option>
              ))}
            </select>
            <button 
              className="reset-filters-button"
              onClick={resetFilters}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              Reset Filters
            </button>
          </div>
        </div>
        {loading ? (
          <div className="loading-indicator">Loading courses...</div>
        ) : (
          <>
            <div className="courses-grid" id="coursesGrid">
              {currentCourses.length > 0 ? currentCourses.map((course, index) => (
                <div key={index} className="course-card">
                  <div className="course-header">
                    <h3>{course.name}</h3>
                    <div className="course-code">
                      {course.code}
                      {enrolledCourses.some(c => c.code === course.code && c.section === course.section) && 
                        <span className="enrolled-badge">Enrolled</span>
                      }
                    </div>
                  </div>
                  <div className="course-details">
                    <div>
                      <p><strong>Instructor:</strong> {course.instructor}</p>
                      <p><strong>Schedule:</strong> {course.day}, {course.time}</p>
                      <p><strong>Location:</strong> {course.location}</p>
                      <p><strong>Credits:</strong> {course.credits}</p>
                      <p><strong>Program:</strong> {course.program}</p>
                    </div>
                    <div className="card-actions">
                      <button 
                        className="learn-more-button"
                        onClick={() => viewCourseDetails(course)}
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="no-courses">
                  <p>No courses match your search criteria. Try adjusting your search terms.</p>
                </div>
              )}
            </div>
            {filteredCourses.length > 0 && (
              <div className="pagination">
                <button 
                  onClick={prevPage} 
                  disabled={page === 1 || filteredCourses.length <= coursesPerPage}
                  className="pagination-button"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {Math.max(1, totalPages)}
                </span>
                <button 
                  onClick={nextPage} 
                  disabled={page === totalPages || filteredCourses.length <= coursesPerPage}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div className="courses-wrapper">
      <div className="courses-container">
        {selectedCourse ? renderCourseDetails() : renderCoursesList()}
      </div>
    </div>
  );
}

export default Courses;
