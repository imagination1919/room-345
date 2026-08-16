import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import WishlistModuleService from "../../modules/wishlist/service"
import { assertWishlistOwnershipStep } from "./assert-wishlist-ownership"

type WorkflowInput = {
  id: string
  customer_id: string
}

type CompensateInput = {
  id: string
  share_token: string | null
}

const revokeShareTokenStep = createStep(
  "revoke-share-token",
  async (id: string, { container }) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)

    const previous = await wishlistModuleService.retrieveWishlist(id)

    const updated = await wishlistModuleService.updateWishlists({
      id,
      share_token: null,
    })

    return new StepResponse(updated, {
      id,
      share_token: previous.share_token,
    })
  },
  async (
    compensateInput: CompensateInput | undefined,
    { container }
  ) => {
    if (!compensateInput) {
      return
    }

    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)

    await wishlistModuleService.updateWishlists(compensateInput)
  }
)

const revokeWishlistShareTokenWorkflow = createWorkflow(
  "revoke-wishlist-share-token",
  (input: WorkflowInput) => {
    assertWishlistOwnershipStep({
      wishlist_id: input.id,
      customer_id: input.customer_id,
    })

    const wishlist = revokeShareTokenStep(input.id)

    return new WorkflowResponse(wishlist)
  }
)

export default revokeWishlistShareTokenWorkflow
