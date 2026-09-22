import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import Shield from "@modules/common/icons/shield"
import Package from "@modules/common/icons/package"

const BADGES = [
  { icon: FastDelivery, title: "Fast Delivery", subtitle: "Quick, reliable shipping" },
  { icon: Shield, title: "Secure Checkout", subtitle: "Shop with confidence" },
  { icon: Refresh, title: "Easy Returns", subtitle: "Hassle-free exchanges" },
  { icon: Package, title: "Careful Packaging", subtitle: "Arrives safe and sound" },
]

export default function TrustBadges() {
  return (
    <div className="bg-mist border-y border-ui-border-base">
      <div className="content-container grid grid-cols-2 small:grid-cols-4 gap-8 py-10">
        {BADGES.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex-none text-forest">
              <Icon size={28} />
            </span>
            <div>
              <p className="txt-compact-medium-plus text-ui-fg-base">{title}</p>
              <p className="txt-compact-small text-ui-fg-subtle">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
