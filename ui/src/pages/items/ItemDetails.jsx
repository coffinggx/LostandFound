import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { itemsApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './ItemDetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItem = async () => {
      try {
        const [itemData, claimData] = await Promise.all([
          itemsApi.getPostById(Number(id)),
          itemsApi.getClaimsForItem(Number(id)).catch(() => []),
        ]);

        setItem(itemData);
        setClaims(claimData || []);
      } catch (err) {
        setError(err.message || 'Unable to load item details.');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleMarkReturned = async () => {
    try {
      await itemsApi.markReturned(Number(id));
      showToast('Item marked as returned.');
      setItem((prev) => ({ ...prev, status: 'returned' }));
    } catch (err) {
      showToast(err.message || 'Unable to mark this item as returned.', 'error');
    }
  };

  if (loading) {
    return <div className="not-found"><p>Loading item details...</p></div>;
  }

  if (error || !item) {
    return (
      <div className="not-found">
        <h2>Item Not Found</h2>
        <p>The item you're looking for doesn't exist.</p>
        <Link to="/browse">
          <button className="back-btn">Back to Browse</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-card">
        <div className="details-image">
          <img src={item.image_url || 'https://via.placeholder.com/500x350?text=No+Image'} alt={item.title} />
          <span className={`status-badge ${item.item_type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
            {item.item_type}
          </span>
        </div>

        <div className="details-content">
          <h1 className="details-title">{item.title}</h1>

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Category</span>
              <p className="info-value">{item.category_name || 'General'}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Location</span>
              <p className="info-value">{item.location}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Date</span>
              <p className="info-value">{new Date(item.date_lost_found).toLocaleDateString()}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <p className="info-value">{item.status}</p>
            </div>
          </div>

          <div className="description-box">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="button-group">
            {user?.id === item.posted_by && item.status !== 'returned' && (
              <button className="claim-btn" onClick={handleMarkReturned}>Mark as Returned</button>
            )}
            <Link to={`/claim/${item.item_id}`}>
              <button className="claim-btn">Claim Item</button>
            </Link>
            <Link to="/browse">
              <button className="back-btn">Back</button>
            </Link>
          </div>

          <div className="description-box">
            <h3>Claims for this item</h3>
            {claims.length === 0 ? (
              <p>No claims yet.</p>
            ) : (
              <ul className="claims-list">
                {claims.map((claim) => (
                  <li key={claim.claim_id}>{claim.claim_message}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;