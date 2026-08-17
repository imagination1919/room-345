import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveCustomer } from "@lib/data/customer"
import { getMyAffiliate } from "@lib/data/affiliates"
import AffiliateDashboard from "@modules/affiliate/templates/affiliate-dashboard"

export const metadata: Metadata = {
  title: "Affiliate program",
  description: "Apply to the affiliate program and track your referrals",
}

export default async function Affiliate() {
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  const data = await getMyAffiliate()

  return (
    <div className="w-full" data-testid="affiliate-page-wrapper">
      <AffiliateDashboard data={data} />
    </div>
  )
}
