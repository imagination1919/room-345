import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Figtree, Fredoka, Caveat } from "next/font/google"
import "styles/globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
})

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
})

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-caveat",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Fetch Pet Supply",
    template: "%s | Fetch Pet Supply",
  },
  description:
    "Fetch Pet Supply — thoughtfully made food, gear and comfy things for dogs and cats.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${figtree.variable} ${fredoka.variable} ${caveat.variable}`}
    >
      <body className="font-sans antialiased bg-ui-bg-base text-ui-fg-base">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
