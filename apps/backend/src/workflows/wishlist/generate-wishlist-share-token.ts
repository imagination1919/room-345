import crypto from "node:crypto"
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
  rotate?: boolean
}

type CompensateInput = {
  id: string
  share_token: string | null
}

const generateShareTokenStep = createStep(
  "generate-share-token",
  async (input: { id: string; rotate?: boolean }, { container }) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)

    const wishlist = await wishlistModuleService.retrieveWishlist(input.id)

    if (wishlist.share_token && !input.rotate) {
      return new StepResponse(wishlist, null)
    }

    const previousToken = wishlist.share_token

    const updated = await wishlistModuleService.updateWishlists({
      id: input.id,
      share_token: crypto.randomBytes(24).toString("hex"),
    })

    return new StepResponse(updated, {
      id: input.id,
      share_token: previousToken,
    })
  },
  async (
    compensateInput: CompensateInput | null | undefined,
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

const generateWishlistShareTokenWorkflow = createWorkflow(
  "generate-wishlist-share-token",
  (input: WorkflowInput) => {
    assertWishlistOwnershipStep({
      wishlist_id: input.id,
      customer_id: input.customer_id,
    })

    const wishlist = generateShareTokenStep({
      id: input.id,
      rotate: input.rotate,
    })

    return new WorkflowResponse(wishlist)
  }
)

export default generateWishlistShareTokenWorkflow
