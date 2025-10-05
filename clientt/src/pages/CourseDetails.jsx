import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useSelector } from 'react-redux';

export default function CourseDetails() {
    const { user } = useSelector((state) => state.auth);
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdminPreview, setIsAdminPreview] = useState(false);

    useEffect(() => {
        // Check if this is an admin preview based on the URL
        const isPreview = window.location.pathname.includes('/admin-preview/');
        console.log('CourseDetails mounted:', { isPreview, pathname: window.location.pathname, courseId });
        setIsAdminPreview(isPreview);
        fetchCourseDetails(isPreview);
    }, [courseId]);

    const fetchCourseDetails = async (isPreview = false) => {
        try {
            console.log('Fetching course details:', { isPreview, courseId, endpoint });
            setLoading(true);
            setError(null);

            // Use different endpoints based on whether it's admin preview or regular course details
            const endpoint = isPreview 
                ? `/course/admin-preview/${courseId}`
                : `/course/my-courses/${courseId}`;

            console.log('Making API call to:', endpoint);
            const response = await API.get(endpoint);
            console.log("Course details response:", response.data);

            if (response.data.success) {
                setCourse(response.data.course);
            } else {
                throw new Error(response.data.message || 'Failed to fetch course details');
            }
        } catch (err) {
            console.error('Error fetching course details:', err);
            setError(err.response?.data?.message || 'Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddLesson = () => {
        navigate(`/course/${courseId}/add-lesson`);
    };

    const handleEditLesson = (lessonId) => {
        navigate(`/course/${courseId}/edit-lesson/${lessonId}`);
    };

    const handleDeleteLesson = async (lessonId, lessonTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${lessonTitle}"?`)) return;

        try {
            const response = await API.delete(`/course/${courseId}/lessons/${lessonId}`);

            if (response.data.success) {
                alert('Lesson deleted successfully!');
                fetchCourseDetails(); // Refresh course data
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            console.error('Error deleting lesson:', err);
            alert(err.response?.data?.message || 'Failed to delete lesson');
        }
    };

    const handleEditCourse = () => {
        navigate(`/course/${courseId}/edit`);
    };

    const handlePublishCourse = async () => {
        if (!window.confirm('Are you sure you want to publish this course? It will be visible to students.')) return;

        try {
            const response = await API.patch(`/course/${courseId}`, {
                status: 'published',
                publishedAt: new Date()
            });

            if (response.data.success) {
                alert('Course published successfully!');
                fetchCourseDetails(); // Refresh course data
            }
        } catch (err) {
            console.error('Error publishing course:', err);
            alert(err.response?.data?.message || 'Failed to publish course');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { color: '#fef3c7', textColor: '#92400e', label: 'Draft' },
            published: { color: '#d1fae5', textColor: '#065f46', label: 'Published' }
        };

        const config = statusConfig[status] || statusConfig.draft;
        return (
            <span style={{
                backgroundColor: config.color,
                color: config.textColor,
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase'
            }}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                Loading course details...
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorIcon}>⚠️</div>
                <h3>Error Loading Course</h3>
                <p>{error}</p>
                <button 
                    onClick={() => isAdminPreview ? navigate('/manage-courses') : navigate('/my-courses')}
                    style={styles.backButton}
                >
                    ← Back to {isAdminPreview ? 'Draft Courses' : 'My Courses'}
                </button>
            </div>
        );
    }

    if (!course) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorIcon}>📚</div>
                <h3>Course Not Found</h3>
                <p>The course you're looking for doesn't exist or you don't have access to it.</p>
                <button 
                    onClick={() => isAdminPreview ? navigate('/manage-courses') : navigate('/my-courses')}
                    style={styles.backButton}
                >
                    ← Back to {isAdminPreview ? 'Draft Courses' : 'My Courses'}
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={styles.header}>
                <button 
                    onClick={() => isAdminPreview ? navigate('/manage-courses') : navigate('/my-courses')}
                    style={styles.backButton}
                >
                    ← Back to {isAdminPreview ? 'Draft Courses' : 'My Courses'}
                </button>

                <div style={styles.courseHeader}>
                    <div style={styles.courseImageContainer}>
                        <img 
                            src={course.image || "https://via.placeholder.com/400x250/667eea/ffffff?text=No+Image"} 
                            alt={course.title}
                            style={styles.courseImage}
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/400x250/667eea/ffffff?text=No+Image";
                            }}
                        />
                    </div>

                    <div style={styles.courseInfo}>
                        <div style={styles.courseTitleSection}>
                            <h1 style={styles.courseTitle}>{course.title}</h1>
                            <div style={styles.statusSection}>
                                {getStatusBadge(course.status)}
                                {course.status === 'draft' && user.role === 'admin' && !isAdminPreview && (
                                    <button 
                                        onClick={handlePublishCourse}
                                        style={styles.publishButton}
                                    >
                                        🚀 Publish Course
                                    </button>
                                )}
                                {isAdminPreview && user.role === 'admin' && (
                                    <span style={{
                                        backgroundColor: '#dbeafe',
                                        color: '#1e40af',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        ADMIN PREVIEW
                                    </span>
                                )}
                            </div>
                        </div>

                        <p style={styles.courseDescription}>{course.description}</p>

                        <div style={styles.courseMeta}>
                            <div style={styles.metaItem}>
                                <span style={styles.metaLabel}>Total Lessons:</span>
                                <span style={styles.metaValue}>{course.lessons.length}</span>
                            </div>
                            <div style={styles.metaItem}>
                                <span style={styles.metaLabel}>Created:</span>
                                <span style={styles.metaValue}>{formatDate(course.createdAt)}</span>
                            </div>
                            <div style={styles.metaItem}>
                                <span style={styles.metaLabel}>Last Updated:</span>
                                <span style={styles.metaValue}>{formatDate(course.updatedAt)}</span>
                            </div>
                            {course.publishedAt && (
                                <div style={styles.metaItem}>
                                    <span style={styles.metaLabel}>Published:</span>
                                    <span style={styles.metaValue}>{formatDate(course.publishedAt)}</span>
                                </div>
                            )}
                        </div>

                        {/* Only show action buttons for creators, not for admin preview */}
                        {!isAdminPreview && (
                            <div style={styles.courseActions}>
                                <button 
                                    onClick={handleAddLesson}
                                    style={styles.primaryButton}
                                >
                                    ➕ Add New Lesson
                                </button>
                                <button 
                                    onClick={handleEditCourse}
                                    style={styles.secondaryButton}
                                >
                                    ✏️ Edit Course Info
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lessons Section */}
            <div style={styles.lessonsSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>
                        Course Lessons ({course.lessons.length})
                    </h2>
                    {!isAdminPreview && (
                        <button 
                            onClick={handleAddLesson}
                            style={styles.addLessonButton}
                        >
                            ➕ Add Lesson
                        </button>
                    )}
                </div>

                {course.lessons.length === 0 ? (
                    <div style={styles.emptyLessons}>
                        <div style={styles.emptyIcon}>📘</div>
                        <h3>No Lessons Yet</h3>
                        <p>This course doesn't have any lessons yet.</p>
                        {!isAdminPreview && (
                            <button 
                                onClick={handleAddLesson}
                                style={styles.addFirstLessonButton}
                            >
                                ➕ Add Your First Lesson
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={styles.lessonsList}>
                        {course.lessons
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map((lesson) => (
                                <div key={lesson._id} style={styles.lessonCard}>
                                    <div style={styles.lessonHeader}>
                                        <h3 style={styles.lessonTitle}>
                                            {lesson.orderIndex}. {lesson.title}
                                        </h3>
                                        {!isAdminPreview && (
                                            <div style={styles.lessonActions}>
                                                <button 
                                                    onClick={() => handleEditLesson(lesson._id)}
                                                    style={styles.editLessonButton}
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteLesson(lesson._id, lesson.title)}
                                                    style={styles.deleteLessonButton}
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div style={styles.lessonContent}>
                                        {lesson.content && (
                                            <div 
                                                dangerouslySetInnerHTML={{ 
                                                    __html: lesson.content.length > 200 
                                                        ? lesson.content.substring(0, 200) + '...' 
                                                        : lesson.content 
                                                }}
                                                style={styles.lessonPreview}
                                            />
                                        )}
                                        {!lesson.content && (
                                            <p style={styles.noContent}>No content available for this lesson.</p>
                                        )}
                                    </div>
                                    <div style={styles.lessonMeta}>
                                        <span style={styles.lessonDate}>
                                            Created: {formatDate(lesson.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '20px',
    },
    loading: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6b7280',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
    },
    spinner: {
        width: '32px',
        height: '32px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    errorContainer: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6b7280',
    },
    errorIcon: {
        fontSize: '48px',
        marginBottom: '16px',
    },
    backButton: {
        background: 'none',
        border: 'none',
        color: '#667eea',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '20px',
        padding: '8px 0',
    },
    header: {
        marginBottom: '40px',
    },
    courseHeader: {
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: '30px',
        alignItems: 'start',
    },
    courseImageContainer: {
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    },
    courseImage: {
        width: '100%',
        height: '250px',
        objectFit: 'cover',
    },
    courseInfo: {
        padding: '10px 0',
    },
    courseTitleSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
    },
    courseTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0',
        lineHeight: '1.3',
        flex: 1,
    },
    statusSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    publishButton: {
        padding: '8px 16px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    courseDescription: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#64748b',
        margin: '0 0 24px 0',
    },
    courseMeta: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
    },
    metaItem: {
        display: 'flex',
        flexDirection: 'column',
    },
    metaLabel: {
        fontSize: '12px',
        color: '#64748b',
        fontWeight: '600',
        marginBottom: '4px',
    },
    metaValue: {
        fontSize: '14px',
        color: '#1e293b',
        fontWeight: '600',
    },
    courseActions: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
    },
    primaryButton: {
        padding: '12px 20px',
        backgroundColor: '#8b5cf6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    secondaryButton: {
        padding: '12px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    tertiaryButton: {
        padding: '12px 20px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    lessonsSection: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#1e293b',
        margin: '0',
    },
    addLessonButton: {
        padding: '10px 16px',
        backgroundColor: '#8b5cf6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    emptyLessons: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6b7280',
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '16px',
    },
    lessonsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    lessonCard: {
        display: 'flex',
        gap: '16px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        transition: 'all 0.2s',
    },
    lessonNumber: {
        width: '40px',
        height: '40px',
        backgroundColor: '#667eea',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '14px',
        flexShrink: 0,
    },
    lessonContent: {
        flex: 1,
    },
    lessonHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
    },
    lessonTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1e293b',
        margin: '0',
        flex: 1,
    },
    lessonActions: {
        display: 'flex',
        gap: '8px',
    },
    smallButton: {
        padding: '6px 12px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
    },
    smallDeleteButton: {
        padding: '6px 12px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
    },
    lessonDescription: {
        fontSize: '14px',
        color: '#64748b',
        lineHeight: '1.5',
        margin: '0 0 12px 0',
    },
    transcriptSection: {
        backgroundColor: '#f8fafc',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '12px',
    },
    transcriptText: {
        fontSize: '13px',
        color: '#475569',
        margin: '8px 0 0 0',
        lineHeight: '1.4',
    },
    lessonMeta: {
        display: 'flex',
        gap: '16px',
        fontSize: '12px',
        color: '#6b7280',
    },
    lessonOrder: {
        fontWeight: '600',
    },
    lessonDate: {
        fontStyle: 'italic',
    },
};

// Add hover effects
styles.lessonCard[':hover'] = {
    borderColor: '#667eea',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
    transform: 'translateY(-1px)',
};

styles.primaryButton[':hover'] = { backgroundColor: '#7c3aed' };
styles.secondaryButton[':hover'] = { backgroundColor: '#2563eb' };
styles.tertiaryButton[':hover'] = { backgroundColor: '#059669' };
styles.publishButton[':hover'] = { backgroundColor: '#059669' };
styles.addLessonButton[':hover'] = { backgroundColor: '#7c3aed' };
styles.smallButton[':hover'] = { backgroundColor: '#2563eb' };
styles.smallDeleteButton[':hover'] = { backgroundColor: '#dc2626' };

// Add CSS animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);