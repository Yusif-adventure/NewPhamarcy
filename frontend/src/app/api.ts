export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://newphamarcy.onrender.com/api';

export const api = {
  orders: {
    create: async (customerPhone: string, pharmacyPhone: string, amount?: number) => {
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerPhone, pharmacyPhone, amount }),
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

    cancelRiderRequest: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/cancel-rider-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) throw new Error('Failed to cancel rider request');
      return response.json();
    },

    markAsPickedUp: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/mark-picked-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) throw new Error('Failed to mark as picked up');
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
  },
  chat: {
    send: async (senderPhone: string, receiverPhone: string, content?: string, image?: string) => {
      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderPhone, receiverPhone, content, image }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Chat send error:", errorData);
        throw new Error(errorData.error || 'Failed to send message');
      }
      return response.json();
    },

    getConversation: async (user1: string, user2: string) => {
      const response = await fetch(`${API_BASE_URL}/chat/conversation/${user1}/${user2}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Chat getConversation error:", errorData);
        throw new Error(errorData.error || 'Failed to get conversation');
      }
      return response.json();
    },

    getList: async (phone: string) => {
      const response = await fetch(`${API_BASE_URL}/chat/list/${phone}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Chat getList error:", errorData);
        throw new Error(errorData.error || 'Failed to get chat list');
      }
      return response.json();
    },

    markAsRead: async (senderPhone: string, receiverPhone: string) => {
      const response = await fetch(`${API_BASE_URL}/chat/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderPhone, receiverPhone }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Chat markAsRead error:", errorData);
        throw new Error(errorData.error || 'Failed to mark as read');
      }
      return response.json();
    },
  }
};
