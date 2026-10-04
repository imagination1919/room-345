"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"

export const submitContactMessage = async ({
  name,
  email,
  phone,
  message,
}: {
  name: string
  email: string
  phone?: string
  message: string
}): Promise<void> => {
  await sdk.client
    .fetch("/store/contact", {
      method: "POST",
      body: { name, email, phone, message },
    })
    .catch(medusaError)
}
