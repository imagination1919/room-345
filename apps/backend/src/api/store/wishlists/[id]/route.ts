import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import renameWishlistWorkflow from "../../../../workflows/wishlist/rename-wishlist"
import deleteWishlistWorkflow from "../../../../workflows/wishlist/delete-wishlist"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: wishlists } = await query.graph({
    entity: "wishlist",
    fields: [
      "*",
      "items.*",
      "items.product.*",
      "items.product.thumbnail",
      "items.product.variants.id",
      "items.product_variant.*",
    ],
    filters: {
      id: req.params.id,
      customer_id: req.auth_context.actor_id,
    },
  })

  const wishlist = wishlists[0]

  if (!wishlist) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Wishlist with id: ${req.params.id} was not found`
    )
  }

  res.json({ wishlist })
}

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { name } = req.body as { name: string }

  const { result } = await renameWishlistWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      customer_id: req.auth_context.actor_id,
      name,
    },
  })

  res.json({ wishlist: result })
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  await deleteWishlistWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      customer_id: req.auth_context.actor_id,
    },
  })

  res.json({ id: req.params.id, object: "wishlist", deleted: true })
}
