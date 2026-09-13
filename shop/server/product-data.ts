import Categories from '../tables/categories.table'
import Products from '../tables/products.table'
import { SortOption } from '../shared/config'

export type CategoryData = {
  id: string
  name: string
  slug: string
  imageHash: string | null
  description: string
  sortOrder: number
}

export type ProductData = {
  id: string
  title: string
  description: string
  price: number
  priceFormatted: string
  oldPrice: number | null
  oldPriceFormatted: string | null
  discountPercent: number | null
  categoryId: string | null
  categoryName: string | null
  categorySlug: string | null
  imageHash: string | null
  status: 'active' | 'draft'
  stock: number
  featured: boolean
  badge: string | null
  sortOrder: number
  createdAt: string
}

const moneyFormat = { minimumFractionDigits: 0, maximumFractionDigits: 0 }

export function toCategoryData(row: typeof Categories.T): CategoryData {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    imageHash: row.imageHash ?? null,
    description: row.description ?? '',
    sortOrder: row.sortOrder,
  }
}

export async function listCategories(ctx: app.Ctx): Promise<CategoryData[]> {
  const rows = await Categories.findAll(ctx, { limit: 100, order: [{ sortOrder: 'asc' }, { id: 'asc' }] })
  return rows.map(toCategoryData)
}

/** Загружает категории для набора товаров одним запросом. */
export async function categoriesByIdFor(ctx: app.Ctx, rows: Array<typeof Products.T>) {
  const ids = [...new Set(rows.flatMap(r => (r.category ? [r.category.id] : [])))]
  const categories = ids.length ? await Categories.findAll(ctx, { where: { id: ids }, limit: 100 }) : []
  return new Map(categories.map(c => [c.id, c]))
}

export function toProductData(
  ctx: app.Ctx,
  row: typeof Products.T,
  categories: Map<string, typeof Categories.T>,
): ProductData {
  const category = row.category ? categories.get(row.category.id) ?? null : null
  const oldPrice = row.oldPrice ?? null
  const discount =
    oldPrice && oldPrice.amount > row.price.amount
      ? Math.round((1 - row.price.amount / oldPrice.amount) * 100)
      : null
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price.amount,
    priceFormatted: row.price.format(ctx, moneyFormat),
    oldPrice: oldPrice ? oldPrice.amount : null,
    oldPriceFormatted: oldPrice ? oldPrice.format(ctx, moneyFormat) : null,
    discountPercent: discount,
    categoryId: category ? category.id : null,
    categoryName: category ? category.name : null,
    categorySlug: category ? category.slug : null,
    imageHash: row.imageHash ?? null,
    status: row.status,
    stock: row.stock,
    featured: row.featured,
    badge: row.badge ?? null,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function toProductDataList(ctx: app.Ctx, rows: Array<typeof Products.T>): Promise<ProductData[]> {
  const categories = await categoriesByIdFor(ctx, rows)
  return rows.map(row => toProductData(ctx, row, categories))
}

export type ProductFilter = {
  category?: string // slug категории
  q?: string
  sort?: SortOption
  featured?: boolean
  limit?: number
  /** true — включая скрытые товары (только для админки) */
  includeDrafts?: boolean
}

function orderFor(sort: SortOption | undefined) {
  switch (sort) {
    case 'new':
      return [{ createdAt: 'desc' as const }, { id: 'asc' as const }]
    default:
      return [{ featured: 'desc' as const }, { sortOrder: 'asc' as const }, { id: 'asc' as const }]
  }
}

/** Money хранится как [сумма, валюта], поэтому сортировку по цене делаем в памяти (список ограничен). */
function sortByPrice(list: ProductData[], sort: SortOption | undefined): ProductData[] {
  if (sort === 'price_asc') return [...list].sort((a, b) => a.price - b.price)
  if (sort === 'price_desc') return [...list].sort((a, b) => b.price - a.price)
  return list
}

export async function listProducts(ctx: app.Ctx, filter: ProductFilter = {}): Promise<ProductData[]> {
  const conditions: Array<Record<string, unknown>> = []
  if (!filter.includeDrafts) conditions.push({ status: 'active' })
  if (filter.featured) conditions.push({ featured: true })
  if (filter.category) {
    const category = await Categories.findOneBy(ctx, { slug: filter.category })
    if (!category) return []
    conditions.push({ category: category.id })
  }
  const q = filter.q?.trim()
  if (q) {
    const pattern = `%${q.replace(/[%_]/g, '')}%`
    conditions.push({ $or: [{ title: { $ilike: pattern } }, { description: { $ilike: pattern } }] })
  }
  const rows = await Products.findAll(ctx, {
    where: conditions.length ? ({ $and: conditions } as any) : undefined,
    order: orderFor(filter.sort),
    limit: Math.min(filter.limit ?? 100, 500),
  })
  return sortByPrice(await toProductDataList(ctx, rows), filter.sort)
}

export async function getPublicProduct(ctx: app.Ctx, id: string): Promise<ProductData | null> {
  const row = await Products.findOneBy(ctx, { id, status: 'active' })
  if (!row) return null
  const [data] = await toProductDataList(ctx, [row])
  return data ?? null
}

export async function getAdminProduct(ctx: app.Ctx, id: string): Promise<ProductData> {
  const row = await Products.getById(ctx, id)
  const [data] = await toProductDataList(ctx, [row])
  if (!data) throw new Error('Product not found')
  return data
}

export function slugify(input: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l',
    м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh',
    щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  }
  return input
    .toLowerCase()
    .split('')
    .map(ch => map[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'category'
}
