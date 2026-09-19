import Image from "next/image"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="relative w-full border-b border-ui-border-base bg-ui-bg-base overflow-hidden">
      <div className="content-container grid grid-cols-1 small:grid-cols-2 gap-8 small:gap-12 items-center py-16 small:py-24">
        <div className="flex flex-col gap-6 max-w-xl">
          <span className="w-fit rounded-circle bg-ui-bg-highlight px-3 py-1 txt-compact-small-plus text-ui-fg-interactive">
            New in — treats, toys &amp; travel gear
          </span>
          <Heading
            level="h1"
            className="text-3xl-semi small:text-[44px] small:leading-[52px] text-ui-fg-base"
          >
            Everything your best friend needs
          </Heading>
          <Text className="text-ui-fg-subtle text-large-regular">
            Thoughtfully made food, gear and comfy things for dogs and cats —
            picked by people who&apos;d do anything for a wagging tail.
          </Text>
          <div className="pt-2">
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center justify-center rounded-large bg-sunny px-6 py-3 txt-compact-large-plus text-ink transition-[filter] hover:brightness-95"
              data-testid="hero-shop-all-link"
            >
              Shop all
            </LocalizedClientLink>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full">
          <Image
            src="/hero-fetch.svg"
            alt="Illustrated dog and cat surrounded by paw prints"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
