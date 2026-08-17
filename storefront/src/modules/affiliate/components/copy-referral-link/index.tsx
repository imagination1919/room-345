"use client"

import { Button, Text, toast } from "@medusajs/ui"

type Props = {
  referralLink: string
}

const CopyReferralLink = ({ referralLink }: Props) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink)
    toast.success("Link copied")
  }

  return (
    <div className="flex flex-col gap-y-2" data-testid="copy-referral-link">
      <Text className="txt-small text-ui-fg-subtle break-all">
        {referralLink}
      </Text>
      <Button
        size="small"
        variant="secondary"
        onClick={handleCopy}
        className="self-start"
        data-testid="copy-referral-link-button"
      >
        Copy link
      </Button>
    </div>
  )
}

export default CopyReferralLink
