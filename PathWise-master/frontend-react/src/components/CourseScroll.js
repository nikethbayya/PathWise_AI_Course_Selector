import { useEffect } from 'react';

// This helper component is used to ensure proper scrolling in the Courses component
const useScrollBehavior = () => {
  useEffect(() => {
    // Function to ensure scrollbars appear correctly
    const ensureScrollbars = () => {
      const coursesGrid = document.querySelector('.courses-grid');
      const courseDetailsContent = document.querySelector('.course-details-content');
      
      // Apply force scroll for courses grid
      if (coursesGrid) {
        // Force a reflow to make sure scrollbar appears
        coursesGrid.style.overflow = 'scroll';
        coursesGrid.style.overflowX = 'hidden';
        
        // Add more height if content is not enough to scroll
        const totalHeight = Array.from(coursesGrid.children)
          .reduce((total, child) => total + child.offsetHeight, 0);
        
        if (totalHeight < coursesGrid.offsetHeight) {
          // Add padding to force scrolling
          coursesGrid.style.paddingBottom = '100px';
        }
      }
      
      // Apply force scroll for course details content
      if (courseDetailsContent) {
        courseDetailsContent.style.overflow = 'scroll';
        courseDetailsContent.style.overflowX = 'hidden';
      }
    };

    // Run initially
    ensureScrollbars();
    
    // Run again after a delay to account for dynamic content loading
    const timer = setTimeout(ensureScrollbars, 500);
    
    // Add resize event listener
    window.addEventListener('resize', ensureScrollbars);
    
    return () => {
      window.removeEventListener('resize', ensureScrollbars);
      clearTimeout(timer);
    };
  }, []);
};

export default useScrollBehavior; 