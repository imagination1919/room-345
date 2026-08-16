import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import addWishlistItemWorkflow from "../../../../../workflows/wishlist/add-wishlist-item"

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { product_id, product_variant_id } = req.body as {
    product_id: string
    product_variant_id?: string
  }

  const { result } = await addWishlistItemWorkflow(req.scope).run({
    input: {
      wishlist_id: req.params.id,
      customer_id: req.auth_context.actor_id,
      product_id,
      product_variant_id,
    },
  })

  res.status(201).json({ item: result })
}
