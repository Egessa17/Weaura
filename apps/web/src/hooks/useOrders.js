
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (!pb.authStore.isValid) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userOrders = await pb.collection('orders').getFullList({
        filter: `user_id = "${pb.authStore.model.id}"`,
        sort: '-created',
        $autoCancel: false
      });

      setOrders(userOrders);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    if (!pb.authStore.isValid || pb.authStore.model.role !== 'admin') {
      return;
    }

    try {
      setLoading(true);
      const allOrders = await pb.collection('orders').getFullList({
        sort: '-created',
        $autoCancel: false
      });

      setOrders(allOrders);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching all orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (items, totalAmount, paymentMethod, transactionId) => {
    if (!pb.authStore.isValid) {
      throw new Error('Please log in to place an order');
    }

    try {
      const order = await pb.collection('orders').create({
        user_id: pb.authStore.model.id,
        items: items,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        order_status: 'Pending'
      }, { $autoCancel: false });

      await fetchOrders();
      return order;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await pb.collection('orders').update(orderId, {
        order_status: status
      }, { $autoCancel: false });

      if (pb.authStore.model.role === 'admin') {
        await fetchAllOrders();
      } else {
        await fetchOrders();
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pb.authStore.isValid]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    fetchAllOrders,
    createOrder,
    updateOrderStatus
  };
};
