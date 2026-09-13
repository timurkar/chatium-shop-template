import { requireAccountRole } from '@app/auth'
import Orders from '../../../shop/tables/orders.table'
import { toOrderData } from '../../../shop/server/order-data'

export const orderUpdateStatusRoute = app.post('/')
  .query(s => ({ id: s.string() }))
  .body(s => ({ status: s.enum(['new', 'processing', 'shipped', 'done', 'cancelled']) }))
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const row = await Orders.update(ctx, { id: req.query.id, status: req.body.status })
    return toOrderData(ctx, row)
  })
