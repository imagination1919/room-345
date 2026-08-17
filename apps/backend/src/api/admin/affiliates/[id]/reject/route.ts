import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import updateAffiliateStatusWorkflow from "../../../../../workflows/affiliate/update-affiliate-status"

// POST /admin/affiliates/:id/reject
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await updateAffiliateStatusWorkflow(req.scope).run({
    input: { id: req.params.id, status: "rejected" },
  })

  res.json({ affiliate: result })
}
