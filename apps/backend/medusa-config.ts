import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: [
    {
      resolve: "./src/modules/wishlist",
    },
    {
      resolve: "./src/modules/affiliate",
    },
    {
      resolve: "./src/modules/contact",
    },
    // projectConfig.redisUrl only backs the session store — event bus and
    // locking need their own Redis-backed providers, same pattern Medusa
    // Cloud registers automatically, wired in explicitly here since this
    // is a self-hosted deployment.
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            id: "locking-redis",
            resolve: "@medusajs/medusa/locking-redis",
            is_default: true,
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
        ],
      },
    },
    // Transactional email only (order confirmations, etc.) — the local
    // provider just logs, so without this nothing actually gets sent.
    // SENDGRID_API_KEY / SENDGRID_FROM must be set for the provider to
    // work; the subscriber that uses it (order-placed-email.ts) sends
    // plain HTML directly rather than a SendGrid Dynamic Template, so no
    // template needs to be built in the SendGrid dashboard first.
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/notification-sendgrid",
            id: "sendgrid",
            options: {
              channels: ["email"],
              api_key: process.env.SENDGRID_API_KEY,
              from: process.env.SENDGRID_FROM,
            },
          },
        ],
      },
    },
    // Stripe checkout. id: "stripe" + this resolve produces the
    // "pp_stripe_stripe" provider id the storefront's payment-wrapper
    // already expects (see storefront/src/lib/constants.tsx). The
    // provider throws at boot if STRIPE_API_KEY is missing — unlike the
    // notification providers above, there's no safe default here.
    // STRIPE_WEBHOOK_SECRET is technically optional (only warns if
    // unset), but without it Stripe can't confirm payment status back to
    // Medusa, so anything beyond a plain synchronous card charge (3DS,
    // redirect-based methods, delayed capture) will leave orders stuck
    // pending even after a successful charge.
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
              capture: true,
            },
          },
        ],
      },
    },
  ],
})
