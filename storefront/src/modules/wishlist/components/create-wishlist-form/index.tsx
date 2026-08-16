"use client"

import { Button, toast } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { FormEvent } from "react"

import Input from "@modules/common/components/input"
import { createWishlist } from "@lib/data/wishlists"

const CreateWishlistForm = () => {
  const router = useRouter()
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await createWishlist({ name: name.trim() })
      setName("")
      router.refresh()
    } catch (error: any) {
      toast.error(error?.message ?? "Could not create wishlist")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-x-2">
      <Input
        label="New list name"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        data-testid="create-wishlist-name-input"
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        data-testid="create-wishlist-submit"
      >
        Create list
      </Button>
    </form>
  )
}

export default CreateWishlistForm
