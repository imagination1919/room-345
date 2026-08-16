import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import removeWishlistItemWorkflow from "../../../../../../workflows/wishlist/remove-wishlist-item"

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  await removeWishlistItemWorkflow(req.scope).run({
    input: {
      wishlist_id: req.params.id,
      customer_id: req.auth_context.actor_id,
      item_id: req.params.item_id,
    },
  })

  res.json({ id: req.params.item_id, object: "wishlist_item", deleted: true })
}
