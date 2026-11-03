import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import HeroSlideshow from "./hero-slideshow"

const Hero = () => {
  return (
    <div className="relative w-full border-b border-ui-border-base bg-ui-bg-base overflow-hidden">
      <div className="content-container grid grid-cols-1 small:grid-cols-2 gap-8 small:gap-12 items-center py-16 small:py-24">
        <div className="flex flex-col gap-6 max-w-xl">
          <Image
            src="/harlies-pet-supply-logo.jpg"
            alt="Harlie's Pet Supply — for your best friend"
            width={1024}
            height={1024}
            priority
            className="w-full max-w-sm"
          />
          <div className="pt-2">
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 txt-compact-large-plus text-ink transition-[filter] hover:brightness-95"
              data-testid="hero-shop-all-link"
            >
              Shop all
            </LocalizedClientLink>
          </div>
        </div>

        <HeroSlideshow />
      </div>
    </div>
  )
}

export default Hero
