import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders, requestReturn } from '../../services/orderService';
import Navbar from '../../components/layout/Navbar';
import OrderStepper from '../Account/OrderStepper';
import ReturnModal from '../Account/ReturnModal';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading, updateProfile, changePassword } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit personal info state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Change password state
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  // Return modal
  const [returnOrder, setReturnOrder] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    setProfileMsg({ type: '', text: '' });
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setProfileMsg({ type: 'error', text: 'Name and email are required.' });
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile({ name: profileForm.name.trim(), email: profileForm.email.trim() });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
      setEditingProfile(false);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    setPasswordMsg({ type: '', text: '' });
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setChangingPassword(false);
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleReturnSubmit = async (orderId, formData) => {
    const updated = await requestReturn(orderId, formData);
    setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const { data } = await api.put(`/orders/${orderId}/cancel`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, courierStatus: data.courierStatus, orderStatus: data.orderStatus } : o));
      alert('Order cancelled successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const handleRefundSubmit = async (orderId, refundData) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/request-refund`, refundData);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, refundRequest: data.refundRequest, returnStatus: data.returnStatus } : o));
      alert('Refund request submitted successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit refund request.');
      throw err;
    }
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;

  if (authLoading || !user) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', marginTop: 4, marginBottom: 12 };
  const labelStyle = { fontSize: 12, fontWeight: 'bold', color: '#555' };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 'bold', color: '#111', margin: 0 }}>My Account</h1>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 18px', background: '#fff', border: '1px solid #d00', color: '#d00', borderRadius: 20, fontWeight: 'bold', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>

        {/* Profile Info Card */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 'bold', margin: 0, color: '#111' }}>Profile Details</h2>
            {!editingProfile && (
              <button
                onClick={() => { setEditingProfile(true); setProfileMsg({ type: '', text: '' }); }}
                style={{ padding: '5px 14px', background: '#fff', border: '1px solid #111', color: '#111', borderRadius: 16, fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}
              >
                Edit Personal Information
              </button>
            )}
          </div>

          {editingProfile ? (
            <div>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                style={inputStyle}
                value={profileForm.name}
                onChange={(e) => setProfileForm(f => ({ ...f, name: e.target.value }))}
              />
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                style={inputStyle}
                value={profileForm.email}
                onChange={(e) => setProfileForm(f => ({ ...f, email: e.target.value }))}
              />

              {profileMsg.text && (
                <p style={{ fontSize: 12, color: profileMsg.type === 'error' ? 'red' : '#1e8536', marginBottom: 10 }}>
                  {profileMsg.text}
                </p>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  style={{ padding: '7px 16px', background: '#111', border: 'none', color: '#fff', borderRadius: 16, fontSize: 12, fontWeight: 'bold', cursor: 'pointer', opacity: savingProfile ? 0.6 : 1 }}
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => { setEditingProfile(false); setProfileForm({ name: user.name, email: user.email }); setProfileMsg({ type: '', text: '' }); }}
                  disabled={savingProfile}
                  style={{ padding: '7px 16px', background: '#fff', border: '1px solid #ccc', color: '#333', borderRadius: 16, fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p style={{ margin: '6px 0', fontSize: 14, color: '#333' }}><strong>Name:</strong> {user.name}</p>
              <p style={{ margin: '6px 0', fontSize: 14, color: '#333' }}><strong>Email:</strong> {user.email}</p>
              {profileMsg.text && (
                <p style={{ fontSize: 12, color: profileMsg.type === 'error' ? 'red' : '#1e8536', marginTop: 10 }}>
                  {profileMsg.text}
                </p>
              )}
            </>
          )}
        </div>

        {/* Change Password Card */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: changingPassword ? 14 : 0 }}>
            <h2 style={{ fontSize: 16, fontWeight: 'bold', margin: 0, color: '#111' }}>Password</h2>
            {!changingPassword && (
              <button
                onClick={() => { setChangingPassword(true); setPasswordMsg({ type: '', text: '' }); }}
                style={{ padding: '5px 14px', background: '#fff', border: '1px solid #111', color: '#111', borderRadius: 16, fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}
              >
                Change Password
              </button>
            )}
          </div>

          {changingPassword && (
            <div>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                style={inputStyle}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
              />
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                style={inputStyle}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
              />
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                style={inputStyle}
                value={passwordForm.confirmNewPassword}
                onChange={(e) => setPasswordForm(f => ({ ...f, confirmNewPassword: e.target.value }))}
              />

              {passwordMsg.text && (
                <p style={{ fontSize: 12, color: passwordMsg.type === 'error' ? 'red' : '#1e8536', marginBottom: 10 }}>
                  {passwordMsg.text}
                </p>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleSavePassword}
                  disabled={savingPassword}
                  style={{ padding: '7px 16px', background: '#111', border: 'none', color: '#fff', borderRadius: 16, fontSize: 12, fontWeight: 'bold', cursor: 'pointer', opacity: savingPassword ? 0.6 : 1 }}
                >
                  {savingPassword ? 'Saving...' : 'Update Password'}
                </button>
                <button
                  onClick={() => { setChangingPassword(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); setPasswordMsg({ type: '', text: '' }); }}
                  disabled={savingPassword}
                  style={{ padding: '7px 16px', background: '#fff', border: '1px solid #ccc', color: '#333', borderRadius: 16, fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
          <div style={{ background: '#f0f9f2', border: '1px solid #cde9d4', borderRadius: 10, padding: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1e8536' }}>{totalOrders}</div>
            <div style={{ fontSize: 13, color: '#555' }}>Total Orders</div>
          </div>
          <div style={{ background: '#eef4ff', border: '1px solid #cfe0ff', borderRadius: 10, padding: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#0a58ca' }}>£{totalSpent.toFixed(2)}</div>
            <div style={{ fontSize: 13, color: '#555' }}>Total Spent</div>
          </div>
          <div style={{ background: '#fff7ed', border: '1px solid #ffe0bd', borderRadius: 10, padding: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#c2740c' }}>{deliveredCount}</div>
            <div style={{ fontSize: 13, color: '#555' }}>Delivered</div>
          </div>
        </div>

        {/* Orders List */}
        <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 14, color: '#111' }}>My Orders</h2>

        {loading ? (
          <p style={{ color: '#555' }}>Loading orders...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : orders.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: 30, textAlign: 'center', color: '#777' }}>
            You haven't placed any orders yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#888' }}>Order ID</div>
                    <div style={{ fontSize: 13, fontWeight: 'bold', color: '#111' }}>{order._id.slice(-8).toUpperCase()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#888' }}>Date</div>
                    <div style={{ fontSize: 13, color: '#333' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#888' }}>Total</div>
                    <div style={{ fontSize: 13, fontWeight: 'bold', color: '#111' }}>£{order.totalPrice?.toFixed(2)}</div>
                  </div>
                </div>

                {/* Order status stepper */}
                <OrderStepper status={order.orderStatus} />

                {/* Items */}
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>
                      {item.name} {item.size ? `(${item.size})` : ''} × {item.qty} — £{Number(item.price).toFixed(2)}
                    </div>
                  ))}
                </div>

                {/* Actions & Return Section */}
                <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 10, alignItems: 'center' }}>
                  {order.trackingNumber && (
                    <a
                      href={`https://www.royalmail.com/track-your-item#/?trackingNumber=${order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 12, color: '#008037', fontWeight: 'bold', marginRight: 'auto', textDecoration: 'underline' }}
                    >
                      Track on Royal Mail ({order.trackingNumber})
                    </a>
                  )}

                  {(order.courierStatus === 'Pending' || order.courierStatus === 'Processing') && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      style={{ padding: '6px 16px', background: '#d00', border: 'none', color: '#fff', borderRadius: 16, fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.refundRequest?.isRequested ? (
                    <span style={{ fontSize: 12, fontWeight: 'bold', padding: '4px 12px', borderRadius: 12, background: '#fff3f5', color: '#cf3476' }}>
                      Refund: {order.refundRequest.status}
                    </span>
                  ) : order.returnStatus && order.returnStatus !== 'None' ? (
                    <span style={{ fontSize: 12, fontWeight: 'bold', padding: '4px 12px', borderRadius: 12, background: '#fff3f5', color: '#cf3476' }}>
                      Return: {order.returnStatus}
                    </span>
                  ) : (
                    order.courierStatus === 'Delivered' || order.orderStatus === 'Delivered' ? (
                      <button
                        onClick={() => setReturnOrder(order)}
                        style={{ padding: '6px 16px', background: '#fff', border: '1px solid #111', color: '#111', borderRadius: 16, fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Request Return / Refund
                      </button>
                    ) : (
                      !(order.courierStatus === 'Pending' || order.courierStatus === 'Processing' || order.courierStatus === 'Cancelled') && (
                        <span style={{ fontSize: 12, color: '#999' }}>Return available after delivery</span>
                      )
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {returnOrder && (
        <ReturnModal
          order={returnOrder}
          onClose={() => setReturnOrder(null)}
          onSubmit={handleRefundSubmit}
        />
      )}
    </>
  );
}