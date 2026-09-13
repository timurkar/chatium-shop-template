import { jsx } from '@app/html-jsx'
import { requireAccountRole, requireRealUser } from '@app/auth'
import { Page } from '../shop/layout'
import Orders from '../shop/tables/orders.table'
import { toOrderData } from '../shop/server/order-data'
import { listCategories, listProducts } from '../shop/server/product-data'
import AdminPage from './pages/DashboardPage.vue'

export const adminRoute = app.get('/')
  .query(s => ({ tab: s.string().optional() }))
  .handle(async (ctx, req) => {
    requireRealUser(ctx)
    requireAccountRole(ctx, 'Staff')
    const [categories, products, orderRows] = await Promise.all([
      listCategories(ctx),
      listProducts(ctx, { includeDrafts: true, sort: 'new', limit: 500 }),
      Orders.findAll(ctx, { limit: 200, order: [{ createdAt: 'desc' }, { id: 'asc' }] }),
    ])
    const tab = req.query.tab === 'orders' || req.query.tab === 'categories' ? req.query.tab : 'products'
    return (
      <Page title="Панель управления">
        <AdminPage
          categories={categories}
          products={products}
          orders={orderRows.map(row => toOrderData(ctx, row))}
          initialTab={tab}
        />
      </Page>
    )
  })
