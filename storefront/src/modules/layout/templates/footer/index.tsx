import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-forest text-paper w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-8 xsmall:flex-row items-start justify-between py-16 small:py-20">
          <div className="flex flex-col gap-y-3">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus font-display text-paper hover:text-paper/80"
            >
              Fetch Pet Supply
            </LocalizedClientLink>
            <p className="txt-small text-paper/70 max-w-xs">
              Everything your best friend needs.
            </p>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus text-paper">Categories</span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-paper/70 txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-paper",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-paper"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus text-paper">Collections</span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-paper/70 txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-paper"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col small:flex-row gap-4 w-full py-6 border-t border-paper/20 justify-between text-paper/60">
          <p className="txt-compact-small">
            © {new Date().getFullYear()} Fetch Pet Supply. All rights
            reserved.
          </p>
          <div className="flex gap-x-6 txt-compact-small">
            <a href="#" className="hover:text-paper">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-paper">
              Terms of Service
            </a>
            <LocalizedClientLink href="/contact" className="hover:text-paper">
              Contact Us
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
