import { Metadata } from "next"
import { Button, Heading, Text } from "@medusajs/ui"

import { confirmAge, declineAge } from "@lib/data/age-verification"

export const metadata: Metadata = {
  title: "Age Verification | Room 345",
  robots: { index: false, follow: false },
}

type Props = {
  searchParams: Promise<{ redirect?: string }>
}

export default async function AgeVerifyPage({ searchParams }: Props) {
  const { redirect: redirectTo } = await searchParams

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-ui-bg-base px-6">
      <div className="max-w-md w-full flex flex-col items-center text-center gap-y-6 border border-ui-border-base rounded-large p-10 bg-ui-bg-subtle">
        <Heading
          level="h1"
          className="text-2xl-semi text-ui-fg-base uppercase"
        >
          Room 345
        </Heading>

        <Text className="text-ui-fg-subtle">
          This website features adult-oriented apparel and novelty items and
          is intended for visitors who are 18 years of age or older. By
          entering, you confirm that you meet this age requirement.
        </Text>

        <div className="flex gap-x-4 w-full">
          <form action={declineAge} className="flex-1">
            <Button type="submit" variant="secondary" className="w-full">
              I am under 18
            </Button>
          </form>
          <form action={confirmAge} className="flex-1">
            <input type="hidden" name="redirect" value={redirectTo ?? "/"} />
            <Button type="submit" variant="primary" className="w-full">
              I am 18 or older
            </Button>
          </form>
        </div>

        <Text className="text-ui-fg-muted text-xsmall-regular">
          By entering this site you agree to our Terms of Use and Privacy
          Policy.
        </Text>
      </div>
    </div>
  )
}
