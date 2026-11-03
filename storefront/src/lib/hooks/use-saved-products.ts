"use client"

import { useEffect, useSyncExternalStore } from "react"

import { retrieveCustomer } from "@lib/data/customer"
import { listWishlists } from "@lib/data/wishlists"

// Shared across every heart button on the page so a grid of product cards
// triggers one fetch instead of one per card.
const EMPTY: ReadonlySet<string> = new Set()

let savedProductIds: ReadonlySet<string> = EMPTY
let hasLoaded = false
let inFlight: Promise<void> | null = null
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((listener) => listener())

export const refreshSavedProducts = (): Promise<void> => {
  inFlight = (async () => {
    try {
      const customer = await retrieveCustomer()
      const wishlists = customer ? await listWishlists() : []
      savedProductIds = new Set(
        wishlists.flatMap((wishlist) =>
          (wishlist.items ?? []).map((item) => item.product_id)
        )
      )
    } catch {
      savedProductIds = EMPTY
    } finally {
      hasLoaded = true
      inFlight = null
      emit()
    }
  })()

  return inFlight
}

export const clearSavedProducts = () => {
  savedProductIds = EMPTY
  hasLoaded = false
  emit()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const useIsProductSaved = (productId: string): boolean => {
  const ids = useSyncExternalStore(
    subscribe,
    () => savedProductIds,
    () => EMPTY
  )

  useEffect(() => {
    if (!hasLoaded && !inFlight) {
      refreshSavedProducts()
    }
  }, [])

  return ids.has(productId)
}
