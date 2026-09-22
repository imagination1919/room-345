import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CONTACT_MODULE } from "../../modules/contact"
import ContactModuleService from "../../modules/contact/service"

type WorkflowInput = {
  id: string
}

const markContactMessageReadStep = createStep(
  "mark-contact-message-read",
  async (input: WorkflowInput, { container }) => {
    const contactModuleService: ContactModuleService =
      container.resolve(CONTACT_MODULE)

    const previous = await contactModuleService.retrieveContactMessage(input.id)

    const contactMessage = await contactModuleService.updateContactMessages({
      id: input.id,
      read_at: previous.read_at ?? new Date(),
    })

    return new StepResponse(contactMessage, {
      id: input.id,
      read_at: previous.read_at,
    })
  },
  async (
    compensateInput: { id: string; read_at: Date | null } | undefined,
    { container }
  ) => {
    if (!compensateInput) return
    const contactModuleService: ContactModuleService =
      container.resolve(CONTACT_MODULE)
    await contactModuleService.updateContactMessages(compensateInput)
  }
)

const markContactMessageReadWorkflow = createWorkflow(
  "mark-contact-message-read",
  (input: WorkflowInput) => {
    const contactMessage = markContactMessageReadStep(input)
    return new WorkflowResponse(contactMessage)
  }
)

export default markContactMessageReadWorkflow
