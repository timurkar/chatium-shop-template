import { requireAccountRole } from '@app/auth'
import { listProducts } from '../../../shop/server/product-data'

/** Список для админки: включая скрытые товары. */
export const productsAdminListRoute = app.get('/', async ctx => {
  requireAccountRole(ctx, 'Staff')
  return listProducts(ctx, { includeDrafts: true, sort: 'new', limit: 500 })
})
