import api from './api';

// Logged-in user's own orders
export const getMyOrders = async () => {
  const { data } = await api.get('/orders/myorders');
  return data;
};

// Create a new order
export const createOrder = async (orderData) => {
  const { data } = await api.post('/orders', orderData);
  return data;
};

// Request a return for an order (multipart — reason + optional image)
export const requestReturn = async (orderId, formData) => {
  const { data } = await api.put(`/orders/${orderId}/return`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};