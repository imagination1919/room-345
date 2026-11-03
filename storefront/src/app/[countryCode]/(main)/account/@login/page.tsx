import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Harlie's Pet Supply account.",
}

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{
    redirect_to?: string
    wishlist_product_id?: string
    wishlist_variant_id?: string
  }>
}) {
  const { redirect_to, wishlist_product_id, wishlist_variant_id } =
    await searchParams

  return (
    <LoginTemplate
      redirectTo={redirect_to}
      wishlistItem={
        wishlist_product_id
          ? { productId: wishlist_product_id, variantId: wishlist_variant_id }
          : undefined
      }
    />
  )
}
