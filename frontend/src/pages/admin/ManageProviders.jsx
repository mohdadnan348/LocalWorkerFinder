import React, { useState, useEffect } from 'react';
import { getAllProviders, approveProvider } from '../../services/adminService';
import './ManageProviders.css';

const ManageProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await getAllProviders();
      setProviders(res.data);
    } catch (err) {
      setError('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (providerId, currentBlockedStatus) => {
    const newBlocked = !currentBlockedStatus;
    try {
      await approveProvider(providerId, newBlocked);
      fetchProviders();
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="manage-providers">Loading...</div>;
  if (error) return <div className="manage-providers error">{error}</div>;

  return (
    <div className="manage-providers">
      <h1>Manage Providers</h1>
      <div className="providers-table-container">
        <table className="providers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Skills</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map(provider => (
              <tr key={provider._id}>
                <td>{provider.userId?.name || 'N/A'}</td>
                <td>{provider.userId?.email}</td>
                <td>{provider.userId?.phone}</td>
                <td>{provider.skills?.join(', ') || '-'}</td>
                <td>{provider.location}</td>
                <td>{provider.rating} ⭐</td>
                <td>
                  <span className={`status-badge ${provider.userId?.isBlocked ? 'blocked' : 'approved'}`}>
                    {provider.userId?.isBlocked ? 'Blocked' : 'Approved'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleApproval(provider._id, provider.userId?.isBlocked)}
                    className={provider.userId?.isBlocked ? 'approve-btn' : 'block-btn'}
                  >
                    {provider.userId?.isBlocked ? 'Approve' : 'Block'}
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

export default ManageProviders;