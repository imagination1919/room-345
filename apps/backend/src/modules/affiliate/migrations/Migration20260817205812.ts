import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260817205812 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "affiliate" alter column "commission_rate" type real using ("commission_rate"::real);`);

    this.addSql(`alter table if exists "affiliate_commission" alter column "rate_applied" type real using ("rate_applied"::real);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "affiliate" alter column "commission_rate" type integer using ("commission_rate"::integer);`);

    this.addSql(`alter table if exists "affiliate_commission" alter column "rate_applied" type integer using ("rate_applied"::integer);`);
  }

}
