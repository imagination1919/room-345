import { model } from "@medusajs/framework/utils"
import AffiliateCommission from "./affiliate-commission"

/**
 * Affiliate profile, tied 1:1 to a Medusa customer account (same pattern
 * as the wishlist module's customer_id field). Applying for the affiliate
 * program does not require a separate account system — an applicant
 * creates/uses a normal storefront customer account first.
 */
const Affiliate = model
  .define("affiliate", {
    id: model.id({ prefix: "aff" }).primaryKey(),
    customer_id: model.text(),

    display_name: model.text(),
    referral_code: model.text(),

    // pending | approved | rejected | suspended
    status: model.enum(["pending", "approved", "rejected", "suspended"]).default("pending"),

    // standard | silver | gold | ambassador
    tier: model.enum(["standard", "silver", "gold", "ambassador"]).default("standard"),

    commission_rate: model.float().default(0.15), // 0.15 = 15%
    cookie_window_days: model.number().default(30),

    // Payout details intentionally minimal until a payment processor is
    // confirmed to permit adult-product merchants (see program Issue #1
    // in affiliate-program-issues.md). Never store raw financial
    // credentials here — label + external reference only.
    payout_method: model.enum(["paypal", "bank_transfer", "manual"]).default("manual"),
    payout_reference: model.text().nullable(),

    age_confirmed: model.boolean().default(false),
    notes: model.text().nullable(),

    applied_at: model.dateTime(),
    approved_at: model.dateTime().nullable(),

    commissions: model.hasMany(() => AffiliateCommission, {
      mappedBy: "affiliate",
    }),
  })
  .cascades({
    delete: ["commissions"],
  })
  .indexes([
    {
      name: "IDX_affiliate_customer_id_unique",
      on: ["customer_id"],
      unique: true,
    },
    {
      name: "IDX_affiliate_referral_code_unique",
      on: ["referral_code"],
      unique: true,
    },
  ])

export default Affiliate
