import Image from "next/image"
import { Text } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative overflow-hidden">
      <Image
        src="/hero-door.png"
        alt="Room 345 — a softly lit hotel room door, numbered 345"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
      <div className="absolute inset-0 z-10 flex flex-col justify-end items-center text-center small:p-32 p-6 pb-16 gap-6">
        <div className="border border-ui-border-interactive rounded-rounded px-4 py-2 max-w-md bg-charcoal/60 backdrop-blur-sm">
          <Text className="text-ui-fg-interactive txt-small-plus uppercase">
            18+ only
          </Text>
          <Text className="text-ui-fg-subtle txt-small">
            Room 345 features adult-oriented apparel and novelty items and
            is intended for visitors 18 years of age or older.
          </Text>
        </div>
      </div>
    </div>
  )
}

export default Hero
