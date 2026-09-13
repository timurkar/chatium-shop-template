import { jsx } from '@app/html-jsx'
import { Page } from './layout'
import { listCategories } from './server/product-data'
import CartPage from './pages/CartPage.vue'

export const cartRoute = app.get('/', async ctx => {
  const categories = await listCategories(ctx)
  return (
    <Page title="Корзина">
      <CartPage categories={categories} />
    </Page>
  )
})
