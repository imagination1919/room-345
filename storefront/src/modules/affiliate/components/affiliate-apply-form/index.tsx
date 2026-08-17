"use client"

import { Button, Textarea, Text, toast } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { FormEvent } from "react"

import Input from "@modules/common/components/input"
import CheckboxWithLabel from "@modules/common/components/checkbox"
import { applyForAffiliate } from "@lib/data/affiliates"

const AffiliateApplyForm = () => {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [notes, setNotes] = useState("")
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!displayName.trim() || !ageConfirmed) {
      return
    }

    setIsSubmitting(true)

    try {
      await applyForAffiliate({
        display_name: displayName.trim(),
        age_confirmed: ageConfirmed,
        notes: notes.trim() || undefined,
      })
      toast.success("Application submitted — we'll review it shortly.")
      router.refresh()
    } catch (error: any) {
      toast.error(error?.message ?? "Could not submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-4 max-w-md"
      data-testid="affiliate-apply-form"
    >
      <Text className="text-ui-fg-subtle">
        Join the Room 345 affiliate program to earn commission on orders
        referred through your personal link.
      </Text>
      <Input
        label="Display name"
        name="display_name"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        required
        data-testid="affiliate-display-name-input"
      />
      <Textarea
        placeholder="Where will you be sharing your link? (optional)"
        name="notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        rows={3}
        data-testid="affiliate-notes-input"
      />
      <CheckboxWithLabel
        label="I am 18 years of age or older and eligible to participate"
        checked={ageConfirmed}
        onChange={() => setAgeConfirmed((prev) => !prev)}
        name="age_confirmed"
        data-testid="affiliate-age-confirm-checkbox"
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={!displayName.trim() || !ageConfirmed}
        data-testid="affiliate-apply-submit"
      >
        Apply now
      </Button>
    </form>
  )
}

export default AffiliateApplyForm
