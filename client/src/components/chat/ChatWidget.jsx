import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ChatWidget() {
  const { user } = useAuth();
  const {
    isOpen, openChat, closeChat,
    conversation, messages, unreadCount,
    sendMessage, markAsRead, pendingProduct, setPendingProduct,
  } = useChat();
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) markAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);


  const handleSend = () => {
    if (!text.trim() && !pendingProduct) return;
    sendMessage({ text: text.trim() });
    setText('');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/chat/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      sendMessage({ image: res.data.url });
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Floating bubble icon */}
      <button
        className="chat-widget-button"
        onClick={() => {
          if (!user) { navigate('/login'); return; }
          isOpen ? closeChat() : openChat();
        }}
      >
        <span style={{ position: 'relative', display: 'inline-flex' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          {unreadCount > 0 && !isOpen && (
            <span style={{
              position: 'absolute', top: -6, right: -6, background: '#d00', color: '#fff',
              fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
            }}>
              {unreadCount}
            </span>
          )}
        </span>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-widget-window">
          {/* Header */}
          <div style={{
            background: '#111', color: '#fff', padding: '14px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Sandreens Support</span>
            <button onClick={closeChat} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: '#f7f7f7', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.length === 0 && (
              <p style={{ fontSize: 12, color: '#888', textAlign: 'center', marginTop: 20 }}>
                No messages yet. Ask us anything 👋
              </p>
            )}
            {messages.map((m) => (
              <div key={m._id} style={{ alignSelf: m.senderRole === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                {m.productRef?.name && (
                  <div
                    onClick={() => m.productRef.link && navigate(m.productRef.link)}
                    style={{
                      display: 'flex', gap: 8, alignItems: 'center', background: '#fff',
                      border: '1px solid #eee', borderRadius: 8, padding: 6, marginBottom: 4, cursor: 'pointer',
                    }}
                  >
                    {m.productRef.image && (
                      <img src={m.productRef.image} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} />
                    )}
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>{m.productRef.name}</span>
                  </div>
                )}
                {m.image && (
                  <img src={m.image} alt="" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: m.text ? 4 : 0 }} />
                )}
                {m.text && (
                  <div style={{
                    background: m.senderRole === 'user' ? '#008037' : '#fff',
                    color: m.senderRole === 'user' ? '#fff' : '#111',
                    padding: '8px 12px', borderRadius: 14, fontSize: 13, lineHeight: 1.4,
                    border: m.senderRole === 'user' ? 'none' : '1px solid #eee',
                  }}>
                    {m.text}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Pending product preview, message pathanor age dekhabe */}
          {pendingProduct && (
            <div style={{ padding: '8px 12px', background: '#fffbe6', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, borderTop: '1px solid #eee' }}>
              No messages yet. Ask u<span style={{ flex: 1 }}>📎 Asking about: {pendingProduct.name}</span>s anything 👋
              <button onClick={() => setPendingProduct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>✕</button>
            </div>
          )}

          {/* Input row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10, borderTop: '1px solid #eee', background: '#fff' }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
              title="Send a photo"
            >
              📷
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={uploading ? 'Sending image...' : 'Type a message...'}
              disabled={uploading}
              style={{ flex: 1, border: '1px solid #ddd', borderRadius: 20, padding: '8px 14px', fontSize: 13, outline: 'none' }}
            />
            <button
              onClick={handleSend}
              disabled={uploading}
              style={{ background: '#008037', border: 'none', color: '#fff', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}