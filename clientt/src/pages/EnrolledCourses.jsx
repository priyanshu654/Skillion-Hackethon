import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.get("/learner/enrolled-courses");
      setCourses(response.data.courses || []);
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
      setError(err.response?.data?.message || "Failed to fetch enrolled courses");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}/details`);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading your courses...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#666'
      }}>
        <div style={{fontSize: '48px', marginBottom: '16px'}}>⚠️</div>
        <h3>Error Loading Courses</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          margin: '0 0 8px 0', 
          color: '#1a202c' 
        }}>
          My Enrolled Courses
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: '#718096', 
          margin: 0 
        }}>
          Continue your learning journey
        </p>
      </div>

      {courses.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#718096'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <h3>No Enrolled Courses</h3>
          <p>You haven't enrolled in any courses yet. Browse published courses to get started!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {courses.map(course => (
            <div key={course._id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1a202c',
                  margin: '0',
                  flex: 1,
                  paddingRight: '10px'
                }}>
                  {course.title}
                </h3>
                <span style={{
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Enrolled
                </span>
              </div>
              
              <p style={{
                fontSize: '14px',
                color: '#4a5568',
                lineHeight: '1.5',
                marginBottom: '16px',
                flex: 1
              }}>
                {course.description || "No description provided"}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#718096',
                marginBottom: '20px'
              }}>
                <div>
                  <span>By: </span>
                  <strong>{course.creatorName || "Unknown"}</strong>
                </div>
                <div>
                  <span>{course.lessonsCount || 0} lessons</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '10px'
              }}>
                <button 
                  onClick={() => handleViewCourse(course._id)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#2563eb'}
                  onMouseOut={e => e.target.style.backgroundColor = '#3b82f6'}
                >
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;