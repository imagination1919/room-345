import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function PromoBanner() {
  return (
    <div className="content-container py-12 small:py-16">
      <div className="grid grid-cols-1 small:grid-cols-2 rounded-large overflow-hidden border border-ui-border-base">
        <div className="relative aspect-[4/3] small:aspect-auto bg-mist">
          <Image
            src="/promo-banner.jpg"
            alt="A border collie in a grass field with a frisbee and tennis ball"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="relative bg-cream px-8 py-10 small:px-12 small:py-14 flex flex-col justify-center gap-4">
          {/* decorative accents — hand-drawn, no photo dependency */}
          <svg
            className="absolute top-6 right-8 opacity-80"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden
          >
            <circle cx="20" cy="20" r="7" fill="#E3A93B" />
            <g stroke="#E3A93B" strokeWidth="2" strokeLinecap="round">
              <path d="M20 2v6M20 32v6M2 20h6M32 20h6" />
              <path d="M7 7l4.2 4.2M28.8 28.8L33 33M33 7l-4.2 4.2M11.2 28.8L7 33" />
            </g>
          </svg>
          <svg
            className="absolute bottom-6 right-16 opacity-60"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="#3F8354"
            aria-hidden
          >
            <ellipse cx="13" cy="17" rx="7" ry="5.5" />
            <circle cx="4.5" cy="9" r="2.6" />
            <circle cx="13" cy="5.5" r="3" />
            <circle cx="21.5" cy="9" r="2.6" />
          </svg>

          <span className="w-fit rounded-circle bg-forest/10 px-3 py-1 txt-compact-small-plus text-forest uppercase tracking-wide">
            Gear up for
          </span>
          <p className="font-script text-forest text-5xl leading-none">
            Outdoor Adventures
          </p>
          <p className="text-ui-fg-subtle text-large-regular max-w-md">
            From durable toys to comfy beds, we have everything your pet
            needs to explore, play and be their happiest self.
          </p>
          <div className="pt-2">
            <LocalizedClientLink
              href="/categories/travel-carriers"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 txt-compact-large-plus text-paper transition-[filter] hover:brightness-110"
            >
              Shop Outdoor Essentials
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
