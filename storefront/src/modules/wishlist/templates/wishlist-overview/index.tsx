import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CreateWishlistForm from "@modules/wishlist/components/create-wishlist-form"
import { StoreWishlist } from "@lib/data/wishlists"

type Props = {
  wishlists: StoreWishlist[]
}

const WishlistOverview = ({ wishlists }: Props) => {
  return (
    <div
      className="w-full flex flex-col gap-y-8"
      data-testid="wishlists-overview"
    >
      <CreateWishlistForm />
      {wishlists.length === 0 ? (
        <Text className="text-ui-fg-subtle">
          You haven&apos;t created any wishlists yet.
        </Text>
      ) : (
        <div className="flex flex-col gap-y-4">
          {wishlists.map((wishlist) => (
            <LocalizedClientLink
              key={wishlist.id}
              href={`/account/wishlists/${wishlist.id}`}
              className="flex items-center justify-between border border-ui-border-base rounded-rounded p-4 hover:shadow-elevation-card-hover"
              data-testid="wishlist-overview-item"
            >
              <span className="txt-medium-plus">{wishlist.name}</span>
              <span className="text-ui-fg-subtle txt-small">
                {wishlist.items?.length ?? 0} item
                {wishlist.items?.length === 1 ? "" : "s"}
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistOverview
