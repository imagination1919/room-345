import { Metadata } from "next"

import { Heading, Text } from "@medusajs/ui"
import ForgotPasswordForm from "@modules/account/components/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a link to reset your Harlie's Pet Supply password.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="content-container py-12 small:py-16">
      <div className="max-w-md">
        <Heading level="h1" className="text-3xl font-bold mb-2">
          Forgot your password?
        </Heading>
        <Text className="text-ui-fg-subtle mb-8">
          Enter the email you signed up with and we&apos;ll send you a link to
          choose a new one.
        </Text>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
