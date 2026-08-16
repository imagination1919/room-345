import { authenticate, defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      method: "ALL",
      matcher: "/store/wishlists",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      method: "ALL",
      matcher: "/store/wishlists/:id",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      method: "ALL",
      matcher: "/store/wishlists/:id/items",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      method: "ALL",
      matcher: "/store/wishlists/:id/items/:item_id",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      method: "ALL",
      matcher: "/store/wishlists/:id/share",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    // /store/wishlists/shared/:token is deliberately left unauthenticated —
    // it is the public, read-only share link.
  ],
})
