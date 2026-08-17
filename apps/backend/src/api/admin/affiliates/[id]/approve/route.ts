import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import updateAffiliateStatusWorkflow from "../../../../../workflows/affiliate/update-affiliate-status"

// POST /admin/affiliates/:id/approve
// Manual review by design — no auto-approve (see program Issue #7).
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await updateAffiliateStatusWorkflow(req.scope).run({
    input: { id: req.params.id, status: "approved" },
  })

  // NOTE: hook up notification module here to email the affiliate their
  // approval + asset library link.

  res.json({ affiliate: result })
}
