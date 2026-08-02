import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReportFound.css';

const ReportFound = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category_name: '',
    description: '',
    location: '',
    date_lost_found: '',
    contactEmail: '',
    contactPhone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiPayload = {
      title: formData.title,
      category_name: formData.category_name,
      description: formData.description,
      location: formData.location,
      date_lost_found: formData.date_lost_found,
      item_type: 'found',
      item_status: 'open',
    };

    console.log('Create found item payload:', apiPayload);
    alert('✅ Found item reported successfully! (Frontend mock)');
    navigate('/dashboard');
  };

  return (
    <div className="report-container">
      <div className="report-card found-card">
        <h1>📦 Report Found Item</h1>
        <p className="subtitle">Help someone find their lost item</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              name="itemName"
              placeholder="e.g., Black Backpack"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Bag">Bag</option>
              <option value="Electronics">Electronics</option>
              <option value="ID Card">ID Card</option>
              <option value="Wallet">Wallet</option>
              <option value="Bottle">Bottle</option>
              <option value="Book">Book</option>
              <option value="Keys">Keys</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              placeholder="Describe the item in detail..."
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Library"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date Found *</label>
              <input
                type="date"
                name="dateFound"
                value={formData.dateFound}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Email *</label>
              <input
                type="email"
                name="contactEmail"
                placeholder="your.email@college.edu"
                value={formData.contactEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                placeholder="+977 98XXXXXXXX"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn found-btn">
              ✅ Report Found
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFound;