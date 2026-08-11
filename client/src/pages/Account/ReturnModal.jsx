import React, { useState } from 'react';

export default function ReturnModal({ order, onClose, onSubmit }) {
  const [reason, setReason] = useState('Defective');
  const [comment, setComment] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedFiles(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError('Please provide comments regarding the return/refund request.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const imageUrls = [];
      // Upload each file to Cloudinary
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default'); // default unsigned preset
        
        const response = await fetch('https://api.cloudinary.com/v1_1/wpqpgxrx/image/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Cloudinary upload failed with status ${response.status}`);
        }
        
        const data = await response.json();
        if (data.secure_url) {
          imageUrls.push(data.secure_url);
        }
      }

      await onSubmit(order._id, {
        reason,
        comment,
        images: imageUrls
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit refund request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16
    }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 450, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ margin: 0, marginBottom: 4, fontSize: 18, fontWeight: 'bold' }}>Request Refund / Return</h3>
        <p style={{ fontSize: 13, color: '#777', marginBottom: 16 }}>
          Order #{order._id.slice(-8).toUpperCase()}
        </p>

        <label style={{ fontSize: 13, fontWeight: 'bold', color: '#333', display: 'block', marginBottom: 6 }}>
          Reason for return
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ width: '100%', marginBottom: 14, padding: 10, border: '1px solid #ddd', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }}
        >
          <option value="Damaged">Damaged</option>
          <option value="Wrong Item">Wrong Item</option>
          <option value="Defective">Defective</option>
          <option value="Size Issue">Size Issue</option>
        </select>

        <label style={{ fontSize: 13, fontWeight: 'bold', color: '#333', display: 'block', marginBottom: 6 }}>
          Comments / Damage Description
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Please describe the issue in detail..."
          style={{ width: '100%', marginBottom: 14, padding: 10, border: '1px solid #ddd', borderRadius: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
        />

        <label style={{ fontSize: 13, fontWeight: 'bold', color: '#333', display: 'block', marginBottom: 6 }}>
          Upload proof photos (Multiple allowed)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          style={{ display: 'block', marginBottom: 10, fontSize: 13 }}
        />

        {previews.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {previews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="preview"
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
              />
            ))}
          </div>
        )}

        {error && <p style={{ color: 'red', fontSize: 13, marginBottom: 10 }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <button
            onClick={onClose}
            disabled={submitting}
            style={{ padding: '8px 18px', background: '#fff', border: '1px solid #ccc', color: '#333', borderRadius: 20, fontWeight: 'bold', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ padding: '8px 18px', background: '#111', border: 'none', color: '#fff', borderRadius: 20, fontWeight: 'bold', cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'Uploading & Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}