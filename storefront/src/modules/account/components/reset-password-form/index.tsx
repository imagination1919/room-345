"use client"

import { Button, toast } from "@medusajs/ui"
import { useState } from "react"
import type { FormEvent } from "react"

import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { resetPassword } from "@lib/data/password-reset"

const MIN_PASSWORD_LENGTH = 8

const ResetPasswordForm = ({
  token,
  email,
}: {
  token: string
  email: string
}) => {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }
    if (password !== confirm) {
      setError("The passwords don't match.")
      return
    }

    setIsSubmitting(true)
    try {
      await resetPassword({ token, email, password })
      setIsDone(true)
    } catch (err: any) {
      toast.error(
        "This reset link is invalid or has expired. Request a new one and try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isDone) {
    return (
      <div
        className="rounded-rounded border border-ui-border-base bg-ui-bg-subtle p-6"
        data-testid="reset-password-success"
      >
        <p className="txt-compact-medium-plus text-ui-fg-base">
          Your password has been updated
        </p>
        <p className="text-ui-fg-subtle mt-1">
          <LocalizedClientLink href="/account" className="underline">
            Sign in
          </LocalizedClientLink>{" "}
          with your new password.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-4 max-w-md"
      data-testid="reset-password-form"
    >
      <Input
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        data-testid="reset-password-input"
      />
      <Input
        label="Confirm new password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(event) => setConfirm(event.target.value)}
        required
        data-testid="reset-password-confirm-input"
      />
      {error && (
        <p className="text-rose-500 text-small-regular" role="alert">
          {error}
        </p>
      )}
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={!password || !confirm}
        data-testid="reset-password-submit"
      >
        Update password
      </Button>
    </form>
  )
}

export default ResetPasswordForm
