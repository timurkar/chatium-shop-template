import { requireAccountRole } from '@app/auth'
import Products from '../../../shop/tables/products.table'

export const productDeleteRoute = app.post('/')
  .query(s => ({ id: s.string() }))
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    await Products.delete(ctx, req.query.id)
    return { ok: true }
  })
