import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getSharedWishlist } from "@lib/data/wishlists"
import WishlistShared from "@modules/wishlist/templates/wishlist-shared"

export const metadata: Metadata = {
  title: "Shared wishlist",
  description: "A shared wishlist",
}

type Props = {
  params: Promise<{ token: string }>
}

export default async function SharedWishlistPage(props: Props) {
  const { token } = await props.params
  const wishlist = await getSharedWishlist(token)

  if (!wishlist) {
    notFound()
  }

  return <WishlistShared wishlist={wishlist} />
}
