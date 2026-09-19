import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Figtree, Quicksand } from "next/font/google"
import "styles/globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
})

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Fetch & Co.",
    template: "%s | Fetch & Co.",
  },
  description:
    "Fetch & Co. — thoughtfully made food, gear and comfy things for dogs and cats.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${figtree.variable} ${quicksand.variable}`}
    >
      <body className="font-sans antialiased bg-ui-bg-base text-ui-fg-base">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
