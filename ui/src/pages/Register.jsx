import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    department: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }
    console.log("Registration form submitted:", formData);
    localStorage.setItem("access_token", "mock-token");
    localStorage.setItem("user_role", formData.role || 'user');
    alert("✅ Registration Successful! (Mock execution)");
    navigate("/dashboard");
  };

  return (
    <div className="register-page">
      {/* Left Section */}
      <div className="left-side">
        <div className="overlay">
          <h2>🎒 College Lost & Found</h2>
          <h1>
            Reuniting <br />
            People with <br />
            Their Belongings
          </h1>
          <p>
            A secure and easy platform to report lost items,
            submit found items and reconnect belongings with
            their owners.
          </p>
          <div className="feature">✔ Secure & Safe</div>
          <div className="feature">✔ Report & Claim Easily</div>
          <div className="feature">✔ Instant Notifications</div>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-side">
        <form className="register-card" onSubmit={handleRegister}>
          <h2>Create an Account</h2>
          <p>Join the College Lost & Found Community</p>

          <div className="row">
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
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

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            defaultValue=""
          >
            <option value="" disabled>Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="register-btn">
            Create Account
          </button>

          <div className="login-link">
            Already have an account? <Link to="/">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;