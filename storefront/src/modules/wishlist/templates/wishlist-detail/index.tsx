"use client"

import { PencilSquare, Trash } from "@medusajs/icons"
import { Button, Heading, IconButton, Text, toast } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useState } from "react"

import Input from "@modules/common/components/input"
import ShareWishlistControl from "@modules/wishlist/components/share-wishlist-control"
import WishlistListItem from "@modules/wishlist/components/wishlist-list-item"
import {
  deleteWishlist,
  renameWishlist,
  StoreWishlist,
} from "@lib/data/wishlists"

type Props = {
  wishlist: StoreWishlist
}

const WishlistDetail = ({ wishlist }: Props) => {
  const router = useRouter()
  const [isEditingName, setIsEditingName] = useState(false)
  const [name, setName] = useState(wishlist.name)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleRename = async () => {
    if (!name.trim() || name === wishlist.name) {
      setIsEditingName(false)
      setName(wishlist.name)
      return
    }

    setIsSaving(true)
    try {
      await renameWishlist({ id: wishlist.id, name: name.trim() })
      setIsEditingName(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error?.message ?? "Could not rename wishlist")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (
      !window.confirm(`Delete "${wishlist.name}"? This cannot be undone.`)
    ) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteWishlist(wishlist.id)
      router.push("/account/wishlists")
    } catch (error: any) {
      toast.error(error?.message ?? "Could not delete wishlist")
      setIsDeleting(false)
    }
  }

  return (
    <div
      className="w-full flex flex-col gap-y-8"
      data-testid="wishlist-detail"
    >
      <div className="flex items-center justify-between gap-x-4">
        {isEditingName ? (
          <div className="flex items-end gap-x-2 flex-1">
            <Input
              label="List name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              data-testid="rename-wishlist-input"
            />
            <Button size="small" onClick={handleRename} isLoading={isSaving}>
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-x-2">
            <Heading level="h1" className="text-2xl-semi">
              {wishlist.name}
            </Heading>
            <IconButton
              onClick={() => setIsEditingName(true)}
              variant="transparent"
              data-testid="edit-wishlist-name"
            >
              <PencilSquare />
            </IconButton>
          </div>
        )}
        <Button
          size="small"
          variant="danger"
          onClick={handleDelete}
          isLoading={isDeleting}
          data-testid="delete-wishlist"
        >
          <Trash />
          Delete list
        </Button>
      </div>

      <ShareWishlistControl
        wishlistId={wishlist.id}
        shareToken={wishlist.share_token}
      />

      {wishlist.items.length === 0 ? (
        <Text className="text-ui-fg-subtle">This list is empty.</Text>
      ) : (
        <div>
          {wishlist.items.map((item) => (
            <WishlistListItem
              key={item.id}
              wishlistId={wishlist.id}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistDetail
