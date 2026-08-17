import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/affiliates?status=pending
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const status = req.query.status as
    | "pending"
    | "approved"
    | "rejected"
    | "suspended"
    | undefined

  const { data: affiliates } = await query.graph({
    entity: "affiliate",
    fields: [
      "id",
      "customer_id",
      "display_name",
      "referral_code",
      "status",
      "tier",
      "commission_rate",
      "applied_at",
    ],
    filters: status ? { status } : {},
  })

  res.json({ affiliates })
}
