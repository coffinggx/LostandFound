import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Add your registration logic here
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
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
          </div>

          <div className="row">
            <input type="text" placeholder="Phone Number" required />
            <input type="text" placeholder="Department" required />
          </div>

          <div className="row">
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
          </div>

          <select required defaultValue="">
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