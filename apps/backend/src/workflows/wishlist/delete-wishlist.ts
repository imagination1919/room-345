import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep, removeRemoteLinkStep } from "@medusajs/core-flows"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import WishlistModuleService from "../../modules/wishlist/service"
import { assertWishlistOwnershipStep } from "./assert-wishlist-ownership"

type WorkflowInput = {
  id: string
  customer_id: string
}

const deleteWishlistStep = createStep(
  "delete-wishlist",
  async (id: string, { container }) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)

    await wishlistModuleService.deleteWishlists(id)

    return new StepResponse(id)
  }
)

const deleteWishlistWorkflow = createWorkflow(
  "delete-wishlist",
  (input: WorkflowInput) => {
    assertWishlistOwnershipStep({
      wishlist_id: input.id,
      customer_id: input.customer_id,
    })

    const { data: items } = useQueryGraphStep({
      entity: "wishlist_item",
      fields: ["id"],
      filters: { wishlist_id: input.id },
    })

    const itemIds = transform({ items }, ({ items }) =>
      items.map((item) => item.id)
    )

    removeRemoteLinkStep({ wishlist: { wishlist_item_id: itemIds } })

    const deleted = deleteWishlistStep(input.id)

    return new WorkflowResponse(deleted)
  }
)

export default deleteWishlistWorkflow
