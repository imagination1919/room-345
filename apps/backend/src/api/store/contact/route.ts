import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import submitContactMessageWorkflow from "../../../workflows/contact/submit-contact-message"

// POST /store/contact — public, unauthenticated
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { name, email, phone, message } = req.body as {
    name?: string
    email?: string
    phone?: string
    message?: string
  }

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "name, email, and message are required" })
  }

  try {
    const { result } = await submitContactMessageWorkflow(req.scope).run({
      input: { name, email, phone, message },
    })
    res.status(201).json({ contact_message: { id: result.id } })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
