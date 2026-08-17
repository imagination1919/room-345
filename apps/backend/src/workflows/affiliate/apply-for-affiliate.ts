import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { AFFILIATE_MODULE } from "../../modules/affiliate"
import AffiliateModuleService from "../../modules/affiliate/service"

type WorkflowInput = {
  customer_id: string
  display_name: string
  age_confirmed: boolean
  notes?: string
}

const applyForAffiliateStep = createStep(
  "apply-for-affiliate",
  async (input: WorkflowInput, { container }) => {
    const affiliateModuleService: AffiliateModuleService =
      container.resolve(AFFILIATE_MODULE)

    const existing = await affiliateModuleService.listAffiliates({
      customer_id: input.customer_id,
    })
    if (existing.length > 0) {
      throw new Error("An affiliate application already exists for this customer.")
    }

    if (!input.age_confirmed) {
      throw new Error("Age/eligibility confirmation is required to apply.")
    }

    // Retry code generation on the rare unique-constraint collision
    let affiliate
    for (let attempt = 0; attempt < 3; attempt++) {
      const referral_code = affiliateModuleService.generateReferralCode(
        input.display_name
      )
      try {
        affiliate = await affiliateModuleService.createAffiliates({
          customer_id: input.customer_id,
          display_name: input.display_name,
          referral_code,
          age_confirmed: input.age_confirmed,
          notes: input.notes ?? null,
          status: "pending",
          applied_at: new Date(),
        })
        break
      } catch (err) {
        if (attempt === 2) throw err
      }
    }

    return new StepResponse(affiliate, affiliate!.id)
  },
  async (affiliateId: string | undefined, { container }) => {
    if (!affiliateId) return
    const affiliateModuleService: AffiliateModuleService =
      container.resolve(AFFILIATE_MODULE)
    await affiliateModuleService.deleteAffiliates(affiliateId)
  }
)

const applyForAffiliateWorkflow = createWorkflow(
  "apply-for-affiliate",
  (input: WorkflowInput) => {
    const affiliate = applyForAffiliateStep(input)
    return new WorkflowResponse(affiliate)
  }
)

export default applyForAffiliateWorkflow
