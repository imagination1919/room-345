import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/contact-messages
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: contact_messages } = await query.graph({
    entity: "contact_message",
    fields: ["id", "name", "email", "phone", "message", "read_at", "created_at"],
  })

  contact_messages.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  res.json({ contact_messages })
}
