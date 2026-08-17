import { Metadata } from "next"
import { cookies } from "next/headers"
import { Button, Text } from "@medusajs/ui"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  const cookieStore = await cookies()
  const isAgeVerified = cookieStore.get("age_verified")?.value === "true"

  return (
    <>
      <Hero />
      <div className="py-12">
        {isAgeVerified ? (
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        ) : (
          <div className="content-container flex flex-col items-center text-center gap-y-4 py-12">
            <Text className="text-ui-fg-subtle">
              You must confirm you are 18 years of age or older to view our
              products.
            </Text>
            <LocalizedClientLink href={`/age-verify?redirect=/${countryCode}`}>
              <Button variant="primary">Enter Site</Button>
            </LocalizedClientLink>
          </div>
        )}
      </div>
    </>
  )
}
