import { supabase } from '@/lib/supabaseClient';

// Calls the Supabase Edge Function to send emails
// Never expose Resend API key on the frontend — it stays in the edge function

const callEmailFunction = async (payload) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: payload,
    });
    if (error) throw error;
    return data;
  } catch (err) {
    // Email failures should never block the user flow
    // Log the error but don't throw
    console.error('Email service error:', err);
  }
};

// Called immediately after a successful order insert
export const sendOrderReceipt = async (order) => {
  return callEmailFunction({ type: 'order_receipt', order });
};

// Called when admin updates order status
export const sendStatusUpdate = async (order, newStatus) => {
  if (!order.customer_email) return; // no email to send to
  return callEmailFunction({ type: 'status_update', order, newStatus });
};
