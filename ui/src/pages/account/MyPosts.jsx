import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsApi, userApi } from '../../api';
import './MyPosts.css';

const MyPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    try {
      const data = await userApi.getMyPosts();
      setPosts(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load your posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await itemsApi.deletePost(postId);
      await loadPosts();
    } catch (err) {
      setError(err.message || 'Unable to delete post.');
    }
  };

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1>My Posted Items</h1>
        <p>Manage your reported lost and found items</p>
        <button className="add-post-btn" onClick={() => navigate('/create-post')}>Add New Post</button>
      </div>

      {loading && <p>Loading posts...</p>}
      {error && <p className="auth-error">{error}</p>}

      <div className="posts-grid">
        {posts.map((post) => (
          <div className="post-card" key={post.item_id}>
            <div className="post-image-wrapper">
              <img src={post.image_url || 'https://via.placeholder.com/250x180?text=No+Image'} alt={post.title} />
              <span className={`status-badge ${post.item_type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                {post.item_type}
              </span>
            </div>

            <div className="post-content">
              <h2 className="post-title">{post.title}</h2>
              <div className="post-details">
                <p><span className="label">Location:</span> {post.location}</p>
                <p><span className="label">Status:</span> {post.status}</p>
                <p><span className="label">Date:</span> {new Date(post.date_lost_found).toLocaleDateString()}</p>
              </div>
              <div className="btn-group">
                <button className="edit-btn" onClick={() => navigate('/create-post', { state: { editPost: post } })}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(post.item_id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;