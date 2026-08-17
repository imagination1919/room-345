import { Container, Text } from "@medusajs/ui"

import { convertToLocale } from "@lib/util/money"
import type { StoreAffiliateMe } from "@lib/data/affiliates"
import AffiliateApplyForm from "@modules/affiliate/components/affiliate-apply-form"
import CopyReferralLink from "@modules/affiliate/components/copy-referral-link"

type Props = {
  data: StoreAffiliateMe | null
}

const formatAmount = (amount: number) =>
  convertToLocale({ amount, currency_code: "usd" })

const AffiliateDashboard = ({ data }: Props) => {
  if (!data) {
    return (
      <div data-testid="affiliate-dashboard-wrapper">
        <div className="mb-6">
          <h1 className="text-2xl-semi">Affiliate program</h1>
        </div>
        <AffiliateApplyForm />
      </div>
    )
  }

  const { affiliate, stats, referral_link } = data

  if (affiliate.status === "pending") {
    return (
      <div data-testid="affiliate-dashboard-wrapper">
        <div className="mb-6">
          <h1 className="text-2xl-semi">Affiliate program</h1>
        </div>
        <Container className="p-6">
          <Text className="text-ui-fg-subtle">
            Thanks, {affiliate.display_name} — your application is under
            review. We'll notify you once it's been approved.
          </Text>
        </Container>
      </div>
    )
  }

  if (affiliate.status !== "approved") {
    return (
      <div data-testid="affiliate-dashboard-wrapper">
        <div className="mb-6">
          <h1 className="text-2xl-semi">Affiliate program</h1>
        </div>
        <Container className="p-6">
          <Text className="text-ui-fg-subtle">
            Your affiliate account is currently{" "}
            <span className="font-semibold">{affiliate.status}</span>.
            Contact support if you believe this is a mistake.
          </Text>
        </Container>
      </div>
    )
  }

  return (
    <div data-testid="affiliate-dashboard-wrapper">
      <div className="mb-6">
        <h1 className="text-2xl-semi">Affiliate program</h1>
        <Text className="text-ui-fg-subtle">
          Welcome back, {affiliate.display_name}
        </Text>
      </div>

      <div className="flex flex-col gap-y-4 mb-8">
        <h3 className="text-large-semi">Your referral link</h3>
        <CopyReferralLink referralLink={referral_link} />
      </div>

      <div className="flex items-start gap-x-16 mb-8">
        <div className="flex flex-col gap-y-4">
          <h3 className="text-large-semi">Tier</h3>
          <span className="text-3xl-semi leading-none capitalize">
            {affiliate.tier}
          </span>
        </div>
        <div className="flex flex-col gap-y-4">
          <h3 className="text-large-semi">Commission rate</h3>
          <span className="text-3xl-semi leading-none">
            {Math.round(affiliate.commission_rate * 100)}%
          </span>
        </div>
        <div className="flex flex-col gap-y-4">
          <h3 className="text-large-semi">Referrals</h3>
          <span
            className="text-3xl-semi leading-none"
            data-testid="affiliate-total-referrals"
          >
            {stats.total_referrals}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <h3 className="text-large-semi">Commissions</h3>
        <div className="grid grid-cols-3 gap-4">
          <Container className="p-4 flex flex-col gap-y-1">
            <span className="uppercase text-base-regular text-ui-fg-subtle">
              Pending
            </span>
            <span
              className="text-xl-semi"
              data-testid="affiliate-pending-commission"
            >
              {formatAmount(stats.pending_commission)}
            </span>
          </Container>
          <Container className="p-4 flex flex-col gap-y-1">
            <span className="uppercase text-base-regular text-ui-fg-subtle">
              Payable
            </span>
            <span
              className="text-xl-semi"
              data-testid="affiliate-payable-commission"
            >
              {formatAmount(stats.payable_commission)}
            </span>
          </Container>
          <Container className="p-4 flex flex-col gap-y-1">
            <span className="uppercase text-base-regular text-ui-fg-subtle">
              Paid
            </span>
            <span
              className="text-xl-semi"
              data-testid="affiliate-paid-commission"
            >
              {formatAmount(stats.paid_commission)}
            </span>
          </Container>
        </div>
      </div>
    </div>
  )
}

export default AffiliateDashboard
