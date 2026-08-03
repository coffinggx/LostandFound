import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { itemsApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editPost = location.state?.editPost;
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_name: 'Bag',
    location: '',
    date_lost_found: '',
    item_type: 'lost',
    item_status: 'open',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!editPost) {
      return;
    }

    setFormData({
      title: editPost.title || '',
      description: editPost.description || '',
      category_name: editPost.category_name || 'Bag',
      location: editPost.location || '',
      date_lost_found: editPost.date_lost_found || '',
      item_type: editPost.item_type || 'lost',
      item_status: editPost.status || 'open',
    });
    setImagePreview(editPost.image_url || '');
  }, [editPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      formPayload.append('item_type', formData.item_type);
      formPayload.append('item_status', formData.item_status);

      if (imageFile) {
        formPayload.append('image', imageFile);
      }

      if (editPost?.item_id) {
        await itemsApi.updatePost(editPost.item_id, formPayload);
        showToast(`Post titled "${formData.title}" was updated.`);
      } else {
        await itemsApi.createPost(formPayload);
        showToast(`Post titled "${formData.title}" was created.`);
      }

      navigate('/posts');
    } catch (err) {
      setError(err.message || 'Unable to create post right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="createpost-container">
      <div className="createpost-card">
        <div className="createpost-header">
          <h1>{editPost ? 'Edit Announcement' : 'Create New Announcement'}</h1>
          <p className="subtitle">Report a lost or found item to the college community</p>
        </div>

        <form onSubmit={handleSubmit} className="createpost-form">
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="item_type">Reporting Type *</label>
              <select
                id="item_type"
                name="item_type"
                value={formData.item_type}
                onChange={handleChange}
                required
              >
                <option value="lost">Lost Item</option>
                <option value="found">Found Item</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="item_status">Status *</label>
              <select
                id="item_status"
                name="item_status"
                value={formData.item_status}
                onChange={handleChange}
                required
              >
                <option value="open">Open</option>
                <option value="claimed">Claimed</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Item Name / Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Blue Nike Backpack, iPhone 13"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="category_name">Category *</label>
              <select
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                required
              >
                <option value="Bag">Bag</option>
                <option value="ID Card">ID Card</option>
                <option value="Electronics">Electronics</option>
                <option value="Bottle">Bottle</option>
                <option value="Wallet">Wallet</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g. Chemistry Lab, Canteen table"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Provide color, brand, distinct features, and instructions on how to collect it..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Item Image</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="image" className="file-label">
                Choose Image File
              </label>
              {imageFile && <span className="file-name">{imageFile.name}</span>}
            </div>
            {imagePreview && (
              <div className="image-preview-wrapper">
                <img src={imagePreview} alt="Preview" className="image-preview" />
              </div>
            )}
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (editPost ? 'Updating...' : 'Publishing...') : (editPost ? 'Update Announcement' : 'Publish Announcement')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
