import React from 'react'
import { useParams, Link } from 'react-router-dom'
import './ItemDetails.css'

const items = [
  {
    id: 1,
    title: "Black Backpack",
    category: "Bag",
    status: "Lost",
    location: "Library",
    date: "10 July 2026",
    owner: "Rahul Sharma",
    description: "Black Nike backpack containing notebooks, charger and stationery.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=350&fit=crop",
  },
  {
    id: 2,
    title: "Student ID Card",
    category: "ID Card",
    status: "Found",
    location: "Canteen",
    date: "12 July 2026",
    owner: "Unknown",
    description: "Student ID card found near the canteen entrance.",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85b93e4?w=500&h=350&fit=crop",
  },
  {
    id: 3,
    title: "Calculator",
    category: "Electronics",
    status: "Lost",
    location: "Computer Lab",
    date: "14 July 2026",
    owner: "Bibas",
    description: "Casio FX-991ES Plus scientific calculator.",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&h=350&fit=crop",
  },
];

const ItemDetails = () => {
  const { id } = useParams();
  const item = items.find((item) => item.id === Number(id));

  if (!item) {
    return (
      <div className='not-found'>
        <h2>🔍 Item Not Found</h2>
        <p>The item you're looking for doesn't exist.</p>
        <Link to="/browse">
          <button className="back-btn">Back to Browse</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="details-container">
      <div className="details-card">
        <div className="details-image">
          <img src={item.image} alt={item.title} />
          <span className={`status-badge ${item.status === "Lost" ? "badge-lost" : "badge-found"}`}>
            {item.status}
          </span>
        </div>

        <div className="details-content">
          <h1 className="details-title">{item.title}</h1>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">📂 Category</span>
              <p className="info-value">{item.category}</p>
            </div>
            <div className="info-item">
              <span className="info-label">📍 Location</span>
              <p className="info-value">{item.location}</p>
            </div>
            <div className="info-item">
              <span className="info-label">📅 Date</span>
              <p className="info-value">{item.date}</p>
            </div>
            <div className="info-item">
              <span className="info-label">👤 Owner</span>
              <p className="info-value">{item.owner}</p>
            </div>
          </div>

          <div className="description-box">
            <h3>📝 Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="button-group">
            <Link to={`/claim/${item.id}`}>
              <button className="claim-btn">📋 Claim Item</button>
            </Link>
            <Link to="/browse">
              <button className="back-btn">← Back</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetails