"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"

export const requestPasswordReset = async (email: string): Promise<void> => {
  await sdk.auth
    .resetPassword("customer", "emailpass", { identifier: email })
    .catch(medusaError)
}

export const resetPassword = async ({
  token,
  email,
  password,
}: {
  token: string
  email: string
  password: string
}): Promise<void> => {
  await sdk.auth
    .updateProvider("customer", "emailpass", { email, password }, token)
    .catch(medusaError)
}
