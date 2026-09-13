import { requireAccountRole } from '@app/auth'
import { Money } from '@app/heap'
import Products from '../../../shop/tables/products.table'
import { getAdminProduct } from '../../../shop/server/product-data'
import { productBody } from '../../server/product-schema'
import { SHOP } from '../../../shop/shared/config'

export const productCreateRoute = app.post('/')
  .body(productBody)
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const b = req.body
    const count = await Products.countBy(ctx)
    const row = await Products.create(ctx, {
      title: b.title.trim(),
      description: b.description.trim(),
      price: new Money(b.price, SHOP.currency),
      oldPrice: b.oldPrice && b.oldPrice > b.price ? new Money(b.oldPrice, SHOP.currency) : undefined,
      category: b.categoryId || undefined,
      imageHash: b.imageHash?.trim() || undefined,
      status: b.status,
      stock: b.stock,
      featured: b.featured,
      badge: b.badge?.trim() || undefined,
      sortOrder: b.sortOrder ?? count + 1,
    })
    return getAdminProduct(ctx, row.id)
  })
