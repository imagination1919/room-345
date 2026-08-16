"use client"

import { Heart } from "@medusajs/icons"
import { clx, toast } from "@medusajs/ui"
import { useParams, useRouter } from "next/navigation"
import type { MouseEvent } from "react"

import { retrieveCustomer } from "@lib/data/customer"
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
  const { state, open, close } = useToggleState(false)

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const customer = await retrieveCustomer()

    if (!customer) {
      toast.info("Log in to save items to a wishlist")
      router.push(`/${countryCode}/account`)
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
        aria-label="Add to wishlist"
        data-testid="add-to-wishlist-button"
      >
        <Heart />
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
