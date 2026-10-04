import { model } from "@medusajs/framework/utils"

/**
 * A single Contact Us form submission. No workflow/status beyond
 * read/unread — this is a message log for manual follow-up, not a
 * ticketing system.
 */
const ContactMessage = model.define("contact_message", {
  id: model.id({ prefix: "cmsg" }).primaryKey(),
  name: model.text(),
  email: model.text(),
  phone: model.text().nullable(),
  message: model.text(),
  read_at: model.dateTime().nullable(),
})

export default ContactMessage
