import React from "react";
import "./MyPosts.css";

const posts = [
  {
    id: 1,
    title: "Black Backpack",
    category: "Bag",
    status: "Lost",
    location: "Library",
    date: "10 July 2026",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=250&h=180&fit=crop",
  },
  {
    id: 2,
    title: "Calculator",
    category: "Electronics",
    status: "Found",
    location: "Computer Lab",
    date: "14 July 2026",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=250&h=180&fit=crop",
  },
];

const MyPosts = () => {
  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1>📝 My Posted Items</h1>
        <p>Manage your reported lost and found items</p>
        <button className="add-post-btn">➕ Add New Post</button>
      </div>

      <div className="posts-grid">
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="post-image-wrapper">
              <img src={post.image} alt={post.title} />
              <span className={`status-badge ${post.status === "Lost" ? "badge-lost" : "badge-found"}`}>
                {post.status}
              </span>
            </div>
            
            <div className="post-content">
              <h2 className="post-title">{post.title}</h2>
              <div className="post-details">
                <p><span className="label">Category:</span> {post.category}</p>
                <p><span className="label">Location:</span> {post.location}</p>
                <p><span className="label">Date:</span> {post.date}</p>
              </div>
              <div className="btn-group">
                <button className="edit-btn">✏️ Edit</button>
                <button className="delete-btn">🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;