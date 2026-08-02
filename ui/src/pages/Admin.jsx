import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './Admin.css';

const initialClaims = [
  {
    claim_id: 1,
    item_id: 1,
    claimed_by: 2,
    claim_message: 'I lost this backpack yesterday in the library. It has a red keychain.',
    claim_status: 'pending',
  },
  {
    claim_id: 2,
    item_id: 3,
    claimed_by: 4,
    claim_message: 'This calculator is mine. It has the initials S.K. on the back.',
    claim_status: 'approved',
  },
  {
    claim_id: 3,
    item_id: 5,
    claimed_by: 3,
    claim_message: 'Found this phone near the canteen. The wallpaper shows my pet dog.',
    claim_status: 'rejected',
  },
];

const Admin = () => {
  const role = localStorage.getItem('user_role');
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const [claims, setClaims] = useState(initialClaims);

  const updateClaimStatus = (claim_id, status) => {
    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.claim_id === claim_id ? { ...claim, claim_status: status } : claim
      )
    );
    alert(`Claim ${claim_id} is now ${status.toUpperCase()}. (Frontend mock)`);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>🛠️ Admin Panel</h1>
          <p>Review and update claim status. This UI is built to match backend admin behavior.</p>
        </div>
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>

      <div className="admin-card">
        <h2>Claim Requests</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item ID</th>
              <th>Claimed By</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.claim_id}>
                <td>{claim.claim_id}</td>
                <td>{claim.item_id}</td>
                <td>{claim.claimed_by}</td>
                <td>{claim.claim_message}</td>
                <td>
                  <span className={`status ${claim.claim_status}`}>{claim.claim_status}</span>
                </td>
                <td className="action-buttons">
                  <button
                    className="approve-btn"
                    disabled={claim.claim_status === 'approved'}
                    onClick={() => updateClaimStatus(claim.claim_id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    disabled={claim.claim_status === 'rejected'}
                    onClick={() => updateClaimStatus(claim.claim_id, 'rejected')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
