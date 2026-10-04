import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Emails a password-reset link when a customer or admin user requests one.
 * Sent from SENDGRID_SUPPORT_FROM (falls back to the provider's default
 * sender). Failures are logged rather than thrown so a mail outage never
 * breaks the reset request itself.
 */
export default async function passwordResetEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<{ entity_id: string; actor_type: string; token: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const { entity_id: email, actor_type: actorType, token } = data

  if (!email || !token) return

  const query = `token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
  let resetUrl: string
  let audience: string

  if (actorType === "customer") {
    const base = process.env.STOREFRONT_URL
    if (!base) {
      logger.warn("STOREFRONT_URL is not set; cannot send customer password reset email.")
      return
    }
    resetUrl = `${base}/us/reset-password?${query}`
    audience = "your Harlie's Pet Supply account"
  } else if (actorType === "user") {
    const base = process.env.ADMIN_URL
    if (!base) {
      logger.warn("ADMIN_URL is not set; cannot send admin password reset email.")
      return
    }
    resetUrl = `${base}/reset-password?${query}`
    audience = "the Harlie's Pet Supply admin dashboard"
  } else {
    return
  }

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h1 style="font-size:20px;">Reset your password</h1>
      <p>We received a request to reset the password for ${audience}.</p>
      <p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:10px 20px;background:#1E5631;color:#ffffff;text-decoration:none;border-radius:6px;">
          Choose a new password
        </a>
      </p>
      <p style="color:#555;font-size:13px;">
        This link expires soon. If you didn't ask for this, you can ignore this email and your password will stay the same.
      </p>
    </div>
  `

  try {
    const notificationService = container.resolve(Modules.NOTIFICATION)
    await notificationService.createNotifications({
      to: email,
      from: process.env.SENDGRID_SUPPORT_FROM || undefined,
      channel: "email",
      content: {
        subject: "Reset your Harlie's Pet Supply password",
        html,
      },
    })
  } catch (err) {
    logger.error(
      "Failed to send password reset email",
      err instanceof Error ? err : new Error(String(err))
    )
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
