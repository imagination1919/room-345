import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveCustomer } from "@lib/data/customer"
import { retrieveWishlist } from "@lib/data/wishlists"
import WishlistDetail from "@modules/wishlist/templates/wishlist-detail"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View and manage your wishlist",
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function WishlistPage(props: Props) {
  const { id } = await props.params
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  const wishlist = await retrieveWishlist(id)

  if (!wishlist) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="wishlist-page-wrapper">
      <WishlistDetail wishlist={wishlist} />
    </div>
  )
}
