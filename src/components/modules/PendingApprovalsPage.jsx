import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock, RefreshCw, Search } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const PendingApprovalsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState('');

  const token = localStorage.getItem('access_token');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = filter !== 'all' ? `?account_status=${filter}` : '';
      const res = await fetch(`${API_BASE}/api/admin/users${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [filter]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApprove = async (userId, email) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ account_status: 'approved' }),
      });
      if (!res.ok) throw new Error('Failed to approve');
      showToast(`${email} approved successfully.`);
      fetchUsers();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(rejectModal.id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${rejectModal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ account_status: 'rejected', rejection_reason: rejectReason }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      showToast(`${rejectModal.email} rejected.`);
      setRejectModal(null);
      setRejectReason('');
      fetchUsers();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (user) => {
    const isActive = user.account_status !== 'inactive';
    const newStatus = isActive ? 'inactive' : 'active';
    setActionLoading(user.id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ account_status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      showToast(`${user.email} ${isActive ? 'deactivated' : 'reactivated'}.`);
      fetchUsers();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.first_name.toLowerCase().includes(q) ||
      u.last_name.toLowerCase().includes(q)
    );
  });

  const statusBadge = (status) => {
    const map = {
      pending:  { cls: 'badge-warning',  label: 'Pending' },
      approved: { cls: 'badge-success',  label: 'Approved' },
      rejected: { cls: 'badge-danger',   label: 'Rejected' },
      inactive: { cls: 'badge-inactive', label: 'Inactive' },
    };
    const b = map[status] || { cls: 'badge-inactive', label: status };
    return <span className={`approval-badge ${b.cls}`}>{b.label}</span>;
  };

  return (
    <div className="approvals-page">
      <div className="approvals-header">
        <div>
          <div className="approvals-title-row">
            <Users size={22} />
            <h2>User Management</h2>
          </div>
          <p className="approvals-subtitle">Approve, reject, or manage teacher accounts</p>
        </div>
        <button className="refresh-btn" onClick={fetchUsers} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      <div className="approvals-toolbar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['pending', 'approved', 'rejected', 'inactive', 'all'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="approvals-error">{error}</div>}

      <div className="approvals-table-wrapper">
        <table className="approvals-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="table-loading">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="table-empty">No users found.</td></tr>
            ) : (
              filtered.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-name-cell">
                      <div className="user-avatar">
                        {user.first_name[0]}{user.last_name[0]}
                      </div>
                      <div>
                        <p className="user-fullname">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="user-role">{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td>{statusBadge(user.account_status)}</td>
                  <td className="user-date">
                    {new Date(user.created_at).toLocaleDateString('en-PH', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {user.account_status === 'pending' && (
                        <>
                          <button
                            className="action-btn approve-btn"
                            onClick={() => handleApprove(user.id, user.email)}
                            disabled={actionLoading === user.id}
                            title="Approve"
                          >
                            <CheckCircle size={15} />
                            Approve
                          </button>
                          <button
                            className="action-btn reject-btn"
                            onClick={() => setRejectModal(user)}
                            disabled={actionLoading === user.id}
                            title="Reject"
                          >
                            <XCircle size={15} />
                            Reject
                          </button>
                        </>
                      )}
                      {(user.account_status === 'approved') && (
                        <button
                          className="action-btn deactivate-btn"
                          onClick={() => handleToggleStatus(user)}
                          disabled={actionLoading === user.id}
                        >
                          <XCircle size={15} />
                          Deactivate
                        </button>
                      )}
                      {user.account_status === 'inactive' && (
                        <button
                          className="action-btn reactivate-btn"
                          onClick={() => handleToggleStatus(user)}
                          disabled={actionLoading === user.id}
                        >
                          <CheckCircle size={15} />
                          Reactivate
                        </button>
                      )}
                      {user.account_status === 'rejected' && (
                        <button
                          className="action-btn reactivate-btn"
                          onClick={() => handleApprove(user.id, user.email)}
                          disabled={actionLoading === user.id}
                        >
                          <CheckCircle size={15} />
                          Approve Anyway
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="approvals-footer">
        Showing {filtered.length} of {users.length} users
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="reject-modal" onClick={e => e.stopPropagation()}>
            <div className="reject-modal-header">
              <h3>Reject Account</h3>
              <button className="modal-close-btn" onClick={() => setRejectModal(null)}>✕</button>
            </div>
            <div className="reject-modal-body">
              <p>
                You are rejecting <strong>{rejectModal.first_name} {rejectModal.last_name}</strong>'s
                registration request.
              </p>
              <div className="form-group">
                <label className="form-label">Reason for rejection <span className="required">*</span></label>
                <textarea
                  className="reject-textarea"
                  placeholder="e.g. Duplicate account, incomplete information..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="reject-modal-footer">
              <button className="cancel-btn" onClick={() => { setRejectModal(null); setRejectReason(''); }}>
                Cancel
              </button>
              <button
                className="submit-btn reject-confirm-btn"
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading === rejectModal?.id}
              >
                {actionLoading === rejectModal?.id ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="profile-toast">{toast}</div>}
    </div>
  );
};

export default PendingApprovalsPage;
