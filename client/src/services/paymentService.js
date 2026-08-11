import api from './api';

export const createCheckoutSession = async (payload) => {
  const { data } = await api.post('/payment/create-checkout-session', payload);
  return data; // { id, url }
};

export const verifySession = async (sessionId) => {
  const { data } = await api.get(`/payment/verify/${sessionId}`);
  return data; // the created order
};