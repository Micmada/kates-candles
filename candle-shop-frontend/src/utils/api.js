const API_BASE_URL = 'http://localhost:5001/api';

export const testConnection = async () => {
  const response = await fetch(`${API_BASE_URL}/test`);
  const data = await response.json();
  return data;
};

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  const data = await response.json();
  return data;
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  const data = await response.json();
  return data;
};

export const createPaymentIntent = async (amount, customerEmail) => {
  const response = await fetch(`${API_BASE_URL}/orders/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, customer_email: customerEmail }),
  });
  return response.json();
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return response.json();
};

export const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`);
  return response.json();
};