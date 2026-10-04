import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

/**
 * Emails the team when someone submits the Contact Us form. Sent from
 * SENDGRID_CONTACT_FROM to CONTACT_NOTIFY_TO (defaults to the from address).
 * Everything the visitor typed is HTML-escaped before it goes into the email.
 */
export default async function contactMessageEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const from = process.env.SENDGRID_CONTACT_FROM || undefined
  const to = process.env.CONTACT_NOTIFY_TO || from
  if (!to) {
    logger.warn("CONTACT_NOTIFY_TO is not set; skipping contact notification email.")
    return
  }

  const { data: messages } = await query.graph({
    entity: "contact_message",
    fields: ["id", "name", "email", "phone", "message"],
    filters: { id: data.id },
  })

  const contact = messages[0]
  if (!contact) return

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
      <h1 style="font-size:20px;">New Contact Us message</h1>
      <p>
        <strong>From:</strong> ${escapeHtml(contact.name)}<br/>
        <strong>Email:</strong> ${escapeHtml(contact.email)}<br/>
        ${contact.phone ? `<strong>Phone:</strong> ${escapeHtml(contact.phone)}<br/>` : ""}
      </p>
      <p style="white-space:pre-wrap;border-left:3px solid #1E5631;padding-left:12px;">${escapeHtml(contact.message)}</p>
      <p style="color:#555;font-size:13px;">
        Reply to ${escapeHtml(contact.email)} directly. All messages are also listed in the admin dashboard.
      </p>
    </div>
  `

  try {
    const notificationService = container.resolve(Modules.NOTIFICATION)
    await notificationService.createNotifications({
      to,
      from,
      channel: "email",
      content: {
        subject: `Contact Us: message from ${contact.name.replace(/[\r\n]+/g, " ")}`,
        html,
      },
    })
  } catch (err) {
    logger.error(
      `Failed to send contact notification email for message ${contact.id}`,
      err instanceof Error ? err : new Error(String(err))
    )
  }
}

export const config: SubscriberConfig = {
  event: "contact_message.created",
}
