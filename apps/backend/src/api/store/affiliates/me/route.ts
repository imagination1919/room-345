import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/affiliates/me — authenticated customer's own affiliate stats.
// No affiliate_id is ever taken from the request; it's derived from the
// authenticated session so one affiliate can't query another's data.
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: affiliates } = await query.graph({
    entity: "affiliate",
    fields: [
      "id",
      "display_name",
      "referral_code",
      "tier",
      "commission_rate",
      "status",
      "commissions.amount",
      "commissions.status",
    ],
    filters: { customer_id: req.auth_context.actor_id },
  })

  const affiliate = affiliates[0]
  if (!affiliate) {
    return res.status(404).json({ message: "No affiliate profile for this customer." })
  }

  const totals = (affiliate.commissions ?? []).reduce(
    (acc: Record<string, number>, c: any) => {
      acc[c.status] = (acc[c.status] ?? 0) + Number(c.amount)
      return acc
    },
    {}
  )

  res.json({
    affiliate: {
      display_name: affiliate.display_name,
      referral_code: affiliate.referral_code,
      tier: affiliate.tier,
      commission_rate: affiliate.commission_rate,
      status: affiliate.status,
    },
    stats: {
      total_referrals: (affiliate.commissions ?? []).length,
      pending_commission: totals.pending ?? 0,
      payable_commission: totals.payable ?? 0,
      paid_commission: totals.paid ?? 0,
    },
    referral_link: `${process.env.STOREFRONT_URL}/?ref=${affiliate.referral_code}`,
  })
}
