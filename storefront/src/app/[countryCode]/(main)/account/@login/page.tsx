import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Harlie's Pet Supply account.",
}

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ redirect_to?: string }>
}) {
  const { redirect_to } = await searchParams

  return <LoginTemplate redirectTo={redirect_to} />
}
