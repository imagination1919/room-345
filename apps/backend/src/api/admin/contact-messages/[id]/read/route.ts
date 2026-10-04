import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import markContactMessageReadWorkflow from "../../../../../workflows/contact/mark-contact-message-read"

// POST /admin/contact-messages/:id/read
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await markContactMessageReadWorkflow(req.scope).run({
    input: { id: req.params.id },
  })

  res.json({ contact_message: result })
}
