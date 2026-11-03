export type PendingWishlistItem = {
  productId: string
  variantId?: string
}

type Props = {
  redirectTo?: string
  wishlistItem?: PendingWishlistItem
}

const LoginRedirectFields = ({ redirectTo, wishlistItem }: Props) => (
  <>
    {redirectTo && <input type="hidden" name="redirect_to" value={redirectTo} />}
    {wishlistItem && (
      <>
        <input
          type="hidden"
          name="wishlist_product_id"
          value={wishlistItem.productId}
        />
        {wishlistItem.variantId && (
          <input
            type="hidden"
            name="wishlist_variant_id"
            value={wishlistItem.variantId}
          />
        )}
      </>
    )}
  </>
)

export default LoginRedirectFields
