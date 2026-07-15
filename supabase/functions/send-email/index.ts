// supabase/functions/send-email/index.ts
// Deploy this with: supabase functions deploy send-email
//
// Set these secrets first:
//   supabase secrets set RESEND_API_KEY=re_xxxxxxxx
//   supabase secrets set WEAURA_FROM_EMAIL=orders@weaura.ug
//   supabase secrets set WEAURA_ADMIN_EMAIL=admin@weaura.ug

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = Deno.env.get('WEAURA_FROM_EMAIL') || 'orders@weaura.ug';
const ADMIN_EMAIL = Deno.env.get('WEAURA_ADMIN_EMAIL') || 'admin@weaura.ug';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Email HTML templates ──────────────────────────────────────

const receiptEmailHtml = (order: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: #0f0f0f; padding: 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 28px; letter-spacing: -0.5px; }
    .header p { color: #999; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #999; margin-bottom: 4px; }
    .value { font-size: 15px; color: #111; margin-bottom: 16px; }
    .divider { border: none; border-top: 1px solid #eee; margin: 24px 0; }
    .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .item-row:last-child { border-bottom: none; }
    .item-name { color: #111; font-weight: 500; }
    .item-meta { color: #999; font-size: 12px; margin-top: 2px; }
    .item-price { color: #111; font-weight: 600; }
    .total-row { display: flex; justify-content: space-between; padding: 16px 0; font-size: 18px; font-weight: 700; }
    .status-badge { display: inline-block; background: #fef9c3; color: #854d0e; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
    .footer { background: #f9f9f9; padding: 24px 32px; text-align: center; }
    .footer p { font-size: 13px; color: #999; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Weaura</h1>
      <p>Your order is confirmed</p>
    </div>
    <div class="body">
      <p style="font-size:16px;color:#111;margin-top:0">Hi ${order.customer_name},</p>
      <p style="color:#555;font-size:14px;line-height:1.6">
        Thank you for your order! We have received it and our team will call you on
        <strong>${order.customer_phone}</strong> to confirm before we dispatch.
      </p>

      <hr class="divider">

      <div class="label">Order reference</div>
      <div class="value" style="font-family:monospace;font-size:13px">#${order.id.slice(0, 8).toUpperCase()}</div>

      <div class="label">Order status</div>
      <div class="value"><span class="status-badge">${order.order_status}</span></div>

      <div class="label">Delivery address</div>
      <div class="value">${order.customer_address}${order.delivery_zone ? ` (${order.delivery_zone})` : ''}</div>

      <hr class="divider">

      <div class="label">Items ordered</div>
      <div style="margin-top:8px">
        ${(order.items || []).map((item: any) => `
          <div class="item-row">
            <div>
              <div class="item-name">${item.product_name}</div>
              <div class="item-meta">Qty: ${item.quantity}${item.size ? ` · Size: ${item.size}` : ''}${item.color ? ` · ${item.color}` : ''}</div>
            </div>
            <div class="item-price">UGX ${(Number(item.price) * item.quantity).toLocaleString()}</div>
          </div>
        `).join('')}
      </div>

      <hr class="divider">

      <div class="label">Payment method</div>
      <div class="value">${order.payment_method}</div>

      <div class="label">Transaction ID</div>
      <div class="value" style="font-family:monospace">${order.transaction_id}</div>

      <div class="total-row">
        <span>Total paid</span>
        <span style="color:#f59e0b">UGX ${Number(order.total_amount).toLocaleString()}</span>
      </div>

      <hr class="divider">
      <p style="font-size:13px;color:#555;line-height:1.6">
        If you have any questions about your order, please contact us via WhatsApp or email.
        Keep your order reference <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> handy.
      </p>
    </div>
    <div class="footer">
      <p>Weaura — Premium Fashion, Delivered to You</p>
    </div>
  </div>
</body>
</html>
`;

const statusUpdateEmailHtml = (order: any, newStatus: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: #0f0f0f; padding: 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 28px; }
    .body { padding: 32px; }
    .status-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0; }
    .status-label { font-size: 13px; color: #999; margin-bottom: 6px; }
    .status-value { font-size: 22px; font-weight: 700; color: #16a34a; }
    .footer { background: #f9f9f9; padding: 24px 32px; text-align: center; }
    .footer p { font-size: 13px; color: #999; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Weaura</h1>
    </div>
    <div class="body">
      <p style="font-size:16px;color:#111;margin-top:0">Hi ${order.customer_name},</p>
      <p style="color:#555;font-size:14px;line-height:1.6">
        Your order <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> has been updated.
      </p>

      <div class="status-box">
        <div class="status-label">Your order is now</div>
        <div class="status-value">${newStatus}</div>
      </div>

      ${newStatus === 'Dispatched' ? `
        <p style="color:#555;font-size:14px;line-height:1.6">
          Your order is on its way! Our rider will contact you shortly for delivery.
        </p>
      ` : ''}

      ${newStatus === 'Delivered' ? `
        <p style="color:#555;font-size:14px;line-height:1.6">
          Your order has been delivered. Thank you for shopping with Weaura!
        </p>
      ` : ''}

      <p style="font-size:13px;color:#999">
        Order reference: <strong>#${order.id.slice(0, 8).toUpperCase()}</strong>
      </p>
    </div>
    <div class="footer">
      <p>Weaura — Premium Fashion, Delivered to You</p>
    </div>
  </div>
</body>
</html>
`;

const adminNewOrderEmailHtml = (order: any) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body { font-family: -apple-system, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; }
  .header { background: #854d0e; padding: 24px 32px; }
  .header h1 { color: #fff; margin: 0; font-size: 20px; }
  .body { padding: 32px; }
  .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
  .row:last-child { border-bottom: none; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛍 New order received — #${order.id.slice(0, 8).toUpperCase()}</h1>
    </div>
    <div class="body">
      <p style="font-size:15px;font-weight:600;margin-top:0">Customer</p>
      <div class="row"><span>Name</span><strong>${order.customer_name}</strong></div>
      <div class="row"><span>Phone</span><strong>${order.customer_phone}</strong></div>
      <div class="row"><span>Email</span><strong>${order.customer_email || '—'}</strong></div>
      <div class="row"><span>Address</span><strong>${order.customer_address}</strong></div>
      <div class="row"><span>Zone</span><strong>${order.delivery_zone || '—'}</strong></div>

      <p style="font-size:15px;font-weight:600;margin-top:24px">Order</p>
      <div class="row"><span>Payment</span><strong>${order.payment_method}</strong></div>
      <div class="row"><span>Transaction ID</span><strong style="font-family:monospace">${order.transaction_id}</strong></div>
      <div class="row"><span>Items</span><strong>${order.items?.length || 0} item(s)</strong></div>
      <div class="row"><span>Total</span><strong style="color:#f59e0b">UGX ${Number(order.total_amount).toLocaleString()}</strong></div>

      <p style="font-size:15px;font-weight:600;margin-top:24px">Items</p>
      ${(order.items || []).map((item: any) => `
        <div class="row">
          <span>${item.product_name} × ${item.quantity}${item.size ? ` (${item.size})` : ''}</span>
          <strong>UGX ${(Number(item.price) * item.quantity).toLocaleString()}</strong>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>
`;

// ── Send email via Resend ─────────────────────────────────────
const sendEmail = async (to: string, subject: string, html: string) => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
  return res.json();
};

// ── Main handler ──────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, order, newStatus } = await req.json();

    switch (type) {

      // Called when customer places an order
      case 'order_receipt': {
        const promises = [];

        // Send receipt to customer (if they gave email)
        if (order.customer_email) {
          promises.push(
            sendEmail(
              order.customer_email,
              `Your Weaura order #${order.id.slice(0, 8).toUpperCase()} is confirmed`,
              receiptEmailHtml(order)
            )
          );
        }

        // Always notify admin of new order
        promises.push(
          sendEmail(
            ADMIN_EMAIL,
            `New order #${order.id.slice(0, 8).toUpperCase()} — ${order.customer_name}`,
            adminNewOrderEmailHtml(order)
          )
        );

        await Promise.all(promises);
        break;
      }

      // Called when admin updates order status
      case 'status_update': {
        if (order.customer_email) {
          await sendEmail(
            order.customer_email,
            `Your Weaura order #${order.id.slice(0, 8).toUpperCase()} — ${newStatus}`,
            statusUpdateEmailHtml(order, newStatus)
          );
        }
        break;
      }

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Email function error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
