import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import { listProducts } from "@lib/data/products"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
import SimpleAddToCartButton from "./simple-add-to-cart-button"

export default async function BestSellers({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 4,
      fields: "*variants.calculated_price",
    },
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <Heading level="h2" className="text-2xl-semi text-ui-fg-base">
            Best Sellers
          </Heading>
          <Text className="text-ui-fg-subtle mt-1">
            Our most-loved products, trusted by pet parents everywhere.
          </Text>
        </div>
        <InteractiveLink href="/store">View All Best Sellers</InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-6 gap-y-10">
        {products.map((product) => (
          <li key={product.id} className="flex flex-col gap-3">
            <ProductPreview product={product} region={region} isFeatured />
            <SimpleAddToCartButton product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
