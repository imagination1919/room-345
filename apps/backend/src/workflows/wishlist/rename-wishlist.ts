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
  name: string
}

const renameWishlistStep = createStep(
  "rename-wishlist",
  async (input: { id: string; name: string }, { container }) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)

    const previous = await wishlistModuleService.retrieveWishlist(input.id)
    const wishlist = await wishlistModuleService.updateWishlists(input)

    return new StepResponse(wishlist, { id: input.id, name: previous.name })
  },
  async (
    compensateInput: { id: string; name: string } | undefined,
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

const renameWishlistWorkflow = createWorkflow(
  "rename-wishlist",
  (input: WorkflowInput) => {
    assertWishlistOwnershipStep({
      wishlist_id: input.id,
      customer_id: input.customer_id,
    })

    const wishlist = renameWishlistStep({ id: input.id, name: input.name })

    return new WorkflowResponse(wishlist)
  }
)

export default renameWishlistWorkflow
