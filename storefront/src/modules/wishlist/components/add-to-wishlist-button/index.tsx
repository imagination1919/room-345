"use client"

import { Heart } from "@medusajs/icons"
import { clx, toast } from "@medusajs/ui"
import { useParams, usePathname, useRouter } from "next/navigation"
import type { MouseEvent } from "react"

import { retrieveCustomer } from "@lib/data/customer"
import { useIsProductSaved } from "@lib/hooks/use-saved-products"
import useToggleState from "@lib/hooks/use-toggle-state"
import AddToWishlistModal from "../add-to-wishlist-modal"

type Props = {
  productId: string
  variantId?: string
  className?: string
}

const AddToWishlistButton = ({ productId, variantId, className }: Props) => {
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()
  const pathname = usePathname()
  const { state, open, close } = useToggleState(false)
  const isSaved = useIsProductSaved(productId)

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const customer = await retrieveCustomer()

    if (!customer) {
      toast.info("Log in to save items to a wishlist")
      const returnTo = encodeURIComponent(
        `${pathname}${window.location.search}`
      )
      router.push(`/${countryCode}/account?redirect_to=${returnTo}`)
      return
    }

    open()
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={clx(
          "flex items-center justify-center rounded-full bg-ui-bg-base p-2 shadow-elevation-card-rest hover:bg-ui-bg-base-hover transition-colors",
          className
        )}
        aria-label={isSaved ? "Saved to wishlist" : "Add to wishlist"}
        data-testid="add-to-wishlist-button"
        data-saved={isSaved}
      >
        <Heart
          color={isSaved ? "#e11d48" : "currentColor"}
          fill={isSaved ? "#e11d48" : "none"}
        />
      </button>
      <AddToWishlistModal
        isOpen={state}
        close={close}
        productId={productId}
        variantId={variantId}
      />
    </>
  )
}

export default AddToWishlistButton
