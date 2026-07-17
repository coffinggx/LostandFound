import React from "react";
import { Link } from "react-router-dom";
import "./Myclaims.css";

const claims = [
  {
    id: 1,
    item: "Black Backpack",
    date: "10 July 2026",
    status: "Pending",
  },
  {
    id: 2,
    item: "Student ID Card",
    date: "12 July 2026",
    status: "Approved",
  },
  {
    id: 3,
    item: "Calculator",
    date: "14 July 2026",
    status: "Rejected",
  },
];

const Myclaims = () => {
  return (
    <div className="claims-container">
      <div className="claims-header">
        <h1>📋 My Claims</h1>
        <p>Track the status of your claimed items</p>
      </div>

      <div className="claims-stats">
        <div className="stat-card">
          <span className="stat-number">{claims.length}</span>
          <span className="stat-label">Total Claims</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{claims.filter(c => c.status === 'Pending').length}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{claims.filter(c => c.status === 'Approved').length}</span>
          <span className="stat-label">Approved</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{claims.filter(c => c.status === 'Rejected').length}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="claims-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Item</th>
              <th>Claim Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim, index) => (
              <tr key={claim.id}>
                <td>{index + 1}</td>
                <td><strong>{claim.item}</strong></td>
                <td>{claim.date}</td>
                <td>
                  <span className={`status-badge ${claim.status.toLowerCase()}`}>
                    {claim.status}
                  </span>
                </td>
                <td>
                  <Link to={`/item/${claim.id}`}>
                    <button className="view-btn">View</button>
                  </Link>
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