import { jsx } from '@app/html-jsx'
import { Page } from './layout'
import Orders from './tables/orders.table'
import { toOrderData } from './server/order-data'
import { listCategories } from './server/product-data'
import OrderPage from './pages/OrderPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

export const orderRoute = app.get('/')
  .query(s => ({ id: s.string() }))
  .handle(async (ctx, req) => {
    const [row, categories] = await Promise.all([Orders.findById(ctx, req.query.id), listCategories(ctx)])
    if (!row) {
      return (
        <Page title="Заказ не найден">
          <NotFoundPage categories={categories} message="Заказ с таким номером не найден." />
        </Page>
      )
    }
    return (
      <Page title={`Заказ №${row.number}`}>
        <OrderPage order={toOrderData(ctx, row)} categories={categories} />
      </Page>
    )
  })
