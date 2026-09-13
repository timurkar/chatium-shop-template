import { requireAccountRole } from '@app/auth'
import { Money } from '@app/heap'
import Categories from './tables/categories.table'
import Products from './tables/products.table'
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from './server/seed-data'
import { SHOP } from './shared/config'

/**
 * GET /seed — наполняет магазин демо-данными. Идемпотентно: если товары уже есть, ничего не делает.
 * Доступно только сотрудникам аккаунта.
 */
export const seedRoute = app.get('/', async ctx => {
  requireAccountRole(ctx, 'Staff')
  const existing = await Products.countBy(ctx)
  if (existing > 0) return { seeded: false, reason: `В каталоге уже ${existing} товаров` }

  const categoryIds = new Map<string, string>()
  for (const [index, c] of DEMO_CATEGORIES.entries()) {
    const found = await Categories.findOneBy(ctx, { slug: c.slug })
    const row = found ?? (await Categories.create(ctx, { ...c, sortOrder: index + 1 }))
    categoryIds.set(c.slug, row.id)
  }

  let created = 0
  for (const [index, p] of DEMO_PRODUCTS.entries()) {
    await Products.create(ctx, {
      title: p.title,
      description: p.description,
      price: new Money(p.price, SHOP.currency),
      oldPrice: p.oldPrice ? new Money(p.oldPrice, SHOP.currency) : undefined,
      category: categoryIds.get(p.category),
      emoji: p.emoji,
      status: 'active',
      stock: p.stock,
      featured: p.featured ?? false,
      badge: p.badge,
      sortOrder: index + 1,
    })
    created++
  }
  return { seeded: true, categories: categoryIds.size, products: created }
})
