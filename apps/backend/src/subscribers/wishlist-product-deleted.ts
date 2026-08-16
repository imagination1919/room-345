import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ProductWorkflowEvents,
  ProductVariantWorkflowEvents,
} from "@medusajs/framework/utils"
import { WISHLIST_MODULE } from "../modules/wishlist"
import WishlistModuleService from "../modules/wishlist/service"

export default async function wishlistProductDeletedHandler({
  event: { name, data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const wishlistModuleService: WishlistModuleService =
    container.resolve(WISHLIST_MODULE)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  const filters =
    name === ProductVariantWorkflowEvents.DELETED
      ? { product_variant_id: data.id }
      : { product_id: data.id }

  const items = await wishlistModuleService.listWishlistItems(filters)

  if (!items.length) {
    return
  }

  const itemIds = items.map((item) => item.id)

  await link.delete({ wishlist: { wishlist_item_id: itemIds } })
  await wishlistModuleService.deleteWishlistItems(itemIds)
}

export const config: SubscriberConfig = {
  event: [
    ProductWorkflowEvents.DELETED,
    ProductVariantWorkflowEvents.DELETED,
  ],
}
