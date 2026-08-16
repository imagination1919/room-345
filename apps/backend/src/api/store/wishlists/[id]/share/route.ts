import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import generateWishlistShareTokenWorkflow from "../../../../../workflows/wishlist/generate-wishlist-share-token"
import revokeWishlistShareTokenWorkflow from "../../../../../workflows/wishlist/revoke-wishlist-share-token"

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { rotate } = (req.body ?? {}) as { rotate?: boolean }

  const { result } = await generateWishlistShareTokenWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      customer_id: req.auth_context.actor_id,
      rotate,
    },
  })

  res.json({ share_token: result.share_token })
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  await revokeWishlistShareTokenWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      customer_id: req.auth_context.actor_id,
    },
  })

  res.json({ id: req.params.id, object: "wishlist", share_token: null })
}
