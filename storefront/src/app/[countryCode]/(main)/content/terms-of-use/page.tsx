import { Metadata } from "next"

import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply to using Harlie's Pet Supply and placing an order.",
}

export default function TermsOfUsePage() {
  return (
    <div className="content-container py-12 small:py-16">
      <div className="max-w-2xl flex flex-col gap-4 text-ui-fg-base">
        <Heading level="h1" className="text-3xl font-bold">
          Harlie Pet Supply Terms &amp; Conditions
        </Heading>
        <h2 className="text-xl font-semibold mt-8 mb-3">About these terms</h2>
        <p><strong>Effective date:</strong> October 1, 2026</p>
        <p>These Terms &amp; Conditions (&quot;Terms&quot;) apply to your use of harliepetsupply.com (the &quot;Site&quot;) and to any order you place on it. The Site is run by Harlie Pet Supply, a business of TrueWalker LLC (&quot;Harlie Pet Supply,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).</p>
        <p>By using the Site or placing an order, you agree to these Terms and to our <LocalizedClientLink href="/content/privacy-policy" className="underline">Privacy Policy</LocalizedClientLink>. If you do not agree, please do not use the Site.</p>
        <p>You must be at least 18 years old, or have a parent or guardian&apos;s permission, to place an order.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Products, prices, and orders</h2>
        <p><strong>Products.</strong> Everything we sell is brand new. Our products come from independent U.S. suppliers, which ship most orders directly to you. Product photos, descriptions, and specifications come from those suppliers and manufacturers. We work to keep them accurate, but colors, sizes, and packaging may differ slightly from what you see on the Site.</p>
        <p><strong>Prices.</strong> Prices are in U.S. dollars and can change without notice. If a price or product detail on the Site is wrong, we may correct it. If you&apos;ve already ordered at the wrong price, we will contact you before we ship, and you can choose whether to continue.</p>
        <p><strong>Availability.</strong> Our suppliers&apos; stock changes often. If an item turns out to be unavailable after you order, we will let you know and refund you for that item.</p>
        <p><strong>Order acceptance.</strong> Your order confirmation email means we received your order, not that we accepted it. We may decline or cancel any order, for example if an item is out of stock, a price was listed in error, or we suspect fraud. If we cancel an order you&apos;ve already paid for, we will refund you in full.</p>
        <p><strong>Cancelling an order.</strong> Orders are sent to our suppliers quickly, so to cancel, contact us as soon as possible. We can cancel an order only if the supplier has not started processing it. Once it has, we can&apos;t cancel it, but you may be able to return it under our return policy below.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Payment</h2>
        <p>We accept payment through Stripe, a PCI DSS–certified payment processor. Card details are entered directly into Stripe&apos;s secure checkout. We never see or store your full card number. Your card is charged when you place your order.</p>
        <p>By placing an order, you confirm that you are authorized to use the payment method you provide.</p>
        <p><strong>Taxes.</strong> Sales tax is added at checkout where required by law.</p>
        <p><strong>Payment disputes.</strong> If there is a problem with a charge, please contact us first. Most issues can be resolved faster that way than through a dispute with your bank. Filing a dispute does not change your rights under these Terms.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Shipping and delivery</h2>
        <p><strong>Where we ship.</strong> We ship to addresses in the United States.</p>
        <p><strong>How orders ship.</strong> Orders are packed and shipped directly from our suppliers&apos; U.S. warehouses using carriers such as USPS, UPS, and FedEx. If you order items from different suppliers, they may arrive in separate packages on different days.</p>
        <p><strong>Timing.</strong> Orders usually leave the warehouse within 2 business days. Delivery typically takes 2–5 business days after that. All delivery times are estimates, not guarantees. If you need something by a certain date, please order early.</p>
        <p><strong>Shipping charges.</strong> Shipping costs are shown at checkout before you pay.</p>
        <p><strong>Tracking.</strong> We will email you tracking information once your order ships.</p>
        <p><strong>Address errors.</strong> Please double-check your shipping address. We are not responsible for orders sent to an address entered incorrectly at checkout. If a package comes back to us because of an incorrect address, we may charge the cost of reshipping.</p>
        <p><strong>Lost or late packages.</strong> If your package hasn&apos;t arrived within 30 days of your order date, contact us. Missing packages must be reported within 45 days of your order date so we can file a claim with our supplier and the carrier. We will then help resolve the issue with a replacement or refund.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Returns and refunds</h2>
        <p><strong>Damaged, defective, or wrong items.</strong> If your order arrives damaged or defective, or you receive the wrong item, email us within 7 days of delivery. Include your order number and photos of the item and packaging. We will send a replacement or a full refund, including original shipping, at no cost to you.</p>
        <p><strong>Other returns.</strong> Each product&apos;s return window is set by its supplier and shown on the product page. Some items cannot be returned, and the product page will say so. Returnable items must be:</p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Returned within the window shown on the product page</li>
          <li>Unused, in new condition, and in the original packaging</li>
          <li>Sent back only after you receive a Return Authorization (RMA) number from us</li>
        </ul>
        <p><strong>How to return an item.</strong> Email us with your order number and the item you want to return. If it qualifies, we will send you an RMA number and the return address. Returns sent without an RMA number will be refused and cannot be refunded.</p>
        <p><strong>Return costs.</strong> For returns that are not our error, you pay the return shipping. Some suppliers charge a restocking fee, which will be shown on the product page and deducted from your refund. Original shipping charges are not refunded.</p>
        <p><strong>Refunds.</strong> Once the supplier receives and inspects your return, we will refund the approved amount to your original payment method. Refunds are usually processed within 5 business days after approval. Your bank may take another 5–10 business days to post it.</p>
        <p><strong>Refused or undeliverable packages.</strong> If you refuse a delivery or a package is returned as undeliverable, we will refund the item price once the supplier receives it. Shipping costs and any restocking fees will be deducted from the refund.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Product use and safety</h2>
        <p>Please follow the manufacturer&apos;s instructions, size guidance, and warnings for every product. Supervise your pet with new toys, chews, and accessories, and stop using any product that becomes damaged. Product information on the Site is general and is not veterinary advice. Ask your veterinarian about your pet&apos;s diet, health, or medical needs.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Warranties</h2>
        <p>Manufacturer warranties, where offered, come from the manufacturer, not from Harlie Pet Supply. We will help you contact the manufacturer when we can.</p>
        <p>Except for the commitments in these Terms and any warranty that cannot be excluded by law, products and the Site are provided &quot;as is&quot; and &quot;as available.&quot; To the extent the law allows, we disclaim all other warranties, including implied warranties of merchantability and fitness for a particular purpose. Some states don&apos;t allow these disclaimers, so they may not apply to you.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Limitation of liability</h2>
        <p>To the fullest extent the law allows, Harlie Pet Supply and TrueWalker LLC are not liable for indirect, incidental, special, or consequential damages arising from your use of the Site or any product. Our total liability for any claim related to an order will not exceed the amount you paid for that order.</p>
        <p>Nothing in these Terms limits liability that cannot be limited by law.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Indemnity</h2>
        <p>You agree to cover any claims, losses, or costs, including reasonable legal fees, that result from your misuse of the Site or your violation of these Terms.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Using the Site</h2>
        <p>You agree not to misuse the Site. That means not placing fraudulent orders, attempting to access systems or data you aren&apos;t authorized to reach, scraping or copying the Site with automated tools, or interfering with how the Site works. We may refuse service or cancel orders for anyone who breaks these Terms.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Intellectual property</h2>
        <p>The Harlie Pet Supply name, logo, and Site design belong to TrueWalker LLC. Product names, images, and brands belong to their respective owners. You may not copy or reuse content from the Site for commercial purposes without our written permission.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Promotions</h2>
        <p>Discount codes and promotions have the terms stated when they are offered. Unless stated otherwise, they cannot be combined, have no cash value, and may end at any time.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Governing law and disputes</h2>
        <p>These Terms are governed by the laws of the State of North Carolina, without regard to conflict-of-law rules. If you have a problem with an order, please contact us first so we can try to resolve it. Any dispute not resolved informally will be handled in the state or federal courts located in Mecklenburg County, North Carolina. Either party may instead bring a claim in small claims court if it qualifies.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Changes to these Terms</h2>
        <p>We may update these Terms from time to time. Changes take effect when posted on this page with a new effective date. The Terms in effect when you place an order apply to that order.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">General</h2>
        <p>If any part of these Terms is found unenforceable, the rest stays in effect. If we don&apos;t enforce a provision right away, we don&apos;t give up the right to enforce it later. These Terms and our Privacy Policy are the entire agreement between you and us about your use of the Site.</p>
        <h2 className="text-xl font-semibold mt-8 mb-3">Contact us</h2>
        <p>Questions about an order, a return, or these Terms? Contact us:</p>
        <address className="not-italic flex flex-col gap-1">
          <span>Harlie Pet Supply (TrueWalker LLC)</span>
          <span>Email: <a href="mailto:help.me@harliepetsupply.com" className="underline">help.me@harliepetsupply.com</a></span>
          <span>Mailing address: 3325 Washburn Ave, Ste 207, Charlotte, NC 28205</span>
          <span>Website: harliepetsupply.com</span>
        </address>
      </div>
    </div>
  )
}
