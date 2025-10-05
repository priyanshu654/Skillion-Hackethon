import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/course/create", formData);
      
      if (response.data.course) {
        const courseId = response.data.course._id;
      
      // Show success message with options
      if (window.confirm('Course created successfully! 🎉\n\nWould you like to add your first lesson now?')) {
        // Navigate to add lesson
        navigate(`/course/${courseId}/add-lesson`);
      } else {
        // Navigate back to dashboard
        navigate("/dashboard");
      }
      } else {
        throw new Error("Failed to create course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-page">
      <div className="create-course-container">
        <div className="create-course-header">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h1>Create New Course</h1>
          <p>Start building your course by adding basic information</p>
        </div>

        <form onSubmit={handleSubmit} className="create-course-form">
          <div className="form-section">
            <h3>Course Information</h3>
            
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter an engaging course title"
                className="form-input"
                required
              />
              <small>Make it descriptive and appealing to potential students</small>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Course Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what students will learn in this course..."
                rows="5"
                className="form-textarea"
                required
              />
              <small>Be detailed about the course content and learning outcomes</small>
            </div>

            <div className="form-group">
              <label htmlFor="image" className="form-label">
                Course Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/course-image.jpg"
                className="form-input"
              />
              <small>Add a compelling image that represents your course</small>
            </div>

            {formData.image && (
              <div className="image-preview">
                <p>Image Preview:</p>
                <img 
                  src={formData.image} 
                  alt="Course preview" 
                  className="preview-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-button"
              disabled={loading || !formData.title || !formData.description}
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Creating Course...
                </>
              ) : (
                "🚀 Create Course"
              )}
            </button>
          </div>
        </form>

        <div className="creation-tips">
          <h4>💡 Course Creation Tips</h4>
          <ul>
            <li>Choose a clear, specific title that describes your course content</li>
            <li>Write a detailed description highlighting key learning outcomes</li>
            <li>Use high-quality images to make your course stand out</li>
            <li>You can add lessons and more details after creating the course</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .create-course-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .create-course-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }

        .create-course-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }

        .back-button {
          position: absolute;
          left: 0;
          top: 0;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: #e2e8f0;
        }

        .create-course-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .create-course-header p {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .create-course-form {
          margin-bottom: 40px;
        }

        .form-section {
          margin-bottom: 30px;
        }

        .form-section h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 20px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #f1f5f9;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group small {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .image-preview {
          margin-top: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px dashed #d1d5db;
        }

        .image-preview p {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        }

        .preview-image {
          max-width: 100%;
          max-height: 200px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .cancel-button, .create-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cancel-button {
          background: #f8fafc;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .cancel-button:hover {
          background: #e2e8f0;
        }

        .create-button {
          background: #8b5cf6;
          color: white;
        }

        .create-button:hover:not(:disabled) {
          background: #7c3aed;
          transform: translateY(-1px);
        }

        .create-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .button-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .creation-tips {
          background: #f0f9ff;
          padding: 24px;
          border-radius: 12px;
          border-left: 4px solid #0ea5e9;
        }

        .creation-tips h4 {
          margin: 0 0 12px 0;
          color: #0369a1;
          font-size: 16px;
        }

        .creation-tips ul {
          margin: 0;
          padding-left: 20px;
          color: #475569;
        }

        .creation-tips li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .creation-tips li:last-child {
          margin-bottom: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .create-course-container {
            padding: 24px;
            margin: 10px;
          }

          .create-course-header h1 {
            font-size: 24px;
          }

          .form-actions {
            flex-direction: column;
          }

          .cancel-button, .create-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateCourse;