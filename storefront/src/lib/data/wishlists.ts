"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { revalidateTag } from "next/cache"
import { addToCart } from "./cart"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"

export type StoreWishlistItem = {
  id: string
  product_id: string
  product_variant_id: string | null
  product?: Record<string, any> | null
  product_variant?: Record<string, any> | null
}

export type StoreWishlist = {
  id: string
  name: string
  share_token: string | null
  created_at: string
  updated_at: string
  items: StoreWishlistItem[]
}

export const listWishlists = async (): Promise<StoreWishlist[]> => {
  const headers = { ...(await getAuthHeaders()) }
  const next = { ...(await getCacheOptions("wishlists")) }

  return sdk.client
    .fetch<{ wishlists: StoreWishlist[] }>("/store/wishlists", {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ wishlists }) => wishlists)
    .catch(() => [])
}

export const retrieveWishlist = async (
  id: string
): Promise<StoreWishlist | null> => {
  const headers = { ...(await getAuthHeaders()) }
  const next = { ...(await getCacheOptions("wishlists")) }

  return sdk.client
    .fetch<{ wishlist: StoreWishlist }>(`/store/wishlists/${id}`, {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ wishlist }) => wishlist)
    .catch(() => null)
}

export const createWishlist = async ({
  name,
}: {
  name: string
}): Promise<StoreWishlist> => {
  const headers = { ...(await getAuthHeaders()) }

  const wishlist = await sdk.client
    .fetch<{ wishlist: StoreWishlist }>("/store/wishlists", {
      method: "POST",
      headers,
      body: { name },
    })
    .then(({ wishlist }) => wishlist)
    .catch(medusaError)

  const cacheTag = await getCacheTag("wishlists")
  revalidateTag(cacheTag)

  return wishlist
}

export const renameWishlist = async ({
  id,
  name,
}: {
  id: string
  name: string
}): Promise<StoreWishlist> => {
  const headers = { ...(await getAuthHeaders()) }

  const wishlist = await sdk.client
    .fetch<{ wishlist: StoreWishlist }>(`/store/wishlists/${id}`, {
      method: "POST",
      headers,
      body: { name },
    })
    .then(({ wishlist }) => wishlist)
    .catch(medusaError)

  const cacheTag = await getCacheTag("wishlists")
  revalidateTag(cacheTag)

  return wishlist
}

export const deleteWishlist = async (id: string): Promise<void> => {
  const headers = { ...(await getAuthHeaders()) }

  await sdk.client
    .fetch(`/store/wishlists/${id}`, {
      method: "DELETE",
      headers,
    })
    .catch(medusaError)

  const cacheTag = await getCacheTag("wishlists")
  revalidateTag(cacheTag)
}

export const addWishlistItem = async ({
  wishlistId,
  productId,
  variantId,
}: {
  wishlistId: string
  productId: string
  variantId?: string
}): Promise<StoreWishlistItem> => {
  const headers = { ...(await getAuthHeaders()) }

  const item = await sdk.client
    .fetch<{ item: StoreWishlistItem }>(
      `/store/wishlists/${wishlistId}/items`,
      {
        method: "POST",
        headers,
        body: { product_id: productId, product_variant_id: variantId },
      }
    )
    .then(({ item }) => item)
    .catch(medusaError)

  const cacheTag = await getCacheTag("wishlists")
  revalidateTag(cacheTag)

  return item
}

export const removeWishlistItem = async ({
  wishlistId,
  itemId,
}: {
  wishlistId: string
  itemId: string
}): Promise<void> => {
  const headers = { ...(await getAuthHeaders()) }

  await sdk.client
    .fetch(`/store/wishlists/${wishlistId}/items/${itemId}`, {
      method: "DELETE",
      headers,
    })
    .catch(medusaError)

  const cacheTag = await getCacheTag("wishlists")
  revalidateTag(cacheTag)
}

export const generateWishlistShareLink = async (
  wishlistId: string,
  rotate?: boolean
): Promise<{ shareToken: string; shareUrl: string }> => {
  const headers = { ...(await getAuthHeaders()) }

  const { share_token } = await sdk.client
    .fetch<{ share_token: string }>(`/store/wishlists/${wishlistId}/share`, {
      method: "POST",
      headers,
      body: { rotate },
    })
    .catch(medusaError)

  const cacheTag = await getCacheTag("wishlists")
  revalidateTag(cacheTag)

  return {
    shareToken: share_token,
    shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/shared/${share_token}`,
  }
}

export const revokeWishlistShareLink = async (
  wishlistId: string
): Promise<void> => {
  const headers = { ...(await getAuthHeaders()) }

  await sdk.client
    .fetch(`/store/wishlists/${wishlistId}/share`, {
      method: "DELETE",
      headers,
    })
    .catch(medusaError)

  const cacheTag = await getCacheTag("wishlists")
  revalidateTag(cacheTag)
}

export const getSharedWishlist = async (
  token: string
): Promise<StoreWishlist | null> => {
  return sdk.client
    .fetch<{ wishlist: StoreWishlist }>(`/store/wishlists/shared/${token}`, {
      method: "GET",
      cache: "no-store",
    })
    .then(({ wishlist }) => wishlist)
    .catch(() => null)
}

export const moveWishlistItemToCart = async ({
  wishlistId,
  itemId,
  variantId,
  countryCode,
  removeAfter = true,
}: {
  wishlistId: string
  itemId: string
  variantId: string
  countryCode: string
  removeAfter?: boolean
}): Promise<void> => {
  await addToCart({ variantId, quantity: 1, countryCode })

  if (removeAfter) {
    await removeWishlistItem({ wishlistId, itemId })
  }
}
