import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { AFFILIATE_MODULE } from "../../modules/affiliate"
import AffiliateModuleService from "../../modules/affiliate/service"

type WorkflowInput = {
  referral_code: string
  order_id: string
  order_total: number
  currency_code: string
}

const recordAffiliateCommissionStep = createStep(
  "record-affiliate-commission",
  async (input: WorkflowInput, { container }) => {
    const affiliateModuleService: AffiliateModuleService =
      container.resolve(AFFILIATE_MODULE)

    const [affiliate] = await affiliateModuleService.listAffiliates({
      referral_code: input.referral_code,
      status: "approved",
    })

    if (!affiliate) {
      // Unknown or unapproved code — leave for fraud review, don't throw
      // and roll back order placement over a bad/expired referral code.
      console.warn(
        `Affiliate attribution skipped: unknown or unapproved code "${input.referral_code}" on order ${input.order_id}`
      )
      return new StepResponse(null)
    }

    const amount =
      Math.round(input.order_total * affiliate.commission_rate * 100) / 100

    const commission = await affiliateModuleService.createAffiliateCommissions({
      affiliate: affiliate.id,
      order_id: input.order_id,
      order_total: input.order_total,
      amount,
      currency_code: input.currency_code,
      rate_applied: affiliate.commission_rate,
      attribution_source: "code",
      status: "pending",
    })

    return new StepResponse(commission, commission.id)
  },
  async (commissionId, { container }) => {
    if (!commissionId) return
    const affiliateModuleService: AffiliateModuleService =
      container.resolve(AFFILIATE_MODULE)
    await affiliateModuleService.deleteAffiliateCommissions(commissionId)
  }
)

const recordAffiliateCommissionWorkflow = createWorkflow(
  "record-affiliate-commission",
  (input: WorkflowInput) => {
    const commission = recordAffiliateCommissionStep(input)
    return new WorkflowResponse(commission)
  }
)

export default recordAffiliateCommissionWorkflow
