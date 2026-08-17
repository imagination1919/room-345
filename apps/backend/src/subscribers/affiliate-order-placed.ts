import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import recordAffiliateCommissionWorkflow from "../workflows/affiliate/record-affiliate-commission"

/**
 * Expects the storefront to have set `metadata.affiliate_ref` on the cart
 * before checkout completes (see README for the storefront snippet that
 * reads `?ref=` / the referral cookie and attaches it).
 */
export default async function affiliateOrderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "total", "currency_code", "metadata"],
    filters: { id: data.id },
  })

  const order = orders[0]
  if (!order) return

  const referralCode = (order.metadata as Record<string, unknown> | null)?.[
    "affiliate_ref"
  ] as string | undefined

  if (!referralCode) return // most orders won't have one — normal

  await recordAffiliateCommissionWorkflow(container).run({
    input: {
      referral_code: referralCode,
      order_id: order.id,
      order_total: order.total,
      currency_code: order.currency_code,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
