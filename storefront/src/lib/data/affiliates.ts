"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { revalidateTag } from "next/cache"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"

export type AffiliateStatus = "pending" | "approved" | "rejected" | "suspended"

export type StoreAffiliateSummary = {
  display_name: string
  referral_code: string
  tier: string
  commission_rate: number
  status: AffiliateStatus
}

export type StoreAffiliateStats = {
  total_referrals: number
  pending_commission: number
  payable_commission: number
  paid_commission: number
}

export type StoreAffiliateMe = {
  affiliate: StoreAffiliateSummary
  stats: StoreAffiliateStats
  referral_link: string
}

export const applyForAffiliate = async ({
  display_name,
  age_confirmed,
  notes,
}: {
  display_name: string
  age_confirmed: boolean
  notes?: string
}): Promise<void> => {
  const headers = { ...(await getAuthHeaders()) }

  await sdk.client
    .fetch("/store/affiliates/apply", {
      method: "POST",
      headers,
      body: { display_name, age_confirmed, notes },
    })
    .catch(medusaError)

  const cacheTag = await getCacheTag("affiliates")
  revalidateTag(cacheTag)
}

export const getMyAffiliate = async (): Promise<StoreAffiliateMe | null> => {
  const headers = { ...(await getAuthHeaders()) }
  // Unlike most cached storefront reads, this resource's most important
  // state transition (pending -> approved) happens from the admin app,
  // which has no way to call this storefront's revalidateTag. A short
  // revalidate window (on top of the usual cache tag) keeps approvals
  // from being invisible until some unrelated write happens to bust it.
  const next = { ...(await getCacheOptions("affiliates")), revalidate: 30 }

  return sdk.client
    .fetch<StoreAffiliateMe>("/store/affiliates/me", {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })
    .catch(() => null)
}
