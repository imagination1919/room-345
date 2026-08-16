import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import WishlistModuleService from "../../modules/wishlist/service"
import { assertWishlistOwnershipStep } from "./assert-wishlist-ownership"

type WorkflowInput = {
  wishlist_id: string
  customer_id: string
  item_id: string
}

const removeWishlistItemStep = createStep(
  "remove-wishlist-item",
  async (
    input: { wishlist_id: string; item_id: string },
    { container }
  ) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    const item = await wishlistModuleService
      .retrieveWishlistItem(input.item_id)
      .catch(() => null)

    if (!item || item.wishlist_id !== input.wishlist_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Wishlist item with id: ${input.item_id} was not found`
      )
    }

    await link.delete({ wishlist: { wishlist_item_id: input.item_id } })
    await wishlistModuleService.deleteWishlistItems(input.item_id)

    return new StepResponse(input.item_id)
  }
)

const removeWishlistItemWorkflow = createWorkflow(
  "remove-wishlist-item",
  (input: WorkflowInput) => {
    assertWishlistOwnershipStep({
      wishlist_id: input.wishlist_id,
      customer_id: input.customer_id,
    })

    const removed = removeWishlistItemStep({
      wishlist_id: input.wishlist_id,
      item_id: input.item_id,
    })

    return new WorkflowResponse(removed)
  }
)

export default removeWishlistItemWorkflow
