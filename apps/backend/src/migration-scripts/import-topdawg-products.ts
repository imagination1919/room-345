import fs from "fs"
import { parse } from "csv-parse/sync"
import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  MedusaError,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"

const CSV_PATH =
  process.env.TOPDAWG_CSV_PATH ??
  "/home/nino/dev/top_dog_data/csv_favorite-export-active-products-2026-09-21_23-50-33.csv"
const PRODUCT_BATCH_SIZE = 25
const INVENTORY_BATCH_SIZE = 200
const LBS_TO_GRAMS = 453.592
const FALLBACK_OPTION_VALUE = "Standard"

type TopDawgRow = {
  tdid: string
  product_code: string
  product_name: string
  parent_name: string
  manufacturer_name: string
  category: string
  product_description: string
  cost: string
  MSRP: string
  QTY_available: string
  product_weight: string
  length: string
  width: string
  height: string
  size: string
  color: string
  pack_of: string
  variant_group_id: string
  [key: string]: string
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

function collectImages(...rows: TopDawgRow[]): { url: string }[] {
  const urls = new Set<string>()
  for (const row of rows) {
    for (let i = 1; i <= 10; i++) {
      const url = row[`picture_url_${i}`]?.trim()
      if (url) urls.add(url)
    }
  }
  return [...urls].map((url) => ({ url }))
}

/** The row's own option dimensions: explicit OptionName/Value pairs, then Size/Color/Pack as synthetic fallbacks. */
function rowOptionPairs(row: TopDawgRow): [string, string][] {
  const pairs: [string, string][] = []
  const usedTitles = new Set<string>()
  for (let i = 0; i < 10; i++) {
    const name = row[`OptionName${i}`]?.trim()
    const value = row[`OptionValue${i}`]?.trim()
    if (name && value) {
      pairs.push([name, value])
      usedTitles.add(name)
    }
  }
  if (row.size?.trim() && !usedTitles.has("Size")) {
    pairs.push(["Size", row.size.trim()])
  }
  if (row.color?.trim() && !usedTitles.has("Color")) {
    pairs.push(["Color", row.color.trim()])
  }
  if (row.pack_of?.trim() && row.pack_of.trim() !== "1" && !usedTitles.has("Pack")) {
    pairs.push(["Pack", `Pack of ${row.pack_of.trim()}`])
  }
  return pairs
}

function weightGrams(row: TopDawgRow): number | undefined {
  const lbs = parseFloat(row.product_weight)
  return Number.isFinite(lbs) ? Math.round(lbs * LBS_TO_GRAMS) : undefined
}

function inches(value: string): number | undefined {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : undefined
}

type VariantPlan = {
  row: TopDawgRow
  optionValues: Record<string, string>
  title: string
}

type ProductPlan = {
  key: string
  title: string
  representative: TopDawgRow
  rows: TopDawgRow[]
  optionTitles: string[]
  variants: VariantPlan[]
}

/**
 * A variant_group_id from the source data groups multiple rows under one
 * listing, but many groups have missing or duplicate option values (e.g. the
 * same color repeated for genuinely different items). Only groups where every
 * row resolves to a unique option combination are safe to merge; everything
 * else is imported as its own single-variant product to avoid colliding
 * Medusa variants.
 */
function buildProductPlans(rows: TopDawgRow[]): ProductPlan[] {
  const byGroup = new Map<string, TopDawgRow[]>()
  const standalone: TopDawgRow[] = []
  for (const row of rows) {
    const groupId = row.variant_group_id?.trim()
    if (!groupId) {
      standalone.push(row)
      continue
    }
    const list = byGroup.get(groupId) ?? []
    list.push(row)
    byGroup.set(groupId, list)
  }

  const plans: ProductPlan[] = []

  for (const [groupId, groupRows] of byGroup) {
    if (groupRows.length < 2) {
      standalone.push(...groupRows)
      continue
    }

    const optionTitles: string[] = []
    for (const row of groupRows) {
      for (const [title] of rowOptionPairs(row)) {
        if (!optionTitles.includes(title)) optionTitles.push(title)
      }
    }

    const variants: VariantPlan[] = groupRows.map((row) => {
      const pairs = new Map(rowOptionPairs(row))
      const optionValues: Record<string, string> = {}
      for (const title of optionTitles) {
        optionValues[title] = pairs.get(title) ?? FALLBACK_OPTION_VALUE
      }
      return {
        row,
        optionValues,
        title: optionTitles.map((t) => optionValues[t]).join(" / "),
      }
    })

    const signatures = new Set(variants.map((v) => v.title))
    if (signatures.size !== variants.length || optionTitles.length === 0) {
      // Ambiguous group: fall back to standalone products for its rows.
      standalone.push(...groupRows)
      continue
    }

    const representative =
      groupRows.find((r) => r.parent_name?.trim()) ?? groupRows[0]
    plans.push({
      key: groupId,
      title: representative.parent_name?.trim() || representative.product_name,
      representative,
      rows: groupRows,
      optionTitles,
      variants,
    })
  }

  for (const row of standalone) {
    plans.push({
      key: row.product_code,
      title: row.product_name,
      representative: row,
      rows: [row],
      optionTitles: ["Title"],
      variants: [{ row, optionValues: { Title: "Default" }, title: "Default" }],
    })
  }

  return plans
}

export default async function import_topdawg_products({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info(`Reading CSV from ${CSV_PATH}...`)
  const content = fs.readFileSync(CSV_PATH)
  const rows: TopDawgRow[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  })
  logger.info(`Parsed ${rows.length} rows.`)

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
  })
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  })
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const salesChannel = salesChannels[0]
  const stockLocation = stockLocations[0]
  const shippingProfile = shippingProfiles[0]
  if (!salesChannel || !stockLocation || !shippingProfile) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Missing sales channel, stock location, or shipping profile. Run the initial data seed first."
    )
  }

  logger.info("Resolving product categories...")
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const categoryIdByName = new Map(
    existingCategories.map((c) => [c.name, c.id])
  )
  const csvCategoryNames = [...new Set(rows.map((r) => r.category).filter(Boolean))]
  const missingCategoryNames = csvCategoryNames.filter(
    (name) => !categoryIdByName.has(name)
  )
  if (missingCategoryNames.length) {
    const { result: createdCategories } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: missingCategoryNames.map((name) => ({
          name,
          handle: slugify(name),
          is_active: true,
        })),
      },
    })
    for (const cat of createdCategories) {
      categoryIdByName.set(cat.name, cat.id)
    }
  }
  logger.info(
    `Categories ready: ${categoryIdByName.size} total (${missingCategoryNames.length} created).`
  )

  const plans = buildProductPlans(rows)
  const multiVariantPlans = plans.filter((p) => p.rows.length > 1)
  logger.info(
    `Built ${plans.length} product listings from ${rows.length} rows ` +
      `(${multiVariantPlans.length} multi-variant, ${
        plans.length - multiVariantPlans.length
      } single-variant).`
  )

  const handleCounts = new Map<string, number>()
  const skuToQty = new Map<string, number>()
  const productInputs = plans.map((plan) => {
    const baseHandle = `${slugify(plan.title)}-${slugify(plan.key)}`
    const count = handleCounts.get(baseHandle) ?? 0
    handleCounts.set(baseHandle, count + 1)
    const handle = count === 0 ? baseHandle : `${baseHandle}-${count}`

    const categoryId = categoryIdByName.get(plan.representative.category)

    for (const v of plan.variants) {
      skuToQty.set(v.row.product_code, parseInt(v.row.QTY_available, 10) || 0)
    }

    return {
      title: plan.title,
      handle,
      description: plan.representative.product_description || undefined,
      category_ids: categoryId ? [categoryId] : [],
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: collectImages(...plan.rows),
      options: plan.optionTitles.map((title) => ({
        title,
        values: [...new Set(plan.variants.map((v) => v.optionValues[title]))],
      })),
      variants: plan.variants.map((v) => ({
        title: v.title,
        sku: v.row.product_code,
        options: v.optionValues,
        manage_inventory: true,
        weight: weightGrams(v.row),
        length: inches(v.row.length),
        width: inches(v.row.width),
        height: inches(v.row.height),
        prices: [{ amount: parseFloat(v.row.MSRP), currency_code: "usd" }],
      })),
      sales_channels: [{ id: salesChannel.id }],
      metadata: {
        supplier: "TopDawg",
        supplier_variant_group_id:
          plan.rows.length > 1 ? plan.key : undefined,
        manufacturer: plan.representative.manufacturer_name || undefined,
      },
    }
  })

  logger.info(
    `Creating ${productInputs.length} products in batches of ${PRODUCT_BATCH_SIZE}...`
  )
  let created = 0
  const failures: { titles: string[]; error: string }[] = []
  for (let i = 0; i < productInputs.length; i += PRODUCT_BATCH_SIZE) {
    const batch = productInputs.slice(i, i + PRODUCT_BATCH_SIZE)
    try {
      await createProductsWorkflow(container).run({
        input: { products: batch },
      })
      created += batch.length
      logger.info(`Created ${created}/${productInputs.length} products.`)
    } catch (e) {
      failures.push({
        titles: batch.map((p) => p.title),
        error: e instanceof Error ? e.message : String(e),
      })
      logger.error(
        `Batch starting at row ${i} failed: ${
          e instanceof Error ? e.message : String(e)
        }`
      )
    }
  }

  logger.info("Setting inventory levels from QTY_available...")
  const allSkus = [...skuToQty.keys()]
  let inventoryLevelsSet = 0
  for (let i = 0; i < allSkus.length; i += INVENTORY_BATCH_SIZE) {
    const skuBatch = allSkus.slice(i, i + INVENTORY_BATCH_SIZE)
    const { data: inventoryItems } = await query.graph({
      entity: "inventory_item",
      fields: ["id", "sku"],
      filters: { sku: skuBatch },
    })
    if (!inventoryItems.length) continue
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryItems.map((item) => ({
          location_id: stockLocation.id,
          inventory_item_id: item.id,
          stocked_quantity: skuToQty.get(item.sku!) ?? 0,
        })),
      },
    })
    inventoryLevelsSet += inventoryItems.length
  }

  logger.info(
    `Done. Products created: ${created}/${productInputs.length}. Inventory levels set: ${inventoryLevelsSet}. Failed batches: ${failures.length}.`
  )
  if (failures.length) {
    logger.warn(`Failed batch details: ${JSON.stringify(failures, null, 2)}`)
  }
}
