import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.get("/course/my-courses");
      console.log("My courses response:", response.data);
      
      if (response.data.success) {
        setCourses(response.data.courses || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch courses");
      }
      
    } catch (err) {
      console.error("Error fetching my courses:", err);
      setError(err.response?.data?.message || "Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: "#fef3c7", textColor: "#92400e", label: "Draft" },
      published: { color: "#d1fae5", textColor: "#065f46", label: "Published" }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span 
        style={{
          backgroundColor: config.color,
          color: config.textColor,
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600'
        }}
      >
        {config.label}
      </span>
    );
  };

  // Navigate to course details page
  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}/details`);
  };

  const handleAddLesson = (courseId) => {
    navigate(`/course/${courseId}/add-lesson`);
  };

  const handleViewAnalytics = (courseId) => {
    navigate(`/course/${courseId}/analytics`);
  };

  const handleCreateCourse = () => {
    navigate("/create-course");
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        Loading your courses...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.title}>My Courses</h2>
          <div style={styles.headerActions}>
            <button 
              style={styles.refreshButton}
              onClick={fetchMyCourses}
              disabled={loading}
            >
              🔄 Refresh
            </button>
            <button 
              style={styles.createButton}
              onClick={handleCreateCourse}
            >
              🚀 Create New Course
            </button>
          </div>
        </div>
        <p style={styles.subtitle}>Manage and track your created courses</p>
        
        {error && (
          <div style={styles.warningMessage}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {courses.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📚</div>
          <h3 style={styles.emptyTitle}>No Courses Created Yet</h3>
          <p style={styles.emptyText}>
            Start creating your first course to share your knowledge with students
          </p>
          <button 
            style={styles.createFirstButton}
            onClick={handleCreateCourse}
          >
            🚀 Create Your First Course
          </button>
        </div>
      ) : (
        <>
          <div style={styles.statsBar}>
            <span style={styles.statItem}>
              <strong>{courses.length}</strong> course{courses.length !== 1 ? 's' : ''}
            </span>
            <span style={styles.statItem}>
              <strong>{courses.filter(c => c.status === 'published').length}</strong> published
            </span>
            <span style={styles.statItem}>
              <strong>{courses.filter(c => c.status === 'draft').length}</strong> draft
            </span>
          </div>
          
          <div style={styles.coursesGrid}>
            {courses.map(course => (
              <div 
                key={course._id} 
                style={styles.courseCard}
                onClick={() => handleViewCourse(course._id)} // Make entire card clickable
              >
                <div style={styles.imageContainer}>
                  <img 
                    src={course.image || "https://via.placeholder.com/300x200/667eea/ffffff?text=No+Image"} 
                    alt={course.title}
                    style={styles.courseImage}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200/667eea/ffffff?text=No+Image";
                    }}
                  />
                  <div style={styles.statusBadge}>
                    {getStatusBadge(course.status)}
                  </div>
                </div>
                
                <div style={styles.courseContent}>
                  {/* Make title clickable */}
                  <h3 
                    style={styles.courseTitle}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent double navigation
                      handleViewCourse(course._id);
                    }}
                  >
                    {course.title}
                  </h3>
                  
                  <p style={styles.courseDescription}>
                    {course.description && course.description.length > 100 
                      ? `${course.description.substring(0, 100)}...` 
                      : course.description || "No description provided"
                    }
                  </p>
                  
                  <div style={styles.courseStats}>
                    <div style={styles.stat}>
                      <span style={styles.statLabel}>Lessons:</span>
                      <span style={styles.statValue}>{course.totalLessons || 0}</span>
                    </div>
                    <div style={styles.stat}>
                      <span style={styles.statLabel}>Created:</span>
                      <span style={styles.statValue}>
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {course.publishedAt && (
                      <div style={styles.stat}>
                        <span style={styles.statLabel}>Published:</span>
                        <span style={styles.statValue}>
                          {new Date(course.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={styles.courseActions}>
                    <button 
                      style={styles.viewButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCourse(course._id);
                      }}
                    >
                      👁️ View Details
                    </button>
                    <button 
                      style={styles.addLessonButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddLesson(course._id);
                      }}
                    >
                      ➕ Add Lesson
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
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  title: {
    margin: '0',
    color: '#1e293b',
    fontSize: '24px',
    fontWeight: '600',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  refreshButton: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  createButton: {
    padding: '8px 16px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
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
    margin: '0 0 20px 0',
    fontSize: '16px',
  },
  createFirstButton: {
    padding: '12px 24px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  statsBar: {
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    borderLeft: '4px solid #667eea',
    display: 'flex',
    gap: '20px',
  },
  statItem: {
    color: '#374151',
    fontSize: '14px',
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
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    cursor: 'pointer', // Indicate it's clickable
  },
  courseCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    borderColor: '#667eea',
  },
  imageContainer: {
    position: 'relative',
  },
  courseImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
  },
  courseContent: {
    padding: '20px',
  },
  courseTitle: {
    margin: '0 0 12px 0',
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '1.4',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  courseTitleHover: {
    color: '#667eea',
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
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  addLessonButton: {
    flex: 1,
    padding: '10px 12px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  analyticsButton: {
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
styles.courseCard[':hover'] = styles.courseCardHover;
styles.courseTitle[':hover'] = { color: '#667eea' };
styles.refreshButton[':hover'] = { backgroundColor: '#2563eb' };
styles.createButton[':hover'] = { backgroundColor: '#7c3aed' };
styles.createFirstButton[':hover'] = { backgroundColor: '#7c3aed' };
styles.viewButton[':hover'] = { backgroundColor: '#5a67d8' };
styles.addLessonButton[':hover'] = { backgroundColor: '#7c3aed' };
styles.analyticsButton[':hover'] = { backgroundColor: '#059669' };

// Add CSS animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);