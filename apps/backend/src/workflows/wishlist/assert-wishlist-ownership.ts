import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import WishlistModuleService from "../../modules/wishlist/service"

type StepInput = {
  wishlist_id: string
  customer_id: string
}

export const assertWishlistOwnershipStep = createStep(
  "assert-wishlist-ownership",
  async ({ wishlist_id, customer_id }: StepInput, { container }) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)

    const wishlist = await wishlistModuleService
      .retrieveWishlist(wishlist_id)
      .catch(() => null)

    if (!wishlist || wishlist.customer_id !== customer_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Wishlist with id: ${wishlist_id} was not found`
      )
    }

    return new StepResponse(wishlist)
  }
)
