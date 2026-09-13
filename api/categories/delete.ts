import { requireAccountRole } from '@app/auth'
import Categories from '../../tables/categories.table'
import Products from '../../tables/products.table'

export const categoryDeleteRoute = app.post('/')
  .query(s => ({ id: s.string() }))
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const used = await Products.countBy(ctx, { category: req.query.id })
    if (used > 0) {
      throw new Error(`В категории ещё ${used} товар(ов) — сначала перенесите их в другую категорию`)
    }
    await Categories.delete(ctx, req.query.id)
    return { ok: true }
  })
