import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveCustomer } from "@lib/data/customer"
import { listWishlists } from "@lib/data/wishlists"
import WishlistOverview from "@modules/wishlist/templates/wishlist-overview"

export const metadata: Metadata = {
  title: "Wishlists",
  description: "View and manage your wishlists",
}

export default async function Wishlists() {
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  const wishlists = await listWishlists()

  return (
    <div className="w-full" data-testid="wishlists-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Wishlists</h1>
        <p className="text-base-regular">
          Save products you love to a list, and share it with anyone.
        </p>
      </div>
      <WishlistOverview wishlists={wishlists} />
    </div>
  )
}
