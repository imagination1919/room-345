import { Github } from "@medusajs/icons"
import { Button, Heading, Text } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            Ecommerce Starter Template
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            Powered by Medusa and Next.js
          </Heading>
        </span>
        <div className="border border-ui-border-interactive rounded-rounded px-4 py-2 max-w-md">
          <Text className="text-ui-fg-interactive txt-small-plus uppercase">
            18+ only
          </Text>
          <Text className="text-ui-fg-subtle txt-small">
            Room 345 features adult-oriented apparel and novelty items and
            is intended for visitors 18 years of age or older.
          </Text>
        </div>
        <a
          href="https://github.com/medusajs/nextjs-starter-medusa"
          target="_blank"
        >
          <Button variant="secondary">
            View on GitHub
            <Github />
          </Button>
        </a>
      </div>
    </div>
  )
}

export default Hero
