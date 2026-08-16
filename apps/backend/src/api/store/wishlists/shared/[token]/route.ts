import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: wishlists } = await query.graph({
    entity: "wishlist",
    fields: [
      "id",
      "name",
      "created_at",
      "items.*",
      "items.product.*",
      "items.product.thumbnail",
      "items.product.variants.id",
      "items.product_variant.*",
    ],
    filters: { share_token: req.params.token },
  })

  const wishlist = wishlists[0]

  if (!wishlist) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Shared wishlist was not found`
    )
  }

  res.json({ wishlist })
}
