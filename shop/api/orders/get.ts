import Orders from '../../tables/orders.table'
import { toOrderData } from '../../server/order-data'

/** Страница заказа доступна по его id (длинный случайный идентификатор). */
export const orderGetRoute = app.get('/')
  .query(s => ({ id: s.string() }))
  .handle(async (ctx, req) => {
    const row = await Orders.findById(ctx, req.query.id)
    return row ? toOrderData(ctx, row) : null
  })
