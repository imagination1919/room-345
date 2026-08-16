import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import createWishlistWorkflow from "../../../workflows/wishlist/create-wishlist"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: wishlists } = await query.graph({
    entity: "wishlist",
    fields: ["id", "name", "share_token", "created_at", "updated_at", "items.id"],
    filters: { customer_id: req.auth_context.actor_id },
  })

  res.json({ wishlists })
}

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { name } = req.body as { name: string }

  const { result } = await createWishlistWorkflow(req.scope).run({
    input: {
      customer_id: req.auth_context.actor_id,
      name,
    },
  })

  res.status(201).json({ wishlist: result })
}
