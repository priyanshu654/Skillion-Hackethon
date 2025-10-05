import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const CourseManagement = () => {
  const navigate = useNavigate();
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await API.get("/admin/pending");
        setPendingCourses(response.data.courses || []);
        
      } catch (err) {
        console.error("Error fetching pending courses:", err);
        setError(
          err.response?.data?.message || 
          err.message || 
          "Failed to fetch pending courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCourses();
  }, []);

  const handlePreview = (courseId) => {
    console.log('Preview button clicked for course:', courseId);
    // Navigate to course details page for preview using admin preview endpoint
    navigate(`/course/admin-preview/${courseId}`);
  };

  const handleApprove = async (courseId) => {
    try {
      if (!window.confirm("Are you sure you want to approve and publish this course?")) {
        return;
      }
      
      await API.post(`/admin/courses/${courseId}/approve`, {
        action: 'approve'
      });
      setPendingCourses(prev => prev.filter(course => course._id !== courseId));
      alert("Course approved and published successfully!");
    } catch (err) {
      console.error("Error approving course:", err);
      alert(err.response?.data?.message || "Failed to approve course");
    }
  };

  const handleReject = async (courseId) => {
    try {
      if (!window.confirm("Are you sure you want to reject this course?")) {
        return;
      }
      
      await API.post(`/admin/courses/${courseId}/approve`, {
        action: 'reject'
      });
      setPendingCourses(prev => prev.filter(course => course._id !== courseId));
      alert("Course rejected successfully!");
    } catch (err) {
      console.error("Error rejecting course:", err);
      alert(err.response?.data?.message || "Failed to reject course");
    }
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
        Loading draft courses...
      </div>
    );
  }

  if (error && pendingCourses.length === 0) {
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
          Draft Courses
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: '#718096', 
          margin: 0 
        }}>
          Review and manage courses pending approval
        </p>
      </div>

      {pendingCourses.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#718096'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <h3>No Draft Courses</h3>
          <p>There are no courses currently in draft status.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {pendingCourses.map(course => (
            <div key={course._id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
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
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Draft
                </span>
              </div>
              
              <p style={{
                fontSize: '14px',
                color: '#4a5568',
                lineHeight: '1.5',
                marginBottom: '16px'
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
                  <span>Creator: </span>
                  <strong>{course.creatorId?.name || "Unknown"}</strong>
                </div>
                <div style={{ fontStyle: 'italic' }}>
                  Created: {new Date(course.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px'
              }}>
                <button 
                  onClick={() => handlePreview(course._id)}
                  style={{
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
                  👁️ Preview
                </button>
                
                <button 
                  onClick={() => handleReject(course._id)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#dc2626'}
                  onMouseOut={e => e.target.style.backgroundColor = '#ef4444'}
                >
                  ❌ Reject
                </button>
                
                <button 
                  onClick={() => handleApprove(course._id)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#059669'}
                  onMouseOut={e => e.target.style.backgroundColor = '#10b981'}
                >
                  ✅ Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseManagement;