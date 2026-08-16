"use client"

import { Button, Text, toast } from "@medusajs/ui"
import { useState } from "react"

import {
  generateWishlistShareLink,
  revokeWishlistShareLink,
} from "@lib/data/wishlists"

type Props = {
  wishlistId: string
  shareToken: string | null
}

const buildShareUrl = (token: string) =>
  `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/shared/${token}`

const ShareWishlistControl = ({ wishlistId, shareToken }: Props) => {
  const [token, setToken] = useState(shareToken)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async (rotate?: boolean) => {
    setIsLoading(true)
    try {
      const { shareToken: newToken } = await generateWishlistShareLink(
        wishlistId,
        rotate
      )
      setToken(newToken)
    } catch (error: any) {
      toast.error(error?.message ?? "Could not create share link")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevoke = async () => {
    setIsLoading(true)
    try {
      await revokeWishlistShareLink(wishlistId)
      setToken(null)
    } catch (error: any) {
      toast.error(error?.message ?? "Could not revoke share link")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!token) {
      return
    }
    await navigator.clipboard.writeText(buildShareUrl(token))
    toast.success("Link copied")
  }

  return (
    <div className="flex flex-col gap-y-2" data-testid="share-wishlist-control">
      {token ? (
        <>
          <Text className="txt-small text-ui-fg-subtle break-all">
            {buildShareUrl(token)}
          </Text>
          <div className="flex gap-x-2">
            <Button
              size="small"
              variant="secondary"
              onClick={handleCopy}
              data-testid="copy-share-link"
            >
              Copy link
            </Button>
            <Button
              size="small"
              variant="secondary"
              onClick={() => handleGenerate(true)}
              isLoading={isLoading}
              data-testid="rotate-share-link"
            >
              Rotate link
            </Button>
            <Button
              size="small"
              variant="secondary"
              onClick={handleRevoke}
              isLoading={isLoading}
              data-testid="revoke-share-link"
            >
              Revoke
            </Button>
          </div>
        </>
      ) : (
        <Button
          size="small"
          variant="secondary"
          onClick={() => handleGenerate(false)}
          isLoading={isLoading}
          data-testid="generate-share-link"
        >
          Get share link
        </Button>
      )}
    </div>
  )
}

export default ShareWishlistControl
