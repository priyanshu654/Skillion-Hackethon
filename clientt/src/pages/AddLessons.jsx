import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function AddLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    orderIndex: 1,
    transcript: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'orderIndex' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(`/course/${courseId}/lessons`, formData);
      
      if (response.data.success) {
        alert('Lesson added successfully! 🎉');
        // Navigate back to course details or lessons list
        navigate(`/course/${courseId}/edit`);
      } else {
        throw new Error(response.data.message || 'Failed to add lesson');
      }
    } catch (error) {
      console.error('Error adding lesson:', error);
      alert(error.response?.data?.message || 'Failed to add lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 style={styles.title}>Add New Lesson</h1>
        <p style={styles.subtitle}>Add a new lesson to your course</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Lesson Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter lesson title"
            style={styles.input}
            required
            maxLength={100}
          />
          <small style={styles.helpText}>
            {formData.title.length}/100 characters
          </small>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Order Index *
          </label>
          <input
            type="number"
            name="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
            placeholder="1"
            style={styles.input}
            min="1"
            required
          />
          <small style={styles.helpText}>
            Position of this lesson in the course sequence
          </small>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Lesson Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter lesson content (markdown, HTML, or video URL)"
            rows="8"
            style={styles.textarea}
            required
          />
          <small style={styles.helpText}>
            You can use markdown, HTML, or paste a video URL
          </small>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Transcript (Optional)
          </label>
          <textarea
            name="transcript"
            value={formData.transcript}
            onChange={handleChange}
            placeholder="Enter lesson transcript for accessibility"
            rows="4"
            style={styles.textarea}
          />
          <small style={styles.helpText}>
            Transcript helps make your content accessible to all learners
          </small>
        </div>

        <div style={styles.formActions}>
          <button
            type="button"
            style={styles.cancelButton}
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(loading ? styles.loadingButton : {})
            }}
            disabled={loading || !formData.title.trim() || !formData.content.trim()}
          >
            {loading ? (
              <>
                <div style={styles.spinner}></div>
                Adding Lesson...
              </>
            ) : (
              '➕ Add Lesson'
            )}
          </button>
        </div>
      </form>

      <div style={styles.tips}>
        <h4 style={styles.tipsTitle}>💡 Lesson Creation Tips</h4>
        <ul style={styles.tipsList}>
          <li><strong>Clear Titles:</strong> Use descriptive titles that indicate the lesson content</li>
          <li><strong>Structured Content:</strong> Break content into logical sections</li>
          <li><strong>Order Matters:</strong> Plan your lesson sequence carefully</li>
          <li><strong>Accessibility:</strong> Add transcripts for video content</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: '0',
    top: '0',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    marginBottom: '30px',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '120px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  helpText: {
    display: 'block',
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  formActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
  },
  cancelButton: {
    padding: '12px 24px',
    background: '#f8fafc',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '12px 24px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  loadingButton: {
    opacity: '0.7',
    cursor: 'not-allowed',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  tips: {
    backgroundColor: '#f0f9ff',
    padding: '24px',
    borderRadius: '12px',
    borderLeft: '4px solid #0ea5e9',
  },
  tipsTitle: {
    margin: '0 0 12px 0',
    color: '#0369a1',
    fontSize: '16px',
  },
  tipsList: {
    margin: '0',
    paddingLeft: '20px',
    color: '#475569',
  },
};

// Add hover effects
styles.backButton[':hover'] = { background: '#e2e8f0' };
styles.cancelButton[':hover'] = { background: '#e2e8f0' };
styles.submitButton[':hover'] = { background: '#059669' };

// Add CSS animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);