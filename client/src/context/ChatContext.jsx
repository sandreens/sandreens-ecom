import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

// api.js er VITE_API_URL shadharonoto '.../api' die shesh hoy, socket er jonno '/api' bad diye base URL banachhi
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE.replace(/\/api\/?$/, '');

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingProduct, setPendingProduct] = useState(null);

  const socketRef = useRef(null);
  const conversationRef = useRef(null);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  // User login thakle socket connect + user er nijer room e join
  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConversation(null);
      setMessages([]);
      setUnreadCount(0);
      return;
    }

    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => {
  socket.emit('join_user_room'); 
});

    socket.on('receive_message', (msg) => {
      if (conversationRef.current && msg.conversation === conversationRef.current._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('conversation_updated', (conv) => {
      if (!conversationRef.current || conversationRef.current._id === conv._id) {
        setConversation(conv);
        setUnreadCount(conv.unreadByUser || 0);
      }
    });

    return () => socket.disconnect();
  }, [user]);

  // Login korar por nijer conversation + purono history load
  useEffect(() => {
    if (!user) return;
    api.get('/chat/conversation').then((res) => {
      setConversation(res.data);
      setUnreadCount(res.data.unreadByUser || 0);
      api.get(`/chat/${res.data._id}/messages`).then((r) => setMessages(r.data));
    });
  }, [user]);

  const openChat = useCallback((productContext = null) => {
    setIsOpen(true);
    if (productContext) setPendingProduct(productContext);
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);

  const markAsRead = useCallback(() => {
    if (!conversation) return;
    setUnreadCount(0);
    socketRef.current?.emit('mark_as_read', {
      conversationId: conversation._id,
      readerRole: 'user',
    });
  }, [conversation]);

  const sendMessage = useCallback(
    ({ text, image }) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit('send_message', {
        conversationId: conversation?._id,
        userId: user._id,
        senderRole: 'user',
        text: text || '',
        image: image || null,
        productRef: pendingProduct || undefined,
      });
      setPendingProduct(null);
    },
    [conversation, user, pendingProduct]
  );

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        conversation,
        messages,
        unreadCount,
        sendMessage,
        markAsRead,
        pendingProduct,
        setPendingProduct,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);