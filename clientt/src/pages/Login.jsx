import { useState } from "react";
import { useDispatch } from "react-redux";
import API from "../api/axios";
import { setToken, setUser } from "../slice/authSilce";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data } = await API.post("/auth/login", formData);
      
      dispatch(setUser(data.user));
      dispatch(setToken(data.token));
      console.log("user",data.token);
      
      localStorage.setItem("token",data.token);
      navigate("/dashboard"); // Redirect to dashboard or home page
    } catch (error) {
      alert(error.response?.data?.message || "Login failed ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
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
            <div style={styles.passwordHeader}>
              <label style={styles.label}>Password</label>
              <span style={styles.forgotLink}>Forgot password?</span>
            </div>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
              required
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
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>

          <button 
            type="button" 
            style={styles.googleButton}
            onClick={() => alert("Google login coming soon!")}
          >
            <svg style={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{" "}
            <span 
              style={styles.link} 
              onClick={() => navigate("/signup")}
            >
              Sign up
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
  passwordHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2d3748",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#667eea",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
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
  divider: {
    position: "relative",
    textAlign: "center",
    margin: "20px 0",
  },
  dividerText: {
    backgroundColor: "white",
    padding: "0 15px",
    color: "#718096",
    fontSize: "12px",
    fontWeight: "500",
  },
  googleButton: {
    padding: "12px 20px",
    backgroundColor: "white",
    color: "#374151",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  googleIcon: {
    marginRight: "8px",
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
};

// Add CSS animation for spinner (only if not already added)
if (!document.querySelector('style[data-spinner]')) {
  const spinnerStyle = document.createElement('style');
  spinnerStyle.setAttribute('data-spinner', 'true');
  spinnerStyle.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(spinnerStyle);
}

export default Login;