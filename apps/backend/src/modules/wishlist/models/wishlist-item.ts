import { model } from "@medusajs/framework/utils"
import Wishlist from "./wishlist"

const WishlistItem = model
  .define("wishlist_item", {
    id: model.id({ prefix: "wlitem" }).primaryKey(),
    wishlist: model.belongsTo(() => Wishlist, {
      mappedBy: "items",
    }),
    product_id: model.text(),
    product_variant_id: model.text().nullable(),
  })
  .indexes([
    {
      name: "IDX_wlitem_unique_product",
      on: ["wishlist_id", "product_id"],
      unique: true,
      where: '"product_variant_id" IS NULL',
    },
    {
      name: "IDX_wlitem_unique_variant",
      on: ["wishlist_id", "product_variant_id"],
      unique: true,
      where: '"product_variant_id" IS NOT NULL',
    },
  ])

export default WishlistItem
