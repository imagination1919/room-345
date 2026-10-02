import { MedusaService } from "@medusajs/framework/utils"
import ContactMessage from "./models/contact-message"

class ContactModuleService extends MedusaService({
  ContactMessage,
}) {}

export default ContactModuleService
