import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { itemsApi } from '../api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await itemsApi.getAllPosts();
        setPosts(data || []);
      } catch (err) {
        setError(err.message || 'Unable to load posts right now.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return <div className="browse-container"><p>Loading feed...</p></div>;
  }

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1 className="browse-title">Home Feed</h1>
        <p className="browse-subtitle">Explore the latest lost and found posts</p>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div className="item-grid">
        {posts.map((post) => (
          <div className="item-card" key={post.item_id}>
            <div className="item-image-wrapper">
              <img src={post.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} alt={post.title} className="item-image" />
              <span className={`status-badge ${post.item_type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                {post.item_type}
              </span>
            </div>

            <div className="item-content">
              <h2 className="item-title">{post.title}</h2>
              <div className="item-details">
                <p><span className="detail-label">Location:</span> <span className="detail-value">{post.location}</span></p>
                <p><span className="detail-label">Status:</span> <span className="detail-value">{post.status}</span></p>
                <p><span className="detail-label">Date:</span> <span className="detail-value">{new Date(post.date_lost_found).toLocaleDateString()}</span></p>
              </div>

              <Link to={`/item/${post.item_id}`} className="details-link">
                <button className="details-btn">View Details →</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
