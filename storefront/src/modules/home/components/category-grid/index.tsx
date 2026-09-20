import type { ReactElement } from "react"
import { Heading } from "@medusajs/ui"
import { ArrowUpRightMini } from "@medusajs/icons"

import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * The seed data sets no `description` on any category, so the descriptor
 * copy, accent color, and icon for each card are looked up locally by
 * handle rather than pulled from the API. Image slots fall back to an
 * icon-on-color tile until a category photo is sourced and approved.
 */
const CATEGORY_META: Record<
  string,
  {
    descriptor: string
    accent: "bg-forest" | "bg-gold" | "bg-denim"
    icon: ReactElement
  }
> = {
  "collars-leashes": {
    descriptor: "Comfy, stylish, built to last",
    accent: "bg-forest",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.6" />
        <rect x="10" y="3" width="4" height="3" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  beds: {
    descriptor: "A cozy spot to curl up",
    accent: "bg-denim",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 17v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M3 17v2M21 17v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M5 11V9a2 2 0 0 1 2-2h3v4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  blankets: {
    descriptor: "Snuggle-soft for nap time",
    accent: "bg-gold",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 2" />
      </svg>
    ),
  },
  "travel-carriers": {
    descriptor: "Ready for any adventure",
    accent: "bg-forest",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="8" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
}

export default async function CategoryGrid() {
  const categories = (await listCategories()).filter(
    (category) => !category.parent_category
  )

  if (!categories.length) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-16">
      <Heading level="h2" className="text-2xl-semi text-ui-fg-base mb-8">
        Shop by category
      </Heading>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-6">
        {categories.map((category) => {
          const meta = CATEGORY_META[category.handle] ?? {
            descriptor: "Everything they need",
            accent: "bg-forest" as const,
            icon: null,
          }

          return (
            <li key={category.id}>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="group flex flex-col overflow-hidden rounded-rounded border border-ui-border-base bg-paper shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-shadow"
                data-testid="category-card"
              >
                <div className="relative aspect-[4/3] w-full bg-mist flex items-center justify-center text-forest/40">
                  <span className="scale-[2.4]">{meta.icon}</span>
                </div>
                <div
                  className={`flex items-center gap-3 px-4 py-3 text-paper ${meta.accent}`}
                >
                  <span aria-hidden className="flex-none">
                    {meta.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="txt-compact-medium-plus text-paper truncate">
                      {category.name}
                    </p>
                    <p className="txt-compact-small text-paper/80 truncate">
                      {meta.descriptor}
                    </p>
                  </div>
                  <ArrowUpRightMini className="flex-none group-hover:translate-x-0.5 transition-transform" />
                </div>
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
