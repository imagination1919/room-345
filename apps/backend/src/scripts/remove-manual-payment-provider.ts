import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

const MANUAL_PROVIDER_ID = "pp_system_default"

/**
 * Medusa's built-in "Manual Payment" provider lets a customer place an order
 * without paying. Remove it from every region so checkout only offers real
 * payment providers. Run once: `npx medusa exec ./src/scripts/remove-manual-payment-provider.ts`
 */
export default async function remove_manual_payment_provider({
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

    if (!existing.includes(MANUAL_PROVIDER_ID)) {
      logger.info(`Region "${region.name}" has no manual payment provider.`)
      continue
    }

    const remaining = existing.filter((id) => id !== MANUAL_PROVIDER_ID)
    if (!remaining.length) {
      logger.warn(
        `Region "${region.name}" would be left with no payment provider; skipping.`
      )
      continue
    }

    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: region.id },
        update: { payment_providers: remaining },
      },
    })
    logger.info(
      `Region "${region.name}": providers now ${remaining.join(", ")}.`
    )
  }
}
