import { jsx } from '@app/html-jsx'
import { Page } from './layout'
import { listCategories, listProducts } from './server/product-data'
import HomePage from './pages/HomePage.vue'

export const indexRoute = app.get('/', async ctx => {
  const [categories, featured, newest] = await Promise.all([
    listCategories(ctx),
    listProducts(ctx, { featured: true, limit: 8 }),
    listProducts(ctx, { sort: 'new', limit: 8 }),
  ])
  return (
    <Page title="">
      <HomePage categories={categories} featured={featured} newest={newest} />
    </Page>
  )
})
