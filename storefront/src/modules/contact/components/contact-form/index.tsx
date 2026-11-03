"use client"

import { Button, Textarea, toast } from "@medusajs/ui"
import { useState } from "react"
import type { FormEvent } from "react"

import Input from "@modules/common/components/input"
import { submitContactMessage } from "@lib/data/contact"

const ContactForm = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!name.trim() || !email.trim() || !message.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim(),
      })
      setIsSubmitted(true)
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    } catch (error: any) {
      toast.error(error?.message ?? "Could not send your message")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div
        className="rounded-rounded border border-ui-border-base bg-ui-bg-subtle p-6"
        data-testid="contact-form-success"
      >
        <p className="txt-compact-medium-plus text-ui-fg-base">
          Thanks for reaching out!
        </p>
        <p className="text-ui-fg-subtle mt-1">
          We've received your message and will get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-4 max-w-md"
      data-testid="contact-form"
    >
      <Input
        label="Name"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        data-testid="contact-name-input"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        data-testid="contact-email-input"
      />
      <Input
        label="Phone (optional)"
        name="phone"
        type="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        data-testid="contact-phone-input"
      />
      <Textarea
        placeholder="How can we help?"
        name="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={5}
        required
        data-testid="contact-message-input"
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={!name.trim() || !email.trim() || !message.trim()}
        data-testid="contact-submit"
      >
        Send message
      </Button>
    </form>
  )
}

export default ContactForm
