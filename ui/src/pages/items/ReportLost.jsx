import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import './ReportLost.css';

const ReportLost = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    category_name: '',
    description: '',
    location: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('category_name', formData.category_name);
      formPayload.append('location', formData.location);
      formPayload.append('item_type', 'lost');
      formPayload.append('item_status', 'open');

      if (imageFile) {
        formPayload.append('image', imageFile);
      }

      await itemsApi.createPost(formPayload);
      showToast('Lost item reported successfully!');
      navigate('/posts');
    } catch (err) {
      setError(err.message || 'Unable to report lost item right now.');
      showToast(err.message || 'Unable to report lost item right now.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <h1>📢 Report Lost Item</h1>
        <p className="subtitle">Fill in the details below to report your lost item</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Black Backpack"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category_name"
              value={formData.category_name}
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

          <div className="form-group">
            <label>Upload Item Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Reporting...' : '✅ Report Lost'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/posts')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportLost;