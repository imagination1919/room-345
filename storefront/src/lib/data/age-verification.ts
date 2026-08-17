"use server"

import { cookies as nextCookies } from "next/headers"
import { redirect } from "next/navigation"

const AGE_VERIFIED_COOKIE = "age_verified"

function safeRedirectPath(path: FormDataEntryValue | null): string {
  if (
    typeof path !== "string" ||
    !path.startsWith("/") ||
    path.startsWith("//")
  ) {
    return "/"
  }

  return path
}

export async function confirmAge(formData: FormData) {
  const cookieStore = await nextCookies()

  cookieStore.set(AGE_VERIFIED_COOKIE, "true", {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  redirect(safeRedirectPath(formData.get("redirect")))
}

export async function declineAge() {
  redirect("https://www.google.com")
}
