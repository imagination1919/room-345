"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { Button, toast } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"

/**
 * A simplified "quick add" for the homepage grid: adds the product's first
 * variant directly, with no size/color picker. This is a deliberate
 * shortcut for a homepage teaser card, not a substitute for the PDP's full
 * variant-select flow — a shopper who wants a specific size/color still
 * needs to go to the product page.
 */
export default function SimpleAddToCartButton({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { countryCode } = useParams() as { countryCode: string }
  const [isAdding, setIsAdding] = useState(false)
  const defaultVariant = product.variants?.[0]

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!defaultVariant?.id) {
      return
    }

    setIsAdding(true)
    try {
      await addToCart({
        variantId: defaultVariant.id,
        quantity: 1,
        countryCode,
      })
      toast.success(`${product.title} added to cart`)
    } catch (error: any) {
      toast.error(error?.message ?? "Could not add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      variant="primary"
      size="small"
      className="!rounded-full w-full"
      isLoading={isAdding}
      disabled={!defaultVariant}
      onClick={handleClick}
      data-testid="quick-add-to-cart-button"
    >
      Add to Cart
    </Button>
  )
}
