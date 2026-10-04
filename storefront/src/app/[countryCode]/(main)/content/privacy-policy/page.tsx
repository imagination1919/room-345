import { Metadata } from "next"

import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Harlie's Pet Supply collects, uses and protects your information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="content-container py-12 small:py-16">
      <div className="max-w-2xl flex flex-col gap-4 text-ui-fg-base">
        <Heading level="h1" className="text-3xl font-bold">
          Harlie Pet Supply Privacy Policy
        </Heading>
        <h2 className="text-xl font-semibold mt-8 mb-3">Introduction</h2>
        <p><strong>Effective date:</strong> October 1, 2026</p>
        <p>Harlie Pet Supply (&quot;Harlie Pet Supply,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a business of TrueWalker LLC. We operate the website harliepetsupply.com (the &quot;Site&quot;). This Privacy Policy explains what personal information we collect when you visit the Site or place an order, how we use it, who we share it with, and the choices you have.</p>
        <p>We collect only the information we need to take your payment, process your order, and ship it to you. <strong>We do not sell your personal information, your purchase history, or our customer list to anyone.</strong></p>
        <p>By using the Site or placing an order, you agree to the practices described in this policy.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Information we collect</h2>
        <p>When you place an order, we collect:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li><strong>Contact details:</strong> your name, email address, and phone number</li>
          <li><strong>Billing and shipping addresses</strong></li>
          <li><strong>Order details:</strong> the products you buy, quantities, prices, order date, and any notes you add at checkout</li>
          <li><strong>Messages you send us:</strong> for example, questions about an order, a return, or a shipping problem</li>
        </ul>
        <p><strong>Payment card information.</strong> Card payments are processed by Stripe. Your full card number, expiration date, and security code are entered into Stripe&apos;s secure payment form and go directly to Stripe. We never see or store your full card number. We receive limited payment details from Stripe, such as the card type, the last four digits, and whether the payment succeeded.</p>
        <p><strong>Information collected automatically.</strong> Like most websites, our Site and its hosting provider may automatically record basic technical information when you visit. This includes your IP address, browser type, device type, and the pages you view. Stripe also collects device and browser information during checkout to help detect fraud.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">How we use your information</h2>
        <p>We use your information only to run our store and fill your orders:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>To process your payment</li>
          <li>To place your order with our supplier and get it shipped to you</li>
          <li>To send order confirmations, shipping updates, and tracking information</li>
          <li>To answer your questions and handle returns, refunds, and order problems</li>
          <li>To prevent fraud and protect our customers and our business</li>
          <li>To keep the business records required for taxes and accounting, and to meet other legal obligations</li>
        </ul>
        <p>We will email you marketing messages only if you choose to sign up for them. You can unsubscribe at any time using the link in any marketing email.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">How we share your information</h2>
        <p><strong>We do not sell, rent, or trade your personal information, purchase history, or our customer list.</strong> We share information only with the companies that help us complete your order, and only what they need:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li><strong>Stripe (payment processing).</strong> Stripe processes your card payment on our behalf. Stripe may also use transaction and device information to detect and prevent fraud across its network, and to meet its own legal obligations. Stripe&apos;s handling of your information is described in the <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Stripe Privacy Policy</a>. If you choose to pay with Stripe&apos;s Link feature, Link&apos;s own terms also apply.</li>
          <li><strong>Our supplier and its shipping partners (order fulfillment).</strong> We buy the products we sell from TopDawg, a U.S. wholesale distributor. When you order, we send TopDawg your name, shipping address, phone number (if provided), and the items ordered. TopDawg passes these details to the warehouse or supplier that packs and ships your order. TopDawg&apos;s practices are described in the <a href="https://topdawg.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">TopDawg Privacy Policy</a>.</li>
          <li><strong>Shipping carriers.</strong> Your name, address, and phone number appear on the shipping label and are shared with the carrier (such as USPS, UPS, or FedEx) to deliver your package.</li>
          <li><strong>Website and email service providers.</strong> Companies that host our Site or send our order emails may store or handle your information for us. Our Site is hosted by RamNode and runs on our own store software built with Medusa.js. Our order emails are sent through SendGrid.</li>
          <li><strong>Legal reasons.</strong> We may disclose information if the law requires it, to respond to valid legal requests, or to protect the rights, property, or safety of our customers, our business, or others.</li>
          <li><strong>Business transfer.</strong> If Harlie Pet Supply is sold or merged, customer information may transfer to the new owner, who must continue to protect it under this policy.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-3">Cookies</h2>
        <p>Our Site uses cookies, which are small files stored by your browser. Cookies keep your shopping cart working, remember your session, and keep checkout secure. Stripe also uses cookies during checkout to help prevent fraud.</p>
        <p>We do not use analytics or advertising tools, and we do not use cookies for third-party advertising.</p>
        <p>You can block or delete cookies in your browser settings. If you block them, the cart and checkout may not work.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Data retention and security</h2>
        <p>We keep order and customer records only as long as we need them. That covers filling and supporting your order, handling returns and disputes, and meeting tax and accounting requirements. We keep these records for 3 years, unless the law requires us to keep them longer. After that, we delete the records or remove the personal details.</p>
        <p>Our Site uses encryption (HTTPS) to protect information you send us. Card payments are handled by Stripe, which is certified to the payment industry&apos;s security standard (PCI DSS), so card numbers never pass through or rest on our systems. No website or method of storage is 100% secure, but we take reasonable steps to protect your information.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Your rights and choices</h2>
        <p>You can contact us at any time to:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Ask what personal information we have about you</li>
          <li>Correct information that is wrong or out of date</li>
          <li>Ask us to delete your information. We may need to keep some records, such as order and tax records, where the law requires it.</li>
          <li>Unsubscribe from marketing emails. You will still receive emails about orders you place.</li>
        </ul>
        <p>Depending on your state, you may have additional privacy rights, such as the right to opt out of the sale of your data or of targeted advertising. We do not sell personal information or use it for targeted advertising, so there is nothing to opt out of. We will not treat you differently for using any of your privacy rights.</p>
        <p>To make a request, email us at the address below. We may ask you to confirm your identity, such as by writing from the email address on your order. We will respond within 45 days.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Children&apos;s privacy</h2>
        <p>Our Site is not directed to children under 13, and we do not knowingly collect their personal information. If you believe a child has given us information, contact us and we will delete it.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Changes to this policy</h2>
        <p>We may update this policy from time to time. When we do, we will post the new version on this page and change the effective date at the top.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Contact us</h2>
        <p>If you have questions about this policy or your information, contact us:</p>
        <address className="not-italic flex flex-col gap-1">
          <span>Harlie Pet Supply</span>
          <span>Email: <a href="mailto:help.me@harliepetsupply.com" className="underline">help.me@harliepetsupply.com</a></span>
          <span>Mailing address: TrueWalker LLC, 3325 Washburn Ave, Ste 207, Charlotte, NC 28205</span>
          <span>Website: harliepetsupply.com</span>
        </address>
      </div>
    </div>
  )
}
