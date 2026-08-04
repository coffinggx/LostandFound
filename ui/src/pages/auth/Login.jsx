import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from '../../api';
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const tokenData = await authApi.login(formData.username, formData.password);
      localStorage.setItem("access_token", tokenData.access_token);

      const profileData = await authApi.getCurrentUser(tokenData.access_token).catch(() => ({ role: "user" }));
      localStorage.setItem("user_role", profileData.role || "user");

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="logo"></div>
          <h1>Lost & Found</h1>
          <p className="subtitle">Sign in with your username and password.</p>

          <form onSubmit={handleLogin}>
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="signup">
            New here? <Link to="/register">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;