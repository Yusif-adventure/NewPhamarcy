export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://newphamarcy.onrender.com/api';

export const api = {
  orders: {
    create: async (customerPhone: string, pharmacyPhone: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerPhone, pharmacyPhone }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create order');
      }
      return response.json();
    },
    
    getActive: async (customerPhone: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/customer/${customerPhone}/active`);
      if (!response.ok) throw new Error('Failed to get active order');
      return response.json();
    },

    getPharmacyOrders: async (pharmacyPhone: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/pharmacy/${pharmacyPhone}`);
      if (!response.ok) throw new Error('Failed to get pharmacy orders');
      return response.json();
    },

    updateCost: async (orderId: string, amount: number) => {
      const response = await fetch(`${API_BASE_URL}/orders/update-cost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount }),
      });
      if (!response.ok) throw new Error('Failed to update cost');
      return response.json();
    },

    confirmPayment: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) throw new Error('Failed to confirm payment');
      return response.json();
    },

    getAvailable: async () => {
      const response = await fetch(`${API_BASE_URL}/orders/available`);
      if (!response.ok) throw new Error('Failed to get available orders');
      return response.json();
    },

    requestRider: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/request-rider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to request rider');
      }
      return response.json();
    },

    acceptDelivery: async (orderId: string, riderName: string, riderPhone: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/accept-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, riderName, riderPhone }),
      });
      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.error || 'Failed to accept delivery');
      }
      return response.json();
    },

    completeDelivery: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/complete-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) throw new Error('Failed to complete delivery');
      return response.json();
    },

    requestDeliveryFee: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/request-delivery-fee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) throw new Error('Failed to request delivery fee');
      return response.json();
    },

    confirmDeliveryFee: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/confirm-delivery-fee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) throw new Error('Failed to confirm delivery fee');
      return response.json();
    },

    getRiderHistory: async (riderPhone: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/rider/${riderPhone}/history`);
      if (!response.ok) throw new Error('Failed to get rider history');
      return response.json();
    },

    getCustomerHistory: async (customerPhone: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/customer/${customerPhone}/history`);
      if (!response.ok) throw new Error('Failed to get customer history');
      return response.json();
    },

    deleteOrder: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete order');
      return response.json();
    },

    getById: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed to get order');
      return response.json();
    },
  }
};
