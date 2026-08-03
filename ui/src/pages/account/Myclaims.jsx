import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { claimsApi, userApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import './Myclaims.css';

const Myclaims = () => {
  const { showToast } = useToast();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingClaimId, setEditingClaimId] = useState(null);
  const [editMessage, setEditMessage] = useState('');

  const loadClaims = async () => {
    try {
      const data = await userApi.getMyClaims();
      setClaims(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load claims.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleDeleteClaim = async (claimId) => {
    try {
      await claimsApi.deleteClaim(claimId);
      showToast('Claim deleted.');
      await loadClaims();
    } catch (err) {
      showToast(err.message || 'Unable to delete claim.', 'error');
    }
  };

  const handleEditStart = (claim) => {
    setEditingClaimId(claim.claim_id);
    setEditMessage(claim.claim_message);
  };

  const handleSaveClaim = async (claimId) => {
    try {
      await claimsApi.editClaim(claimId, { claim_message: editMessage, claimed_by: 0, item_id: 0 });
      setEditingClaimId(null);
      setEditMessage('');
      showToast('Claim updated.');
      await loadClaims();
    } catch (err) {
      showToast(err.message || 'Unable to update claim.', 'error');
    }
  };

  return (
    <div className="claims-container">
      <div className="claims-header">
        <h1>My Claims</h1>
        <p>Track the status of your claimed items</p>
      </div>

      {loading && <p>Loading claims...</p>}
      {error && <p className="auth-error">{error}</p>}

      <div className="claims-stats">
        <div className="stat-card">
          <span className="stat-number">{claims.length}</span>
          <span className="stat-label">Total Claims</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{claims.filter((c) => c.claim_status === 'pending').length}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{claims.filter((c) => c.claim_status === 'approved').length}</span>
          <span className="stat-label">Approved</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{claims.filter((c) => c.claim_status === 'rejected').length}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="claims-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Claim Message</th>
              <th>Claim Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim, index) => (
              <tr key={claim.claim_id}>
                <td>{index + 1}</td>
                <td><strong>{claim.claim_message}</strong></td>
                <td>{new Date(claim.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${claim.claim_status.toLowerCase()}`}>
                    {claim.claim_status}
                  </span>
                </td>
                <td>
                  {editingClaimId === claim.claim_id ? (
                    <div className="claim-edit-cell">
                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        rows="3"
                      />
                      <div className="claim-actions-inline">
                        <button className="save-btn" onClick={() => handleSaveClaim(claim.claim_id)}>Save</button>
                        <button className="cancel-btn" onClick={() => setEditingClaimId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="claim-actions-inline">
                      <Link to={`/item/${claim.item_id}`}>
                        <button className="view-btn">View</button>
                      </Link>
                      <button className="edit-btn" onClick={() => handleEditStart(claim)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteClaim(claim.claim_id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Myclaims;