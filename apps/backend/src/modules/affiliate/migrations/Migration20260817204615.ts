import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260817204615 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "affiliate_commission" drop constraint if exists "affcom_order_id_unique";`);
    this.addSql(`alter table if exists "affiliate" drop constraint if exists "affiliate_referral_code_unique";`);
    this.addSql(`alter table if exists "affiliate" drop constraint if exists "affiliate_customer_id_unique";`);
    this.addSql(`create table if not exists "affiliate" ("id" text not null, "customer_id" text not null, "display_name" text not null, "referral_code" text not null, "status" text check ("status" in ('pending', 'approved', 'rejected', 'suspended')) not null default 'pending', "tier" text check ("tier" in ('standard', 'silver', 'gold', 'ambassador')) not null default 'standard', "commission_rate" integer not null default 0.15, "cookie_window_days" integer not null default 30, "payout_method" text check ("payout_method" in ('paypal', 'bank_transfer', 'manual')) not null default 'manual', "payout_reference" text null, "age_confirmed" boolean not null default false, "notes" text null, "applied_at" timestamptz not null, "approved_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "affiliate_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_affiliate_deleted_at" ON "affiliate" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_affiliate_customer_id_unique" ON "affiliate" ("customer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_affiliate_referral_code_unique" ON "affiliate" ("referral_code") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "affiliate_commission" ("id" text not null, "affiliate_id" text not null, "order_id" text not null, "order_total" numeric not null, "amount" numeric not null, "currency_code" text not null, "rate_applied" integer not null, "attribution_source" text check ("attribution_source" in ('link', 'code')) not null default 'link', "status" text check ("status" in ('pending', 'payable', 'paid', 'reversed')) not null default 'pending', "payable_at" timestamptz null, "paid_at" timestamptz null, "payout_batch_id" text null, "raw_order_total" jsonb not null, "raw_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "affiliate_commission_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_affiliate_commission_affiliate_id" ON "affiliate_commission" ("affiliate_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_affiliate_commission_deleted_at" ON "affiliate_commission" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_affcom_order_id_unique" ON "affiliate_commission" ("order_id") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "affiliate_commission" add constraint "affiliate_commission_affiliate_id_foreign" foreign key ("affiliate_id") references "affiliate" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "affiliate_commission" drop constraint if exists "affiliate_commission_affiliate_id_foreign";`);

    this.addSql(`drop table if exists "affiliate" cascade;`);

    this.addSql(`drop table if exists "affiliate_commission" cascade;`);
  }

}
