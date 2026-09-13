import { requireAccountRole } from '@app/auth'
import { Money } from '@app/heap'
import Products from '../../../shop/tables/products.table'
import { getAdminProduct } from '../../../shop/server/product-data'
import { productBody } from '../../server/product-schema'
import { SHOP } from '../../../shop/shared/config'

export const productUpdateRoute = app.post('/')
  .query(s => ({ id: s.string() }))
  .body(productBody)
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const b = req.body
    const existing = await Products.getById(ctx, req.query.id)
    await Products.update(ctx, {
      id: existing.id,
      title: b.title.trim(),
      description: b.description.trim(),
      price: new Money(b.price, SHOP.currency),
      oldPrice: b.oldPrice && b.oldPrice > b.price ? new Money(b.oldPrice, SHOP.currency) : null,
      category: b.categoryId || null,
      emoji: b.emoji?.trim() || '🛍️',
      imageHash: b.imageHash?.trim() || null,
      status: b.status,
      stock: b.stock,
      featured: b.featured,
      badge: b.badge?.trim() || null,
      sortOrder: b.sortOrder ?? existing.sortOrder,
    })
    return getAdminProduct(ctx, existing.id)
  })
