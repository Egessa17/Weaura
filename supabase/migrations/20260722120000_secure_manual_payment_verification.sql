-- Secure anonymous order intake and manual Mobile Money verification.

alter table public.orders
  add column if not exists payment_status text not null default 'Awaiting verification',
  add column if not exists payment_verified_at timestamptz,
  add column if not exists payment_verified_by uuid references public.users(id) on delete set null;

alter table public.orders
  drop constraint if exists orders_payment_status_check;

alter table public.orders
  add constraint orders_payment_status_check
  check (payment_status in ('Awaiting verification', 'Verified', 'Rejected'));

alter table public.orders
  drop constraint if exists orders_transaction_id_format_check;

alter table public.orders
  add constraint orders_transaction_id_format_check
  check (
    transaction_id is null
    or (payment_method = 'MTN MoMo' and transaction_id ~ '^[0-9]{11}$')
    or (payment_method = 'Airtel Money' and transaction_id ~ '^[0-9]{12}$')
  ) not valid;

create unique index if not exists orders_payment_transaction_unique
  on public.orders (payment_method, transaction_id)
  where transaction_id is not null and payment_status = 'Verified';

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

create index if not exists orders_payment_status_idx
  on public.orders (payment_status, created_at desc);

create index if not exists products_created_at_idx
  on public.products (created_at desc);

create index if not exists products_category_idx
  on public.products (category);

alter table public.products
  drop constraint if exists products_price_nonnegative_check;
alter table public.products
  add constraint products_price_nonnegative_check check (price >= 0);

alter table public.products
  drop constraint if exists products_stock_nonnegative_check;
alter table public.products
  add constraint products_stock_nonnegative_check check (stock >= 0);

drop policy if exists "Anyone can place an order" on public.orders;

-- Only trusted server code may call this function. It locks the order and
-- products so one transaction ID cannot be verified twice and stock cannot
-- be oversold during verification.
create or replace function public.verify_order_payment(
  p_order_id uuid,
  p_transaction_id text,
  p_admin_id uuid
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item jsonb;
  v_product_id uuid;
  v_quantity integer;
begin
  if not exists (
    select 1 from public.users
    where id = p_admin_id and role = 'admin'
  ) then
    raise exception 'Admin access required';
  end if;

  select * into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Order not found';
  end if;

  if v_order.payment_status <> 'Awaiting verification' then
    raise exception 'Order payment has already been processed';
  end if;

  if p_transaction_id <> v_order.transaction_id then
    raise exception 'Transaction ID does not match the customer submission';
  end if;

  if (v_order.payment_method = 'MTN MoMo' and p_transaction_id !~ '^[0-9]{11}$')
     or (v_order.payment_method = 'Airtel Money' and p_transaction_id !~ '^[0-9]{12}$')
     or v_order.payment_method not in ('MTN MoMo', 'Airtel Money') then
    raise exception 'Transaction ID format is invalid for the selected provider';
  end if;

  for v_item in select * from jsonb_array_elements(v_order.items)
  loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;

    if v_quantity < 1 then
      raise exception 'Invalid item quantity';
    end if;

    update public.products
    set stock = stock - v_quantity
    where id = v_product_id and stock >= v_quantity;

    if not found then
      raise exception 'Insufficient stock for product %', v_product_id;
    end if;
  end loop;

  update public.orders
  set payment_status = 'Verified',
      payment_verified_at = now(),
      payment_verified_by = p_admin_id,
      order_status = 'Confirmed'
  where id = p_order_id
  returning * into v_order;

  return v_order;
end;
$$;

revoke all on function public.verify_order_payment(uuid, text, uuid) from public, anon, authenticated;
grant execute on function public.verify_order_payment(uuid, text, uuid) to service_role;
