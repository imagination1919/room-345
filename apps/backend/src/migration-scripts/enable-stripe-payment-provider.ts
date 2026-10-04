import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

const STRIPE_PROVIDER_ID = "pp_stripe_stripe"

/**
 * The Stripe payment module is registered in medusa-config.ts, but that
 * only makes it available system-wide — each region also needs it added
 * to its own payment_providers list before checkout will offer it. Without
 * this, checkout silently falls back to "Manual Payment" only, and no
 * order ever reaches Stripe regardless of how the API keys are configured.
 */
export default async function enable_stripe_payment_provider({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "payment_providers.id"],
  })

  for (const region of regions) {
    const existing = (region.payment_providers ?? [])
      .map((p) => p?.id)
      .filter((id): id is string => Boolean(id))
    if (existing.includes(STRIPE_PROVIDER_ID)) {
      logger.info(`Region "${region.name}" already has Stripe enabled.`)
      continue
    }

    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: region.id },
        update: {
          payment_providers: [...existing, STRIPE_PROVIDER_ID],
        },
      },
    })
    logger.info(`Enabled Stripe on region "${region.name}".`)
  }

  logger.info("Done.")
}
