import React, { useState } from 'react'
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ClaimItem.css";

const ClaimItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    reason: "",
    proof: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Claim Submitted Successfully!");
    console.log(formData);
    navigate('/claims');
  };

  return (
    <div className="claim-container">
      <div className="claim-card">
        <div className="claim-header">
          <h1>📋 Claim Item</h1>
          <p className="subtitle">
            Fill in the details below to claim this item.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullname"
              placeholder="Enter your full name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Why does this item belong to you?</label>
            <textarea
              rows="5"
              name="reason"
              placeholder="Describe the item and explain why it belongs to you..."
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="input-group">
            <label>Additional Proof</label>
            <input
              type="text"
              name="proof"
              placeholder="Receipt, Serial Number, ID, etc."
              onChange={handleChange}
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              Submit Claim
            </button>
            <Link to={`/item/${id}`}>
              <button type="button" className="cancel-btn">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClaimItem