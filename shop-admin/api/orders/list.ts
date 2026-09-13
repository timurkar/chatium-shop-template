import { requireAccountRole } from '@app/auth'
import Orders from '../../../shop/tables/orders.table'
import { toOrderData } from '../../../shop/server/order-data'

export const ordersListRoute = app.get('/', async ctx => {
  requireAccountRole(ctx, 'Staff')
  const rows = await Orders.findAll(ctx, { limit: 200, order: [{ createdAt: 'desc' }, { id: 'asc' }] })
  return rows.map(row => toOrderData(ctx, row))
})
