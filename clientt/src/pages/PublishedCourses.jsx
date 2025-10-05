import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function PublishedCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublishedCourses();
  }, []);

  const fetchPublishedCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.get("/course/published");
      console.log("Published courses response:", response.data);
      
      if (response.data.success) {
        // Process courses to ensure consistent structure
        const processedCourses = (response.data.courses || []).map(course => ({
          ...course,
          // Ensure instructor object has proper structure
          instructor: course.instructor || { name: 'Unknown Instructor', email: '' },
          // Ensure image has a fallback
          image: course.image || `https://via.placeholder.com/300x200/667eea/ffffff?text=${encodeURIComponent(course.title || 'Course')}`,
          // Ensure numeric fields have defaults
          totalLessons: course.totalLessons || 0,
          rating: course.rating || 0,
          students: course.students || 0,
          price: course.price || 0,
        }));
        
        setCourses(processedCourses);
      } else {
        throw new Error(response.data.message || "Failed to fetch published courses");
      }
      
    } catch (err) {
      console.error("Error fetching published courses:", err);
      
      // If API route doesn't exist, use mock data
      if (err.response?.status === 404) {
        console.log("API route not found, using mock data");
        setError("Published courses API not available. Showing sample courses.");
        setCourses(getMockPublishedCourses());
      } else {
        setError(err.response?.data?.message || "Failed to load published courses");
      }
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockPublishedCourses = () => {
    return [
      {
        _id: '1',
        title: 'React Fundamentals',
        description: 'Learn React from scratch with hands-on projects',
        image: 'https://via.placeholder.com/300x200/667eea/ffffff?text=React',
        instructor: { name: 'John Doe', email: 'john@example.com' },
        totalLessons: 12,
        rating: 4.8,
        students: 1245,
        price: 49,
        publishedAt: new Date('2024-01-15')
      },
      {
        _id: '2',
        title: 'Advanced JavaScript',
        description: 'Master advanced JavaScript concepts and patterns',
        image: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=JavaScript',
        instructor: { name: 'Jane Smith', email: 'jane@example.com' },
        totalLessons: 15,
        rating: 4.9,
        students: 892,
        price: 59,
        publishedAt: new Date('2024-01-10')
      },
      {
        _id: '3',
        title: 'UI/UX Design Principles',
        description: 'Learn design thinking and create beautiful interfaces',
        image: 'https://via.placeholder.com/300x200/f093fb/ffffff?text=Design',
        instructor: { name: 'Mike Johnson', email: 'mike@example.com' },
        totalLessons: 10,
        rating: 4.7,
        students: 567,
        price: 39,
        publishedAt: new Date('2024-01-08')
      }
    ];
  };

  // Safe instructor name access
  const getInstructorName = (course) => {
    if (!course.instructor) return 'Unknown Instructor';
    
    if (typeof course.instructor === 'string') {
      return course.instructor;
    }
    
    if (course.instructor.name) {
      return course.instructor.name;
    }
    
    return 'Unknown Instructor';
  };

  const handleEnroll = (courseId, e) => {
    e.stopPropagation(); // Prevent card click event
    // For now, just show an alert
    alert('Enrollment feature coming soon!');
    // Later: navigate(`/course/${courseId}/enroll`);
  };

  const handleViewDetails = (courseId, e) => {
    e.stopPropagation(); // Prevent card click event
    navigate(`/course/${courseId}/preview`);
  };

  const handleCardClick = (courseId) => {
    // Navigate to course details page
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        Loading published courses...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>All Published Courses</h2>
        <p style={styles.subtitle}>Explore our collection of available courses</p>
        
        {error && (
          <div style={styles.warningMessage}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {courses.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📚</div>
          <h3 style={styles.emptyTitle}>No Published Courses Available</h3>
          <p style={styles.emptyText}>
            Check back later for new course offerings
          </p>
        </div>
      ) : (
        <>
          <div style={styles.statsBar}>
            <span style={styles.statItem}>
              <strong>{courses.length}</strong> course{courses.length !== 1 ? 's' : ''} available
            </span>
          </div>
          
          <div style={styles.coursesGrid}>
            {courses.map(course => (
              <div 
                key={course._id} 
                style={styles.courseCard}
                onClick={() => handleCardClick(course._id)}
                className="course-card"
              >
                <div style={styles.imageContainer}>
                  <img 
                    src={course.image} 
                    alt={course.title}
                    style={styles.courseImage}
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.src = `https://via.placeholder.com/300x200/667eea/ffffff?text=${encodeURIComponent(course.title || 'Course')}`;
                    }}
                  />
                  <div style={styles.courseBadge}>
                    ⭐ {course.rating || 0} • {course.students || 0} students
                  </div>
                </div>
                
                <div style={styles.courseContent}>
                  <h3 style={styles.courseTitle}>{course.title || 'Untitled Course'}</h3>
                  <p style={styles.courseInstructor}>
                    By {getInstructorName(course)}
                  </p>
                  <p style={styles.courseDescription}>
                    {course.description || 'No description available.'}
                  </p>
                  
                  <div style={styles.courseStats}>
                    <div style={styles.stat}>
                      <span style={styles.statLabel}>Lessons:</span>
                      <span style={styles.statValue}>{course.totalLessons || 0}</span>
                    </div>
                    <div style={styles.stat}>
                      <span style={styles.statLabel}>Price:</span>
                      <span style={styles.statValue}>
                        {course.price === 0 || !course.price ? 'Free' : `$${course.price}`}
                      </span>
                    </div>
                  </div>

                  <div style={styles.courseActions}>
                    <button 
                      style={styles.viewButton}
                      onClick={(e) => handleViewDetails(course._id, e)}
                    >
                      👁️ Preview
                    </button>
                    <button 
                      style={styles.enrollButton}
                      onClick={(e) => handleEnroll(course._id, e)}
                    >
                      🎯 Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px 0',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#1e293b',
    fontSize: '24px',
    fontWeight: '600',
  },
  subtitle: {
    margin: '0',
    color: '#64748b',
    fontSize: '16px',
  },
  warningMessage: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    color: '#92400e',
    padding: '12px 16px',
    borderRadius: '8px',
    marginTop: '10px',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    margin: '0 0 8px 0',
    color: '#374151',
    fontSize: '20px',
    fontWeight: '600',
  },
  emptyText: {
    margin: '0',
    fontSize: '16px',
  },
  statsBar: {
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    borderLeft: '4px solid #667eea',
  },
  statItem: {
    color: '#374151',
    fontSize: '14px',
    fontWeight: '600',
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  },
  courseCard: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer', // Add cursor pointer to indicate clickability
  },
  courseCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
  imageContainer: {
    position: 'relative',
  },
  courseImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  courseBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
  },
  courseContent: {
    padding: '20px',
  },
  courseTitle: {
    margin: '0 0 8px 0',
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '1.4',
  },
  courseInstructor: {
    margin: '0 0 12px 0',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
  },
  courseDescription: {
    margin: '0 0 16px 0',
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.5',
    minHeight: '42px',
  },
  courseStats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
    padding: '12px 0',
    borderTop: '1px solid #f1f5f9',
    borderBottom: '1px solid #f1f5f9',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  courseActions: {
    display: 'flex',
    gap: '8px',
  },
  viewButton: {
    flex: 1,
    padding: '10px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  enrollButton: {
    flex: 1,
    padding: '10px 12px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

// Add hover effects
Object.assign(styles.courseCard, {
  ':hover': styles.courseCardHover
});

Object.assign(styles.viewButton, {
  ':hover': { backgroundColor: '#2563eb' }
});

Object.assign(styles.enrollButton, {
  ':hover': { backgroundColor: '#059669' }
});

// Add CSS animation and additional styles
if (typeof document !== 'undefined' && document.styleSheets.length > 0) {
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, styleSheet.cssRules.length);
  
  // Add additional styles for better UX
  styleSheet.insertRule(`
    .course-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  `, styleSheet.cssRules.length);
}