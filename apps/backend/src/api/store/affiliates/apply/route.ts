import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import applyForAffiliateWorkflow from "../../../../workflows/affiliate/apply-for-affiliate"

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { display_name, age_confirmed, notes } = req.body as {
    display_name: string
    age_confirmed: boolean
    notes?: string
  }

  if (!display_name) {
    return res.status(400).json({ message: "display_name is required" })
  }

  try {
    const { result } = await applyForAffiliateWorkflow(req.scope).run({
      input: {
        customer_id: req.auth_context.actor_id,
        display_name,
        age_confirmed,
        notes,
      },
    })

    res.status(201).json({ affiliate: result })
  } catch (err: any) {
    res.status(409).json({ message: err.message })
  }
}
