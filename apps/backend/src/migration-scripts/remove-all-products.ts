import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"

const PAGE_SIZE = 100

export default async function remove_all_products({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  let totalProducts = 0
  while (true) {
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id"],
      pagination: { take: PAGE_SIZE },
    })
    if (!products.length) break
    await deleteProductsWorkflow(container).run({
      input: { ids: products.map((p) => p.id) },
    })
    totalProducts += products.length
    logger.info(`Deleted ${totalProducts} products so far...`)
  }

  let totalCategories = 0
  while (true) {
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: ["id"],
      pagination: { take: PAGE_SIZE },
    })
    if (!categories.length) break
    await deleteProductCategoriesWorkflow(container).run({
      input: categories.map((c) => c.id),
    })
    totalCategories += categories.length
    logger.info(`Deleted ${totalCategories} categories so far...`)
  }

  logger.info(
    `Done. Deleted ${totalProducts} products and ${totalCategories} categories.`
  )
}
