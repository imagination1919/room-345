"use server"

import { cookies as nextCookies, headers as nextHeaders } from "next/headers"
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
  const headerList = await nextHeaders()

  // NODE_ENV is always "production" under `next start`, so it can't tell us
  // whether the request actually arrived over TLS. A `Secure` cookie set on
  // a plain-HTTP connection is silently dropped by the browser, which broke
  // the age gate on HTTP-only deployments. x-forwarded-proto (set by the
  // reverse proxy) reflects the real connection.
  const isHttps = headerList.get("x-forwarded-proto") === "https"

  cookieStore.set(AGE_VERIFIED_COOKIE, "true", {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
  })

  redirect(safeRedirectPath(formData.get("redirect")))
}

export async function declineAge() {
  redirect("https://www.google.com")
}
