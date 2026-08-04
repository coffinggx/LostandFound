import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { itemsApi } from '../../api';
import './Browseitem.css';

const Browseitem = () => {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('search')?.trim() || '');
  }, [location.search]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await itemsApi.getAllPosts();
        const fetchedItems = data || [];
        setAllItems(fetchedItems);
      } catch (err) {
        setError(err.message || 'Unable to load posts.');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  useEffect(() => {
    const trimmedQuery = searchQuery.toLowerCase();
    const filteredItems = allItems.filter((item) => {
      const searchableText = `${item.title || ''} ${item.location || ''} ${item.item_type || ''} ${item.status || ''}`.toLowerCase();
      return searchableText.includes(trimmedQuery);
    });

    setItems(filteredItems);
  }, [allItems, searchQuery]);

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1 className="browse-title">Lost & Found Items</h1>
        <p className="browse-subtitle">Browse through reported lost and found items</p>
      </div>

      {loading && <p>Loading items...</p>}
      {error && <p className="auth-error">{error}</p>}

      {!loading && !error && searchQuery && (
        <p className="browse-subtitle">Showing results for “{searchQuery}”</p>
      )}

      <div className="item-grid">
        {items.length > 0 ? (
          items.map((item) => (
            <div className="item-card" key={item.item_id}>
              <div className="item-image-wrapper">
                <img src={item.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} alt={item.title} className="item-image" />
                <span className={`status-badge ${item.item_type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                  {item.item_type}
                </span>
              </div>

              <div className="item-content">
                <h2 className="item-title">{item.title}</h2>
                <div className="item-details">
                  <p>
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{item.location}</span>
                  </p>
                  <p>
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">{item.status}</span>
                  </p>
                  <p>
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(item.date_lost_found).toLocaleDateString()}</span>
                  </p>
                </div>

                <Link to={`/item/${item.item_id}`} className="details-link">
                  <button className="details-btn">
                    View Details →
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          !loading && !error && <p className="auth-error">No items matched your search.</p>
        )}
      </div>
    </div>
  );
};

export default Browseitem;