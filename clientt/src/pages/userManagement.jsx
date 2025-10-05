import { useState, useEffect } from "react";
import API from "../api/axios";

const UserManagement = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch pending creator users from API
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await API.get("/admin/users/pending");
        console.log("Pending creators API response:", response.data);
        
        if (response.data.success) {
          setPendingUsers(response.data.users || []);
        } else {
          throw new Error(response.data.message || "Failed to fetch pending creators");
        }
        
      } catch (err) {
        console.error("Error fetching pending creators:", err);
        setError(
          err.response?.data?.message || 
          err.message || 
          "Failed to fetch pending creator applications"
        );
        
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      setActionLoading(userId);
      
      const response = await API.patch(`/admin/users/${userId}/approve`);
      
      if (response.data.success) {
        setPendingUsers(prev => prev.filter(user => user._id !== userId));
        console.log(`Creator ${userId} approved successfully`);
        // Show success message
        alert('Creator approved successfully!');
      } else {
        throw new Error(response.data.message || "Approval failed");
      }
      
    } catch (err) {
      console.error("Error approving creator:", err);
      alert(err.response?.data?.message || "Failed to approve creator");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId, userName) => {
    try {
      setActionLoading(userId);
      
      const reason = prompt(`Please provide a reason for rejecting ${userName}:`, "Does not meet our creator requirements");
      if (reason === null) return; // User cancelled
      
      const response = await API.patch(`/admin/users/${userId}/reject`, { reason });
      
      if (response.data.success) {
        setPendingUsers(prev => prev.filter(user => user._id !== userId));
        console.log(`Creator ${userId} rejected successfully`);
        alert('Creator application rejected successfully!');
      } else {
        throw new Error(response.data.message || "Rejection failed");
      }
      
    } catch (err) {
      console.error("Error rejecting creator:", err);
      alert(err.response?.data?.message || "Failed to reject creator application");
    } finally {
      setActionLoading(null);
    }
  };

  const refreshUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.get("/admin/users/pending");
      if (response.data.success) {
        setPendingUsers(response.data.users || []);
      }
    } catch (err) {
      console.error("Error refreshing creators:", err);
      setError("Failed to refresh creator applications");
    } finally {
      setLoading(false);
    }
  };

  const getDaysSinceApplication = (appliedAt) => {
    if (!appliedAt) return 'Unknown';
    const appliedDate = new Date(appliedAt);
    const today = new Date();
    const diffTime = Math.abs(today - appliedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading pending creator applications...
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="management-header">
        <div className="header-top">
          <h2>Creator Approval Queue</h2>
          <button 
            className="refresh-btn"
            onClick={refreshUsers}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
        <p>Review and approve creator registration applications</p>
        
        {error && (
          <div className="warning-message">
            ⚠️ {error}
          </div>
        )}
      </div>

      {pendingUsers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎉</div>
          <h3>No Pending Creator Applications</h3>
          <p>All creator applications have been reviewed and processed</p>
        </div>
      ) : (
        <>
          <div className="stats-bar">
            <span className="pending-count">
              {pendingUsers.length} pending creator application{pendingUsers.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="users-grid">
            {pendingUsers.map(user => (
              <div key={user._id} className="user-card">
                <div className="user-header">
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="user-info">
                    <h4 className="user-name">{user.name}</h4>
                    <p className="user-email">{user.email}</p>
                    <div className="user-tags">
                      <span className="user-role role-creator">Creator</span>
                      <span className="approval-status pending">Pending Approval</span>
                    </div>
                  </div>
                </div>
                
                <div className="user-details">
                  <p className="user-bio">{user.bio || "No bio provided"}</p>
                  <div className="user-meta">
                    <div className="meta-item">
                      <span className="meta-label">Applied:</span>
                      <span className="meta-value">
                        {user.appliedAt ? new Date(user.appliedAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Waiting:</span>
                      <span className="meta-value">
                        {getDaysSinceApplication(user.appliedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-actions">
                  <button 
                    className="approve-btn"
                    onClick={() => handleApprove(user._id)}
                    disabled={actionLoading === user._id}
                  >
                    {actionLoading === user._id ? (
                      <span className="button-loading">⏳</span>
                    ) : (
                      "✅ Approve Creator"
                    )}
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleReject(user._id, user.name)}
                    disabled={actionLoading === user._id}
                  >
                    {actionLoading === user._id ? (
                      <span className="button-loading">⏳</span>
                    ) : (
                      "❌ Reject Application"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;