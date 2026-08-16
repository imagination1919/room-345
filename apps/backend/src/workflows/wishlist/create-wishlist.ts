import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import WishlistModuleService from "../../modules/wishlist/service"

type WorkflowInput = {
  customer_id: string
  name: string
}

const createWishlistStep = createStep(
  "create-wishlist",
  async (input: WorkflowInput, { container }) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)

    const wishlist = await wishlistModuleService.createWishlists(input)

    return new StepResponse(wishlist, wishlist.id)
  },
  async (wishlistId: string | undefined, { container }) => {
    if (!wishlistId) {
      return
    }

    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)

    await wishlistModuleService.deleteWishlists(wishlistId)
  }
)

const createWishlistWorkflow = createWorkflow(
  "create-wishlist",
  (input: WorkflowInput) => {
    const wishlist = createWishlistStep(input)

    return new WorkflowResponse(wishlist)
  }
)

export default createWishlistWorkflow
