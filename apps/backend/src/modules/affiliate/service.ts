import { MedusaService } from "@medusajs/framework/utils"
import Affiliate from "./models/affiliate"
import AffiliateCommission from "./models/affiliate-commission"

class AffiliateModuleService extends MedusaService({
  Affiliate,
  AffiliateCommission,
}) {
  /**
   * Generates a unique-ish, URL/code-safe referral code from a display
   * name. Callers should catch the unique constraint violation on
   * createAffiliates and retry with a new code on collision.
   */
  async generateReferralCode(displayName: string): Promise<string> {
    const base = displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 16)
    const suffix = Math.random().toString(36).slice(2, 6)
    return `${base || "affiliate"}-${suffix}`
  }
}

export default AffiliateModuleService
