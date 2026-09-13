import { jsx } from '@app/html-jsx'
import { Page } from './layout'
import { listCategories, listProducts } from './server/product-data'
import { SORT_OPTIONS, SortOption } from './shared/config'
import CatalogPage from './pages/CatalogPage.vue'

const sortKeys = Object.keys(SORT_OPTIONS) as SortOption[]

export const catalogRoute = app.get('/')
  .query(s => ({
    category: s.string().optional(),
    q: s.string().optional(),
    sort: s.string().optional(),
  }))
  .handle(async (ctx, req) => {
    const sort = sortKeys.find(k => k === req.query.sort) ?? 'popular'
    const filter = { category: req.query.category ?? '', q: req.query.q ?? '', sort }
    const [categories, products] = await Promise.all([
      listCategories(ctx),
      listProducts(ctx, { category: filter.category || undefined, q: filter.q || undefined, sort, limit: 200 }),
    ])
    const current = categories.find(c => c.slug === filter.category)
    return (
      <Page title={current ? current.name : 'Каталог'}>
        <CatalogPage categories={categories} products={products} filter={filter} />
      </Page>
    )
  })
