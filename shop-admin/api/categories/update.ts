import { requireAccountRole } from '@app/auth'
import Categories from '../../../shop/tables/categories.table'
import { toCategoryData } from '../../../shop/server/product-data'

export const categoryUpdateRoute = app.post('/')
  .query(s => ({ id: s.string() }))
  .body(s => ({
    name: s.string().min(1),
    imageHash: s.string().optional(),
    description: s.string().optional(),
    sortOrder: s.number().optional(),
  }))
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const row = await Categories.update(ctx, {
      id: req.query.id,
      name: req.body.name.trim(),
      imageHash: req.body.imageHash?.trim() || null,
      description: req.body.description?.trim() || undefined,
      ...(req.body.sortOrder !== undefined ? { sortOrder: req.body.sortOrder } : {}),
    })
    return toCategoryData(row)
  })
