import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authApi, claimsApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import './ClaimItem.css';

const ClaimItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    claim_message: '',
    proof: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const profile = await authApi.getCurrentUser(token);
        setCurrentUser(profile);
      } catch (err) {
        setError(err.message || 'Unable to load profile.');
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError('You must be logged in to claim an item.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await claimsApi.createClaim({
        item_id: Number(id),
        claimed_by: currentUser.id,
        claim_message: `${formData.claim_message}${formData.proof ? ` | Proof: ${formData.proof}` : ''}`,
      });

      showToast('Claim submitted successfully.');
      navigate('/claims');
    } catch (err) {
      setError(err.message || 'Unable to submit claim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="claim-container">
      <div className="claim-card">
        <div className="claim-header">
          <h1>Claim Item</h1>
          <p className="subtitle">Fill in the details below to claim this item.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Why does this item belong to you?</label>
            <textarea
              rows="5"
              name="claim_message"
              placeholder="Describe the item and explain why it belongs to you..."
              value={formData.claim_message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="input-group">
            <label>Additional Proof</label>
            <input
              type="text"
              name="proof"
              placeholder="Receipt, serial number, ID, etc."
              value={formData.proof}
              onChange={handleChange}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="button-group">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Claim'}
            </button>
            <Link to={`/item/${id}`}>
              <button type="button" className="cancel-btn">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimItem;