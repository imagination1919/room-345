"use client"

import { Button, toast } from "@medusajs/ui"
import { useState } from "react"
import type { FormEvent } from "react"

import Input from "@modules/common/components/input"
import { requestPasswordReset } from "@lib/data/password-reset"

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    try {
      await requestPasswordReset(email.trim())
      setIsSubmitted(true)
    } catch (error: any) {
      toast.error(error?.message ?? "Could not send the reset email")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div
        className="rounded-rounded border border-ui-border-base bg-ui-bg-subtle p-6"
        data-testid="forgot-password-success"
      >
        <p className="txt-compact-medium-plus text-ui-fg-base">
          Check your email
        </p>
        <p className="text-ui-fg-subtle mt-1">
          If an account exists for {email.trim()}, we've sent a link to choose a
          new password.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-4 max-w-md"
      data-testid="forgot-password-form"
    >
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        data-testid="forgot-password-email-input"
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={!email.trim()}
        data-testid="forgot-password-submit"
      >
        Send reset link
      </Button>
    </form>
  )
}

export default ForgotPasswordForm
