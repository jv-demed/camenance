-- Adiciona box_id em camenance_expenses para identificar gastos feitos com saldo de caixinha
-- Substitui o uso de payment_type = 'box_spend' como flag

alter table camenance_expenses
    add column if not exists box_id uuid references camenance_boxes(id) on delete set null;

create index if not exists idx_camenance_expenses_box on camenance_expenses(box_id);

-- Remove box_spend do enum PaymentType
-- PostgreSQL não suporta DROP VALUE diretamente, então recria o tipo

-- 1. Migrar linhas existentes com box_spend para debit
update camenance_expenses set payment_type = 'debit' where payment_type = 'box_spend';

-- 2. Criar novo enum sem box_spend
create type "PaymentTypes_new" as enum ('debit', 'pix', 'credit', 'benefits', 'box');

-- 3. Remover defaults antes de converter (evita erro de cast automático)
alter table camenance_expenses alter column payment_type drop default;
alter table camenance_recurring_transactions alter column payment_type drop default;

-- 4. Converter as colunas para o novo tipo
alter table camenance_expenses
    alter column payment_type type "PaymentTypes_new"
    using payment_type::text::"PaymentTypes_new";

alter table camenance_recurring_transactions
    alter column payment_type type "PaymentTypes_new"
    using payment_type::text::"PaymentTypes_new";

-- 5. Trocar pelo tipo definitivo
drop type "PaymentTypes";
alter type "PaymentTypes_new" rename to "PaymentTypes";
