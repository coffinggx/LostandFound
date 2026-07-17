import React from 'react'
import { Link } from 'react-router-dom'
import './Browseitem.css'

const items = [
  {
    id: 1,
    title: "Black Backpack",
    category: "Bag",
    status: "Lost",
    location: "Library",
    date: "10 July 2026",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    title: "Student ID Card",
    category: "ID Card",
    status: "Found",
    location: "Canteen",
    date: "12 July 2026",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85b93e4?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    title: "Calculator",
    category: "Electronics",
    status: "Lost",
    location: "Computer Lab",
    date: "14 July 2026",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=300&h=200&fit=crop",
  },
  {
    id: 4,
    title: "Water Bottle",
    category: "Bottle",
    status: "Found",
    location: "Classroom 205",
    date: "15 July 2026",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=200&fit=crop",
  },
  {
    id: 5,
    title: "Mobile Phone",
    category: "Electronics",
    status: "Lost",
    location: "Playground",
    date: "16 July 2026",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
  },
  {
    id: 6,
    title: "Wallet",
    category: "Wallet",
    status: "Found",
    location: "College Gate",
    date: "17 July 2026",
    image: "https://images.unsplash.com/photo-1622398703906-2c8be4188f1c?w=300&h=200&fit=crop",
  },
];

const Browseitem = () => {
  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1 className="browse-title">🔍 College Lost & Found Items</h1>
        <p className="browse-subtitle">Browse through all reported lost and found items</p>
      </div>

      <div className="filter-bar">
        <select className="filter-select">
          <option>All Categories</option>
          <option>Bag</option>
          <option>ID Card</option>
          <option>Electronics</option>
          <option>Bottle</option>
          <option>Wallet</option>
        </select>
        <select className="filter-select">
          <option>All Status</option>
          <option>Lost</option>
          <option>Found</option>
        </select>
        <input type="text" placeholder="Search items..." className="search-input" />
      </div>

      <div className="item-grid">
        {items.map((item) => (
          <div className="item-card" key={item.id}>
            <div className="item-image-wrapper">
              <img src={item.image} alt={item.title} className="item-image" />
              <span className={`status-badge ${item.status === "Lost" ? "badge-lost" : "badge-found"}`}>
                {item.status}
              </span>
            </div>

            <div className="item-content">
              <h2 className="item-title">{item.title}</h2>
              
              <div className="item-details">
                <p>
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{item.category}</span>
                </p>
                <p>
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{item.location}</span>
                </p>
                <p>
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{item.date}</span>
                </p>
              </div>

              <Link to={`/item/${item.id}`} className="details-link">
                <button className="details-btn">
                  View Details →
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Browseitem