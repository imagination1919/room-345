import { Heading } from "@medusajs/ui"
import { ArrowUpRightMini } from "@medusajs/icons"
import Image from "next/image"

import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
          const previewImage = category.products?.[0]?.thumbnail

          return (
            <li key={category.id}>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="group flex flex-col overflow-hidden rounded-rounded border border-ui-border-base bg-paper shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-shadow"
                data-testid="category-card"
              >
                <div className="relative aspect-[4/3] w-full bg-mist">
                  {previewImage && (
                    <Image
                      src={previewImage}
                      alt={category.name}
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      fill
                    />
                  )}
                </div>
                <div className="flex items-center gap-3 px-4 py-3 text-paper bg-forest">
                  <p className="flex-1 min-w-0 txt-compact-medium-plus text-paper truncate">
                    {category.name}
                  </p>
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
