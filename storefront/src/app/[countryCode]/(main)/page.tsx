import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import CategoryGrid from "@modules/home/components/category-grid"
import BestSellers from "@modules/home/components/best-sellers"
import PromoBanner from "@modules/home/components/promo-banner"
import TrustBadges from "@modules/home/components/trust-badges"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  description:
    "Thoughtfully made food, gear and comfy things for dogs and cats — from Fetch Pet Supply.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <CategoryGrid />
      <BestSellers region={region} />
      <PromoBanner />
      <TrustBadges />
    </>
  )
}
