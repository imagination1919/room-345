import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260922193759 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "contact_message" ("id" text not null, "name" text not null, "email" text not null, "phone" text null, "message" text not null, "read_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "contact_message_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_contact_message_deleted_at" ON "contact_message" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "contact_message" cascade;`);
  }

}
