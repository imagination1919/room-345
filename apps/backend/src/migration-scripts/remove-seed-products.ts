import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"

const SEED_PRODUCT_HANDLES = ["dog-collar", "pet-bed", "pet-blanket", "travel-bag"]

export default async function remove_seed_products({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "categories.id", "categories.name"],
    filters: { handle: SEED_PRODUCT_HANDLES },
  })

  if (products.length) {
    logger.info(`Deleting ${products.length} seed products...`)
    await deleteProductsWorkflow(container).run({
      input: { ids: products.map((p) => p.id) },
    })
  }

  const categoryIds = [
    ...new Set(
      products.flatMap((p) => p.categories?.map((c) => c?.id).filter(Boolean) ?? [])
    ),
  ] as string[]
  const orphanedCategoryIds: string[] = []
  for (const id of categoryIds) {
    const { data: remaining } = await query.graph({
      entity: "product_category",
      fields: ["id", "name", "products.id"],
      filters: { id },
    })
    if (remaining[0] && (remaining[0].products?.length ?? 0) === 0) {
      orphanedCategoryIds.push(id)
      logger.info(`Category "${remaining[0].name}" is now orphaned, deleting.`)
    }
  }

  if (orphanedCategoryIds.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: orphanedCategoryIds,
    })
  }

  logger.info(
    `Done. Deleted ${products.length} products and ${orphanedCategoryIds.length} orphaned categories.`
  )
}
