import { useState } from "react";
import { useDispatch } from "react-redux";
import API from "../api/axios";
import { setSignupData } from "../slice/authSilce";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "learner",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data } = await API.post("/auth/signup", formData);
      dispatch(setSignupData(data.user));
      alert("Signup successful ✅");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Your Account</h2>
          <p style={styles.subtitle}>Join our community and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Enter your full name"
              onChange={handleChange}
              value={formData.name}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              value={formData.password}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a</label>
            <select 
              style={styles.select} 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="learner">👨‍🎓 Learner</option>
              <option value="creator">👨‍💻 Creator</option>
              <option value="admin">👨‍💼 Admin</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Bio <span style={styles.optional}>(Optional)</span></label>
            <textarea
              style={styles.textarea}
              name="bio"
              placeholder="Tell us a bit about yourself..."
              onChange={handleChange}
              value={formData.bio}
              rows="3"
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonLoading : {})
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={styles.loading}>
                <div style={styles.spinner}></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{" "}
            <span 
              style={styles.link} 
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "450px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#718096",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "4px",
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    transition: "all 0.2s ease",
    outline: "none",
    backgroundColor: "#fafafa",
  },
  select: {
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    backgroundColor: "#fafafa",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.2s ease",
  },
  textarea: {
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    resize: "vertical",
    minHeight: "80px",
    fontFamily: "inherit",
    backgroundColor: "#fafafa",
    outline: "none",
    transition: "all 0.2s ease",
  },
  button: {
    padding: "14px 20px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "10px",
  },
  buttonLoading: {
    opacity: 0.8,
    cursor: "not-allowed",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid transparent",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  footer: {
    textAlign: "center",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  footerText: {
    fontSize: "14px",
    color: "#718096",
    margin: 0,
  },
  link: {
    color: "#667eea",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
  optional: {
    color: "#a0aec0",
    fontWeight: "normal",
    fontSize: "12px",
  },
};

// Add CSS animation for spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

export default Signup;