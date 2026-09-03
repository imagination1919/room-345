import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Sends an order confirmation email when checkout completes.
 *
 * Sends plain HTML directly (via `content`) rather than a SendGrid Dynamic
 * Template, so no template needs to be built in the SendGrid dashboard —
 * only SENDGRID_API_KEY / SENDGRID_FROM need to be set. If the SendGrid
 * provider isn't configured (e.g. no notification module registered),
 * createNotifications throws and this handler just logs it — a missing
 * confirmation email should never fail order placement.
 */
export default async function orderPlacedEmailHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "total",
      "item_total",
      "shipping_total",
      "items.title",
      "items.quantity",
      "items.unit_price",
      "shipping_address.first_name",
      "shipping_address.last_name",
      "shipping_address.address_1",
      "shipping_address.city",
      "shipping_address.postal_code",
      "shipping_address.country_code",
    ],
    filters: { id: data.id },
  })

  const order = orders[0]
  if (!order?.email) return

  const money = (amount: number | null | undefined) =>
    `${(amount ?? 0).toFixed(2)} ${order.currency_code?.toUpperCase() ?? ""}`

  const itemRows = (order.items ?? [])
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;">${item?.title ?? ""}</td>
          <td style="padding:8px 0;text-align:center;">${item?.quantity ?? 0}</td>
          <td style="padding:8px 0;text-align:right;">${money(item?.unit_price)}</td>
        </tr>`
    )
    .join("")

  const address = order.shipping_address
  const addressBlock = address
    ? `${address.first_name ?? ""} ${address.last_name ?? ""}<br/>
       ${address.address_1 ?? ""}<br/>
       ${address.city ?? ""} ${address.postal_code ?? ""}<br/>
       ${address.country_code?.toUpperCase() ?? ""}`
    : ""

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h1 style="font-size:20px;">Thanks for your order!</h1>
      <p>Order #${order.display_id}</p>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:1px solid #ddd;text-align:left;">
            <th style="padding:8px 0;">Item</th>
            <th style="padding:8px 0;">Qty</th>
            <th style="padding:8px 0;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p style="text-align:right;font-weight:bold;">Total: ${money(order.total)}</p>
      ${addressBlock ? `<p><strong>Shipping to</strong><br/>${addressBlock}</p>` : ""}
    </div>
  `

  try {
    const notificationService = container.resolve(Modules.NOTIFICATION)
    await notificationService.createNotifications({
      to: order.email,
      channel: "email",
      content: {
        subject: `Room 345 — Order #${order.display_id} confirmed`,
        html,
      },
    })
  } catch (err) {
    logger.error(
      `Failed to send order confirmation email for order ${order.id}`,
      err instanceof Error ? err : new Error(String(err))
    )
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
