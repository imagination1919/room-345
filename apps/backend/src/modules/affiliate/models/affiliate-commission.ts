import { model } from "@medusajs/framework/utils"
import Affiliate from "./affiliate"

/**
 * One row per attributed order. order_id kept as a plain field (same
 * pattern as wishlist_item.product_id) and also exposed via a module
 * link (see src/links/affiliate-commission-order.ts) so it can be
 * traversed with query.graph.
 */
const AffiliateCommission = model
  .define("affiliate_commission", {
    id: model.id({ prefix: "affcom" }).primaryKey(),
    affiliate: model.belongsTo(() => Affiliate, {
      mappedBy: "commissions",
    }),

    order_id: model.text(),
    order_total: model.bigNumber(),

    amount: model.bigNumber(),
    currency_code: model.text(),
    rate_applied: model.float(), // snapshot of affiliate.commission_rate at calc time

    attribution_source: model.enum(["link", "code"]).default("link"),

    // pending: within return/dispute window, not yet payable
    // payable: eligible for next manual payout batch
    // paid: included in a completed payout
    // reversed: refund/chargeback on the underlying order
    status: model.enum(["pending", "payable", "paid", "reversed"]).default("pending"),

    payable_at: model.dateTime().nullable(),
    paid_at: model.dateTime().nullable(),
    payout_batch_id: model.text().nullable(), // manual CSV batch ref until Issue #1 resolved
  })
  .indexes([
    {
      name: "IDX_affcom_order_id_unique",
      on: ["order_id"],
      unique: true, // one commission per order — prevents double-attribution
    },
  ])

export default AffiliateCommission
