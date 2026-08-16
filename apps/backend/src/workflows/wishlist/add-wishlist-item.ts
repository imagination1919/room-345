import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import type { LinkDefinition } from "@medusajs/framework/types"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import WishlistModuleService from "../../modules/wishlist/service"
import { assertWishlistOwnershipStep } from "./assert-wishlist-ownership"

type WorkflowInput = {
  wishlist_id: string
  customer_id: string
  product_id: string
  product_variant_id?: string
}

type ValidateInput = {
  product_id: string
  product_variant_id?: string
}

const validateWishlistProductStep = createStep(
  "validate-wishlist-product",
  async (input: ValidateInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "variants.id"],
      filters: { id: input.product_id },
    })

    const product = products[0]

    if (!product) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with id: ${input.product_id} was not found`
      )
    }

    if (
      input.product_variant_id &&
      !product.variants?.some(
        (variant: { id: string }) => variant.id === input.product_variant_id
      )
    ) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Variant with id: ${input.product_variant_id} was not found on product: ${input.product_id}`
      )
    }

    return new StepResponse(product)
  }
)

type AddItemInput = {
  wishlist_id: string
  product_id: string
  product_variant_id?: string
}

const addWishlistItemStep = createStep(
  "add-wishlist-item",
  async (input: AddItemInput, { container }) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    const [existing] = await wishlistModuleService.listWishlistItems({
      wishlist_id: input.wishlist_id,
      product_id: input.product_id,
      product_variant_id: input.product_variant_id ?? null,
    })

    if (existing) {
      return new StepResponse(existing, null)
    }

    const item = await wishlistModuleService.createWishlistItems(input)

    const linkData: LinkDefinition[] = [
      {
        [Modules.PRODUCT]: { product_id: input.product_id },
        wishlist: { wishlist_item_id: item.id },
      },
    ]

    if (input.product_variant_id) {
      linkData.push({
        [Modules.PRODUCT]: { product_variant_id: input.product_variant_id },
        wishlist: { wishlist_item_id: item.id },
      })
    }

    await link.create(linkData)

    return new StepResponse(item, item.id)
  },
  async (itemId: string | null | undefined, { container }) => {
    if (!itemId) {
      return
    }

    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    await link.delete({ wishlist: { wishlist_item_id: itemId } })
    await wishlistModuleService.deleteWishlistItems(itemId)
  }
)

const addWishlistItemWorkflow = createWorkflow(
  "add-wishlist-item",
  (input: WorkflowInput) => {
    assertWishlistOwnershipStep({
      wishlist_id: input.wishlist_id,
      customer_id: input.customer_id,
    })

    validateWishlistProductStep({
      product_id: input.product_id,
      product_variant_id: input.product_variant_id,
    })

    const item = addWishlistItemStep({
      wishlist_id: input.wishlist_id,
      product_id: input.product_id,
      product_variant_id: input.product_variant_id,
    })

    return new WorkflowResponse(item)
  }
)

export default addWishlistItemWorkflow
