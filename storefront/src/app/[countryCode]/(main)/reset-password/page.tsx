import { Metadata } from "next"

import { Heading, Text } from "@medusajs/ui"
import ResetPasswordForm from "@modules/account/components/reset-password-form"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new Harlie's Pet Supply password.",
}

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{ token?: string; email?: string }>
}) {
  const { token, email } = await props.searchParams

  return (
    <div className="content-container py-12 small:py-16">
      <div className="max-w-md">
        <Heading level="h1" className="text-3xl font-bold mb-2">
          Choose a new password
        </Heading>
        {token && email ? (
          <>
            <Text className="text-ui-fg-subtle mb-8">
              Setting a new password for {email}.
            </Text>
            <ResetPasswordForm token={token} email={email} />
          </>
        ) : (
          <Text className="text-ui-fg-subtle">
            This link is incomplete.{" "}
            <LocalizedClientLink href="/forgot-password" className="underline">
              Request a new reset link
            </LocalizedClientLink>
            .
          </Text>
        )}
      </div>
    </div>
  )
}
