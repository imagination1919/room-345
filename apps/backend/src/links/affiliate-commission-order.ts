import OrderModule from "@medusajs/medusa/order"
import AffiliateModule from "../modules/affiliate"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  OrderModule.linkable.order,
  AffiliateModule.linkable.affiliateCommission
)
