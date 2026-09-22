import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listCategories } from "@lib/data/categories"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCategories(),
  ])

  const topLevelCategories = categories.filter(
    (category) => !category.parent_category
  )

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative min-h-16 mx-auto border-b duration-200 bg-forest border-forest-deep">
        <nav className="content-container txt-xsmall-plus text-paper flex items-center justify-between w-full min-h-16 py-3 gap-4 text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                categories={topLevelCategories}
              />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <LocalizedClientLink
              href="/"
              className="font-display font-semibold text-center leading-snug text-lg xsmall:text-xl small:text-2xl medium:text-3xl whitespace-nowrap hover:opacity-80"
              data-testid="nav-store-link"
            >
              Fetch Pet Supply
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:opacity-80"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:opacity-80 flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
