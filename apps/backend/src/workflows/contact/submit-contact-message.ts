import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"
import { CONTACT_MODULE } from "../../modules/contact"
import ContactModuleService from "../../modules/contact/service"

type WorkflowInput = {
  name: string
  email: string
  phone?: string
  message: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const submitContactMessageStep = createStep(
  "submit-contact-message",
  async (input: WorkflowInput, { container }) => {
    const contactModuleService: ContactModuleService =
      container.resolve(CONTACT_MODULE)

    if (!input.name.trim() || !input.message.trim()) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Name and message are required."
      )
    }
    if (!EMAIL_RE.test(input.email)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "A valid email is required."
      )
    }

    const contactMessage = await contactModuleService.createContactMessages({
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || null,
      message: input.message.trim(),
    })

    return new StepResponse(contactMessage, contactMessage.id)
  },
  async (id: string | undefined, { container }) => {
    if (!id) return
    const contactModuleService: ContactModuleService =
      container.resolve(CONTACT_MODULE)
    await contactModuleService.deleteContactMessages(id)
  }
)

const submitContactMessageWorkflow = createWorkflow(
  "submit-contact-message",
  (input: WorkflowInput) => {
    const contactMessage = submitContactMessageStep(input)
    return new WorkflowResponse(contactMessage)
  }
)

export default submitContactMessageWorkflow
