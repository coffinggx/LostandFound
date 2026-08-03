import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    department: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.register({
        username: formData.username,
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        password: formData.password,
      });

      showToast("Account created successfully. Please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create account right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="left-side">
        <div className="overlay">
          <h2>Lost & Found</h2>
          <h1>Create your account</h1>
          <p>
            Join the campus reporting workflow to post items, claim belongings,
            and manage lost and found updates.
          </p>
        </div>
      </div>

      <div className="right-side">
        <form className="register-card" onSubmit={handleRegister}>
          <h2>Create an Account</h2>
          <p>Register with your campus details.</p>

          <div className="row">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="register-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;