import { Metadata } from "next"

import { Heading, Text } from "@medusajs/ui"
import ContactForm from "@modules/contact/components/contact-form"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Fetch Pet Supply.",
}

export default function ContactPage() {
  return (
    <div className="content-container py-12 small:py-16">
      <div className="max-w-md">
        <Heading level="h1" className="text-3xl font-bold mb-2">
          Contact Us
        </Heading>
        <Text className="text-ui-fg-subtle mb-8">
          Questions about an order, a product, or anything else? Send us a
          message and we'll get back to you.
        </Text>
        <ContactForm />
      </div>
    </div>
  )
}
