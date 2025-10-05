import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";
import CreateCourse from "./CreateCourse";
import MyCourses from "./MyCourses"; // Add this import
import PublishedCourses from "./PublishedCourses";
import EnrolledCourses from "./EnrolledCourses";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  // Get active tab from URL or default to dashboard
  const getActiveTabFromURL = () => {
    const path = location.pathname;
    if (path.includes('/create-course')) return 'create';
    if (path.includes('/manage-users')) return 'manage-users';
    if (path.includes('/manage-courses')) return 'manage-courses';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/my-courses')) return 'my-courses';
    if (path.includes('/courses')) return 'courses';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromURL());

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromURL());
  }, [location.pathname]);

  const userRole = user?.role || "learner";

  // ADD THIS MISSING FUNCTION
  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  // ADD THIS MISSING FUNCTION
  const getStats = () => {
    if (userRole === "creator") {
      return {
        created: 8,
        students: 1245,
        revenue: "$2,450",
        rating: 4.8,
      };
    }

    if (userRole === "admin") {
      return {
        pendingCourses: 5,
        pendingUsers: 3,
        totalRevenue: "$12,450",
        activeUsers: 1250,
      };
    }

    return {
      enrolled: 12,
      completed: 3,
      inProgress: 4,
      hours: 24,
    };
  };

  const getAvailableTabs = () => {
    const baseTabs = [
      { id: "dashboard", label: "Dashboard", path: "/dashboard" },
      { id: "courses", label: "All Courses", path: "/courses" },
    ];

    if (userRole === "learner") {
      baseTabs.push(
        { id: "my-courses", label: "My Courses", path: "/my-courses" }
      );
    }

    if (userRole === "creator") {
      baseTabs.push(
        { id: "create", label: "Create Course", path: "/create-course" },
        { id: "my-courses", label: "My Courses", path: "/my-courses" }
      );
    }

    if (userRole === "admin") {
      baseTabs.push(
        { id: "manage-courses", label: "Draft Courses", path: "/manage-courses" },
        { id: "manage-users", label: "Manage Users", path: "/manage-users" },
        { id: "analytics", label: "Analytics", path: "/analytics" }
      );
    }

    return baseTabs;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "create":
        return <CreateCourse />;
      
      case "manage-users":
        return <UserManagement />;
      
      case "manage-courses":
        return <CourseManagement />;
      
      case "my-courses":
        // For learners, show enrolled courses
        // For creators, show their created courses (existing MyCourses component)
        if (userRole === "learner") {
          return <EnrolledCourses />;
        }
        return <MyCourses />;
      
      case "courses":
        // For all users, show published courses
        return <PublishedCourses />;
      
      case "analytics":
        return (
          <div className="analytics-panel">
            <h2>Platform Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>📊 Platform Overview</h3>
                <p>Total Users: 1,250</p>
                <p>Total Courses: 89</p>
                <p>Active Learners: 980</p>
              </div>
              <div className="analytics-card">
                <h3>💰 Revenue</h3>
                <p>Monthly Revenue: $4,250</p>
                <p>Total Revenue: $45,680</p>
                <p>Average Course Price: $52</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="default-content">
            <h2>Welcome to {userRole === 'admin' ? 'Admin' : userRole === 'creator' ? 'Creator' : 'Learner'} Dashboard</h2>
            <p>Use the navigation above to manage different aspects of the platform.</p>
          </div>
        );
    }
  };

  const stats = getStats();
  const availableTabs = getAvailableTabs();

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h2 className="logo" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>
            🎓 MicroCourses
          </h2>
        </div>

        <div className="nav-links">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "nav-link active" : "nav-link"}
              onClick={() => handleTabClick(tab)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{user?.name || "Welcome!"}</span>
            <span className={`user-role role-${userRole}`}>{userRole}</span>
          </div>
          <button className="logout-button" onClick={() => navigate("/login")}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Section - Only show on dashboard */}
        {activeTab === 'dashboard' && (
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                {userRole === "admin" && "Admin Dashboard 👨‍💼"}
                {userRole === "creator" && "Creator Studio 🎬"}
                {userRole === "learner" && `Welcome back, ${user?.name || "Learner"}! 👋`}
              </h1>
              <p className="hero-subtitle">
                {userRole === "admin" && "Manage platform content, users, and analytics"}
                {userRole === "creator" && "Create and manage your courses"}
                {userRole === "learner" && "Continue your learning journey"}
              </p>
            </div>
            <div className="hero-stats">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="stat-card">
                  <span className="stat-number">{value}</span>
                  <span className="stat-label">
                    {key.split(/(?=[A-Z])/).join(" ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab Content */}
        <section className="tab-content">{renderTabContent()}</section>
      </main>

      {/* Add CSS Styles */}
      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background-color: #f8fafc;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 40px;
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid #e2e8f0;
        }

        .nav-brand {
          display: flex;
          align-items: center;
        }

        .logo {
          margin: 0;
          color: #667eea;
          font-size: 24px;
          font-weight: 700;
          transition: color 0.2s ease;
        }

        .logo:hover {
          color: #5a67d8;
        }

        .nav-links {
          display: flex;
          gap: 10px;
        }

        .nav-link {
          padding: 8px 16px;
          border: none;
          background-color: transparent;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .nav-link.active {
          background-color: #667eea;
          color: white;
        }

        .nav-link:hover {
          background-color: #e2e8f0;
        }

        .nav-link.active:hover {
          background-color: #5a67d8;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .user-role {
          font-size: 12px;
          text-transform: capitalize;
        }

        .role-admin {
          color: #ef4444;
          font-weight: 600;
        }

        .role-creator {
          color: #8b5cf6;
          font-weight: 600;
        }

        .role-learner {
          color: #059669;
          font-weight: 600;
        }

        .logout-button {
          padding: 8px 16px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-button:hover {
          background-color: #dc2626;
        }

        .main-content {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .hero-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding: 30px;
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .hero-content {
          flex: 1;
        }

        .hero-title {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .hero-subtitle {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .hero-stats {
          display: flex;
          gap: 20px;
        }

        .stat-card {
          display: flex;
          flexDirection: column;
          alignItems: center;
          padding: 20px;
          backgroundColor: #f8fafc;
          borderRadius: 12px;
          minWidth: 80px;
        }

        .stat-number {
          fontSize: 24px;
          fontWeight: 700;
          color: #667eea;
        }

        .stat-label {
          fontSize: 12px;
          color: #64748b;
          marginTop: 4px;
          textTransform: capitalize;
        }

        .tab-content {
          backgroundColor: white;
          borderRadius: 16px;
          padding: 30px;
          boxShadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        /* ... rest of your CSS styles remain the same ... */

      `}</style>
    </div>
  );
};

export default Home;