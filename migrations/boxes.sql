-- Caixinhas (boxes) + histórico + cache de CDI
-- Rodar no SQL editor do Supabase

create table if not exists camenance_boxes (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    description text,
    color text,
    icon text,
    type text not null check (type in ('simple','nubank')),
    cdi_percentage numeric
);

create index if not exists idx_camenance_boxes_user on camenance_boxes(user_id);

create table if not exists camenance_box_transactions (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    user_id uuid not null references auth.users(id) on delete cascade,
    box_id uuid not null references camenance_boxes(id) on delete cascade,
    type text not null check (type in ('deposit','withdraw','spend','yield')),
    amount numeric not null,
    date date not null,
    description text,
    expense_id uuid references camenance_expenses(id) on delete set null,
    income_id uuid references camenance_incomes(id) on delete set null
);

create index if not exists idx_camenance_box_tx_box on camenance_box_transactions(box_id, date);
create index if not exists idx_camenance_box_tx_user on camenance_box_transactions(user_id);

create table if not exists camenance_cdi_rates (
    date date primary key,
    rate numeric not null,
    created_at timestamptz not null default now()
);

-- RLS
alter table camenance_boxes enable row level security;
alter table camenance_box_transactions enable row level security;
alter table camenance_cdi_rates enable row level security;

create policy "boxes_owner" on camenance_boxes
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "box_tx_owner" on camenance_box_transactions
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "cdi_rates_read" on camenance_cdi_rates
    for select using (auth.role() = 'authenticated');

create policy "cdi_rates_write" on camenance_cdi_rates
    for insert with check (auth.role() = 'authenticated');

create policy "cdi_rates_update" on camenance_cdi_rates
    for update using (auth.role() = 'authenticated');
