import { model } from "@medusajs/framework/utils"
import WishlistItem from "./wishlist-item"

const Wishlist = model
  .define("wishlist", {
    id: model.id({ prefix: "wl" }).primaryKey(),
    customer_id: model.text(),
    name: model.text(),
    share_token: model.text().nullable(),
    items: model.hasMany(() => WishlistItem, {
      mappedBy: "wishlist",
    }),
  })
  .cascades({
    delete: ["items"],
  })
  .indexes([
    {
      name: "IDX_wishlist_customer_id",
      on: ["customer_id"],
    },
    {
      name: "IDX_wishlist_share_token_unique",
      on: ["share_token"],
      unique: true,
      where: '"share_token" IS NOT NULL',
    },
  ])

export default Wishlist
