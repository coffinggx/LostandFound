import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState('user');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login form submitted:", { email, password, role });
    localStorage.setItem("access_token", "mock-token");
    localStorage.setItem("user_role", role);
    alert("✅ Login Successful! (Mock execution)");
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
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="role-label">Login as</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
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