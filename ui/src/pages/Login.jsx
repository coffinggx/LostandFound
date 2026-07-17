import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt, FaUser } from "react-icons/fa";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="logo">🎒</div>
          <h1>College Lost & Found</h1>
          <p className="subtitle">Welcome Back! Login to your account</p>

          <form onSubmit={handleLogin}>
            <div className="input-box">
              <FaEnvelope className="icon" />
              <input type="email" placeholder="Email Address" required />
            </div>

            <div className="input-box">
              <FaLock className="icon" />
              <input type="password" placeholder="Password" required />
            </div>

            <div className="forgot-password">
              <Link to="#">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-btn">
              <FaSignInAlt /> Login
            </button>
          </form>

          <div className="signup">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;