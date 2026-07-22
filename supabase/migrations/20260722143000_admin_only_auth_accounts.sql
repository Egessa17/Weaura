-- Weaura customer checkout is anonymous. Every intentionally created Auth
-- account is therefore an administrator account.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'admin'
  )
  on conflict (id) do update
  set email = excluded.email,
      name = coalesce(public.users.name, excluded.name),
      role = 'admin';
  return new;
end;
$$;

insert into public.users (id, email, name, role)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  'admin'
from auth.users
where email is not null
on conflict (id) do update
set email = excluded.email,
    name = coalesce(public.users.name, excluded.name),
    role = 'admin';

