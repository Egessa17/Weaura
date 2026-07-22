import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  corsHeaders,
  jsonResponse,
  normalizeTransactionId,
  validTransactionId,
} from '../_shared/http.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    const authorization = req.headers.get('Authorization');
    if (!authorization) return jsonResponse({ error: 'Authentication required' }, 401);

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) return jsonResponse({ error: 'Authentication required' }, 401);

    const { data: profile } = await userClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') return jsonResponse({ error: 'Admin access required' }, 403);

    const body = await req.json();
    const orderId = body.order_id;
    const paymentMethod = body.payment_method;
    const transactionId = normalizeTransactionId(body.transaction_id);
    if (!orderId || !validTransactionId(paymentMethod, transactionId)) {
      return jsonResponse({ error: 'Transaction ID format is invalid for the selected provider' }, 400);
    }

    const serviceClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: order, error: verifyError } = await serviceClient.rpc('verify_order_payment', {
      p_order_id: orderId,
      p_transaction_id: transactionId,
      p_admin_id: user.id,
    });
    if (verifyError) return jsonResponse({ error: verifyError.message }, 400);

    const verifiedOrder = Array.isArray(order) ? order[0] : order;
    if (!verifiedOrder) return jsonResponse({ error: 'Payment verification returned no order' }, 500);

    const productIds = [...new Set(
      (verifiedOrder.items || []).map((item: { product_id: string }) => item.product_id).filter(Boolean),
    )];
    const { data: lowStockProducts, error: lowStockError } = await serviceClient.rpc(
      'claim_low_stock_alerts',
      { p_product_ids: productIds },
    );
    if (lowStockError) console.error('Could not claim low-stock alerts:', lowStockError);

    const emailResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'order_receipt', order: verifiedOrder }),
    });

    const lowStockEmailResults = await Promise.all((lowStockProducts || []).map((product: any) =>
      fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'low_stock', product }),
      })
    ));

    return jsonResponse({
      order: verifiedOrder,
      customer_email_sent: !verifiedOrder.customer_email || emailResponse.ok,
      low_stock_alerts_sent: lowStockEmailResults.filter((response) => response.ok).length,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Could not verify payment' }, 500);
  }
});
