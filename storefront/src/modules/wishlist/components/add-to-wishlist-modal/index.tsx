"use client"

import { Button, Text, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"

import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import {
  addWishlistItem,
  createWishlist,
  listWishlists,
  StoreWishlist,
} from "@lib/data/wishlists"

type Props = {
  isOpen: boolean
  close: () => void
  productId: string
  variantId?: string
}

const AddToWishlistModal = ({
  isOpen,
  close,
  productId,
  variantId,
}: Props) => {
  const [wishlists, setWishlists] = useState<StoreWishlist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedId, setSelectedId] = useState<string>("")
  const [newListName, setNewListName] = useState("")
  const [creatingNew, setCreatingNew] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setIsLoading(true)
    listWishlists()
      .then((lists) => {
        setWishlists(lists)
        if (lists.length) {
          setSelectedId(lists[0].id)
          setCreatingNew(false)
        } else {
          setCreatingNew(true)
        }
      })
      .finally(() => setIsLoading(false))
  }, [isOpen])

  const handleSubmit = async () => {
    if (creatingNew && !newListName.trim()) {
      toast.error("Give your list a name")
      return
    }

    setIsSubmitting(true)

    try {
      let wishlistId = selectedId

      if (creatingNew) {
        const wishlist = await createWishlist({ name: newListName.trim() })
        wishlistId = wishlist.id
      }

      await addWishlistItem({ wishlistId, productId, variantId })
      toast.success("Added to wishlist")
      setNewListName("")
      close()
    } catch (error: any) {
      toast.error(error?.message ?? "Could not add to wishlist")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} close={close} data-testid="add-to-wishlist-modal">
      <Modal.Title>Add to wishlist</Modal.Title>
      <Modal.Body>
        <div className="flex flex-col gap-y-4 w-full">
          {isLoading ? (
            <Text>Loading your lists...</Text>
          ) : (
            <>
              {wishlists.map((wishlist) => (
                <label
                  key={wishlist.id}
                  className="flex items-center gap-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="wishlist"
                    checked={!creatingNew && selectedId === wishlist.id}
                    onChange={() => {
                      setCreatingNew(false)
                      setSelectedId(wishlist.id)
                    }}
                  />
                  <span>{wishlist.name}</span>
                </label>
              ))}
              <label className="flex items-center gap-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="wishlist"
                  checked={creatingNew}
                  onChange={() => setCreatingNew(true)}
                />
                <span>Create a new list</span>
              </label>
              {creatingNew && (
                <Input
                  label="List name"
                  name="name"
                  value={newListName}
                  onChange={(event) => setNewListName(event.target.value)}
                  data-testid="new-wishlist-name-input"
                />
              )}
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={isLoading}
          data-testid="add-to-wishlist-submit"
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddToWishlistModal
