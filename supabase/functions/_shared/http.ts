export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

export const normalizeTransactionId = (value: unknown) =>
  String(value ?? '').replace(/\s+/g, '');

export const validTransactionId = (provider: string, value: string) => {
  if (provider === 'MTN MoMo') return /^\d{11}$/.test(value);
  if (provider === 'Airtel Money') return /^\d{12}$/.test(value);
  return false;
};

