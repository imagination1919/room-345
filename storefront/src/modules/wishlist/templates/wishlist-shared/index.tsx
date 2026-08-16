import { Heading, Text } from "@medusajs/ui"

import WishlistListItem from "@modules/wishlist/components/wishlist-list-item"
import { StoreWishlist } from "@lib/data/wishlists"

type Props = {
  wishlist: StoreWishlist
}

const WishlistShared = ({ wishlist }: Props) => {
  return (
    <div className="content-container py-12" data-testid="shared-wishlist">
      <Heading level="h1" className="text-2xl-semi mb-2">
        {wishlist.name}
      </Heading>
      <Text className="text-ui-fg-subtle mb-8">
        Shared wishlist — add items straight to your cart.
      </Text>
      {wishlist.items.length === 0 ? (
        <Text className="text-ui-fg-subtle">This list is empty.</Text>
      ) : (
        <div>
          {wishlist.items.map((item) => (
            <WishlistListItem
              key={item.id}
              wishlistId={wishlist.id}
              item={item}
              readOnly
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistShared
