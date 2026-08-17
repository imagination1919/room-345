import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  // RTA (Restricted to Adults) label — recognized by parental-control
  // software so this adult-oriented storefront can be auto-filtered.
  other: {
    rating: "RTA-5042-1996-1400-1577-RTA",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className="bg-ui-bg-base text-ui-fg-base">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
