import ContactModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CONTACT_MODULE = "contact"

export default Module(CONTACT_MODULE, {
  service: ContactModuleService,
})
