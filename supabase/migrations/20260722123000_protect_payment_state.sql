-- Prevent PostgREST clients from bypassing the manual verification transaction.

alter table public.orders
  drop constraint if exists orders_verified_before_fulfilment_check;

alter table public.orders
  add constraint orders_verified_before_fulfilment_check
  check (
    payment_status = 'Verified'
    or order_status in ('Pending', 'Cancelled')
  ) not valid;

create or replace function public.protect_order_payment_fields()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user <> 'postgres'
     and (
       new.payment_status is distinct from old.payment_status
       or new.payment_verified_at is distinct from old.payment_verified_at
       or new.payment_verified_by is distinct from old.payment_verified_by
       or new.transaction_id is distinct from old.transaction_id
       or new.payment_method is distinct from old.payment_method
     ) then
    raise exception 'Payment fields can only be changed by the verification workflow';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_order_payment_fields_trigger on public.orders;
create trigger protect_order_payment_fields_trigger
before update on public.orders
for each row execute function public.protect_order_payment_fields();

revoke all on function public.protect_order_payment_fields() from public, anon, authenticated;

