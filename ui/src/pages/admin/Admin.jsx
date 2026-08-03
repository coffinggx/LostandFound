import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { adminApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [pendingClaims, setPendingClaims] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setLoading(false);
      return;
    }

    const loadAdminData = async () => {
      try {
        const [statsResult, claimsResult, postsResult] = await Promise.allSettled([
          adminApi.getAdminStats(),
          adminApi.getPendingClaims(),
          adminApi.getPendingItems(),
        ]);

        if (statsResult.status === 'fulfilled') {
          setStats(statsResult.value);
        }

        if (claimsResult.status === 'fulfilled') {
          setPendingClaims(Array.isArray(claimsResult.value) ? claimsResult.value : []);
        } else {
          setError(claimsResult.reason?.message || 'Unable to load pending claims.');
        }

        if (postsResult.status === 'fulfilled') {
          setPendingPosts(Array.isArray(postsResult.value) ? postsResult.value : []);
        }
      } catch (err) {
        setError(err.message || 'Unable to load admin data.');
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleApproveClaim = async (claimId) => {
    try {
      await adminApi.approveClaim(claimId);
      setPendingClaims((prevClaims) => prevClaims.filter((claim) => claim.claim_id !== claimId));
      showToast(`Claim ${claimId} approved.`);
    } catch (err) {
      showToast(err.message || 'Unable to approve claim.', 'error');
    }
  };

  const handleRejectClaim = async (claimId) => {
    try {
      await adminApi.rejectClaim(claimId);
      setPendingClaims((prevClaims) => prevClaims.filter((claim) => claim.claim_id !== claimId));
      showToast(`Claim ${claimId} rejected.`);
    } catch (err) {
      showToast(err.message || 'Unable to reject claim.', 'error');
    }
  };

  const handleApprovePost = async (itemId) => {
    try {
      await adminApi.approvePost(itemId);
      setPendingPosts((prevPosts) => prevPosts.filter((item) => item.item_id !== itemId));
      showToast(`Post ${itemId} approved.`);
    } catch (err) {
      showToast(err.message || 'Unable to approve post.', 'error');
    }
  };

  const handleRejectPost = async (itemId) => {
    try {
      await adminApi.rejectPost(itemId);
      setPendingPosts((prevPosts) => prevPosts.filter((item) => item.item_id !== itemId));
      showToast(`Post ${itemId} rejected.`);
    } catch (err) {
      showToast(err.message || 'Unable to reject post.', 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Review pending posts and claims through the backend admin endpoints.</p>
        </div>
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>

      {loading && <p className="admin-loading">Loading admin panel...</p>}
      {error && <p className="auth-error">{error}</p>}

      <div className="admin-grid">
        <div className="admin-stat-card">
          <span>Total Users</span>
          <strong>{stats?.total_users ?? 0}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Total Items</span>
          <strong>{stats?.total_items ?? 0}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Total Claims</span>
          <strong>{stats?.total_claims ?? 0}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Pending Claims</span>
          <strong>{stats?.total_pending_claims ?? 0}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Pending Posts</span>
          <strong>{stats?.total_pending_posts ?? 0}</strong>
        </div>
      </div>

      <div className="admin-card">
        <h2>Pending Posts</h2>
        {pendingPosts.length === 0 ? (
          <p className="admin-empty">No pending posts found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Title</th>
                <th>Posted By</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingPosts.map((post) => (
                <tr key={post.item_id}>
                  <td>{post.item_id}</td>
                  <td>{post.title}</td>
                  <td>{post.posted_by}</td>
                  <td>{post.status}</td>
                  <td><span className="status pending">{post.approval}</span></td>
                  <td className="action-buttons">
                    <button className="approve-btn" onClick={() => handleApprovePost(post.item_id)}>Approve</button>
                    <button className="reject-btn" onClick={() => handleRejectPost(post.item_id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-card">
        <h2>Pending Claims</h2>
        {pendingClaims.length === 0 ? (
          <p className="admin-empty">No pending claims found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Item ID</th>
                <th>Claimed By</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingClaims.map((claim) => (
                <tr key={claim.claim_id}>
                  <td>{claim.claim_id}</td>
                  <td>{claim.item_id}</td>
                  <td>{claim.claimed_by}</td>
                  <td>{claim.claim_message}</td>
                  <td><span className="status pending">{claim.claim_status}</span></td>
                  <td className="action-buttons">
                    <button className="approve-btn" onClick={() => handleApproveClaim(claim.claim_id)}>Approve</button>
                    <button className="reject-btn" onClick={() => handleRejectClaim(claim.claim_id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;
