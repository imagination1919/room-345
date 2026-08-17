import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { AFFILIATE_MODULE } from "../../modules/affiliate"
import AffiliateModuleService from "../../modules/affiliate/service"

type WorkflowInput = {
  id: string
  status: "approved" | "rejected"
}

const updateAffiliateStatusStep = createStep(
  "update-affiliate-status",
  async (input: WorkflowInput, { container }) => {
    const affiliateModuleService: AffiliateModuleService =
      container.resolve(AFFILIATE_MODULE)

    const previous = await affiliateModuleService.retrieveAffiliate(input.id)

    const affiliate = await affiliateModuleService.updateAffiliates({
      id: input.id,
      status: input.status,
      approved_at: input.status === "approved" ? new Date() : previous.approved_at,
    })

    return new StepResponse(affiliate, {
      id: input.id,
      status: previous.status,
      approved_at: previous.approved_at,
    })
  },
  async (
    compensateInput:
      | {
          id: string
          status: "pending" | "approved" | "rejected" | "suspended"
          approved_at: Date | null
        }
      | undefined,
    { container }
  ) => {
    if (!compensateInput) return
    const affiliateModuleService: AffiliateModuleService =
      container.resolve(AFFILIATE_MODULE)
    await affiliateModuleService.updateAffiliates(compensateInput)
  }
)

const updateAffiliateStatusWorkflow = createWorkflow(
  "update-affiliate-status",
  (input: WorkflowInput) => {
    const affiliate = updateAffiliateStatusStep(input)
    return new WorkflowResponse(affiliate)
  }
)

export default updateAffiliateStatusWorkflow
