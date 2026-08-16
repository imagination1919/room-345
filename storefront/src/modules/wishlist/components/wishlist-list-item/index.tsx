"use client"

import { Text } from "@medusajs/ui"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import {
  moveWishlistItemToCart,
  removeWishlistItem,
  StoreWishlistItem,
} from "@lib/data/wishlists"

type Props = {
  wishlistId: string
  item: StoreWishlistItem
  readOnly?: boolean
}

const WishlistListItem = ({ wishlistId, item, readOnly }: Props) => {
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()
  const [isRemoving, setIsRemoving] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const product = item.product
  const variant = item.product_variant

  if (!product) {
    return null
  }

  const variants = (product.variants ?? []) as { id: string }[]
  const resolvedVariantId =
    item.product_variant_id ??
    (variants.length === 1 ? variants[0].id : undefined)

  const handleRemove = async () => {
    setIsRemoving(true)
    await removeWishlistItem({ wishlistId, itemId: item.id })
    setIsRemoving(false)
    router.refresh()
  }

  const handleAddToCart = async () => {
    if (!resolvedVariantId) {
      router.push(`/${countryCode}/products/${product.handle}`)
      return
    }

    setIsAdding(true)
    await moveWishlistItemToCart({
      wishlistId,
      itemId: item.id,
      variantId: resolvedVariantId,
      countryCode,
      removeAfter: false,
    })
    setIsAdding(false)
  }

  return (
    <div
      className="flex items-center gap-x-4 py-4 border-b border-ui-border-base"
      data-testid="wishlist-item"
    >
      <LocalizedClientLink href={`/products/${product.handle}`}>
        <Thumbnail thumbnail={product.thumbnail} size="square" />
      </LocalizedClientLink>
      <div className="flex flex-col flex-1 min-w-0">
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <Text className="txt-medium-plus truncate">{product.title}</Text>
        </LocalizedClientLink>
        {variant?.title && (
          <Text className="txt-small text-ui-fg-subtle">{variant.title}</Text>
        )}
      </div>
      <div className="flex items-center gap-x-4 shrink-0">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="text-small-regular underline"
          data-testid="wishlist-item-add-to-cart"
        >
          {resolvedVariantId ? "Add to cart" : "Select options"}
        </button>
        {!readOnly && (
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-small-regular text-ui-fg-subtle underline"
            data-testid="wishlist-item-remove"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

export default WishlistListItem
