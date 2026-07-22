import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  corsHeaders,
  jsonResponse,
  normalizeTransactionId,
  validTransactionId,
} from '../_shared/http.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const cleanText = (value: unknown, maxLength: number) =>
  String(value ?? '').trim().slice(0, maxLength);

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    const body = await req.json();
    const customerName = cleanText(body.customer_name, 120);
    const customerPhone = cleanText(body.customer_phone, 30);
    const customerEmail = cleanText(body.customer_email, 254) || null;
    const customerAddress = cleanText(body.customer_address, 300);
    const deliveryZone = cleanText(body.delivery_zone, 120) || null;
    const paymentMethod = cleanText(body.payment_method, 30);
    const transactionId = normalizeTransactionId(body.transaction_id);
    const requestedItems = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !customerPhone || !customerAddress) {
      return jsonResponse({ error: 'Name, phone and delivery address are required' }, 400);
    }
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return jsonResponse({ error: 'Email address is invalid' }, 400);
    }
    if (!validTransactionId(paymentMethod, transactionId)) {
      const length = paymentMethod === 'MTN MoMo' ? 11 : paymentMethod === 'Airtel Money' ? 12 : null;
      return jsonResponse({
        error: length
          ? `${paymentMethod} transaction IDs must contain exactly ${length} digits`
          : 'Select a supported payment provider',
      }, 400);
    }
    if (requestedItems.length === 0 || requestedItems.length > 50) {
      return jsonResponse({ error: 'Order must contain between 1 and 50 items' }, 400);
    }

    const normalizedItems: Array<{ productId: string; quantity: number; size: string | null; color: string | null }> = [];
    for (const item of requestedItems) {
      const productId = cleanText(item.product_id, 36);
      const quantity = Number(item.quantity);
      if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return jsonResponse({ error: 'Order contains an invalid item' }, 400);
      }
      const normalized = {
        productId,
        quantity,
        size: cleanText(item.size, 50) || null,
        color: cleanText(item.color, 50) || null,
      };
      if (normalizedItems.some((existing) =>
        existing.productId === normalized.productId
        && existing.size === normalized.size
        && existing.color === normalized.color
      )) {
        return jsonResponse({ error: 'Order contains a duplicate product variant' }, 400);
      }
      normalizedItems.push(normalized);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id,name,price,stock,sizes,colors')
      .in('id', [...new Set(normalizedItems.map((item) => item.productId))]);
    if (productsError) throw productsError;
    const productById = new Map((products || []).map((product) => [product.id, product]));
    if (productById.size !== new Set(normalizedItems.map((item) => item.productId)).size) {
      return jsonResponse({ error: 'One or more products are unavailable' }, 400);
    }

    let totalAmount = 0;
    const quantityByProduct = new Map<string, number>();
    for (const requested of normalizedItems) {
      quantityByProduct.set(
        requested.productId,
        (quantityByProduct.get(requested.productId) || 0) + requested.quantity,
      );
    }
    for (const [productId, quantity] of quantityByProduct) {
      const product = productById.get(productId)!;
      if (Number(product.stock) < quantity) {
        throw new Error(`${product.name} does not have enough stock`);
      }
    }

    const items = normalizedItems.map((requested) => {
      const product = productById.get(requested.productId)!;
      if (Number(product.stock) < requested.quantity) {
        throw new Error(`${product.name} does not have enough stock`);
      }
      if (product.sizes?.length && (!requested.size || !product.sizes.includes(requested.size))) {
        throw new Error(`Select a valid size for ${product.name}`);
      }
      if (product.colors?.length && (!requested.color || !product.colors.includes(requested.color))) {
        throw new Error(`Select a valid color for ${product.name}`);
      }
      const price = Number(product.price);
      totalAmount += price * requested.quantity;
      return {
        product_id: product.id,
        product_name: product.name,
        quantity: requested.quantity,
        price,
        size: requested.size,
        color: requested.color,
      };
    });

    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_address: customerAddress,
        delivery_zone: deliveryZone,
        items,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        payment_status: 'Awaiting verification',
        order_status: 'Pending',
      })
      .select()
      .single();
    if (insertError) {
      if (insertError.code === '23505') {
        return jsonResponse({ error: 'That transaction ID has already been submitted' }, 409);
      }
      throw insertError;
    }

    // Notify the operator. Failure is returned in diagnostics but does not roll back a valid order.
    const emailResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'new_order', order }),
    });

    return jsonResponse({ order, admin_email_sent: emailResponse.ok }, 201);
  } catch (error) {
    console.error('Create order error:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Could not create order' }, 500);
  }
});
