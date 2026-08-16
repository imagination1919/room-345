import ProductModule from "@medusajs/medusa/product"
import WishlistModule from "../modules/wishlist"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.productVariant,
  WishlistModule.linkable.wishlistItem
)
