import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { sendStatusUpdate } from '@/lib/emailService';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setOrders(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('id', orderId);
      if (updateError) throw updateError;

      // Update local state immediately
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: status } : o))
      );

      // Send status update email to customer — non-blocking
      const updatedOrder = orders.find((o) => o.id === orderId);
      if (updatedOrder) {
        sendStatusUpdate({ ...updatedOrder, order_status: status }, status);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateAdminNotes = async (orderId, notes) => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ admin_notes: notes })
        .eq('id', orderId);
      if (updateError) throw updateError;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, admin_notes: notes } : o))
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const stats = {
    totalRevenue:    orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
    totalOrders:     orders.length,
    pendingOrders:   orders.filter((o) => o.order_status === 'Pending').length,
    deliveredOrders: orders.filter((o) => o.order_status === 'Delivered').length,
  };

  return {
    orders,
    loading,
    error,
    stats,
    fetchAllOrders,
    fetchOrders: fetchAllOrders,
    updateOrderStatus,
    updateAdminNotes,
  };
};
