import { jsx } from '@app/html-jsx'
import { Page } from './layout'
import { getPublicProduct, listCategories, listProducts } from './server/product-data'
import ProductPage from './pages/ProductPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

export const productRoute = app.get('/')
  .query(s => ({ id: s.string() }))
  .handle(async (ctx, req) => {
    const [product, categories] = await Promise.all([getPublicProduct(ctx, req.query.id), listCategories(ctx)])
    if (!product) {
      return (
        <Page title="Товар не найден">
          <NotFoundPage categories={categories} message="Такого товара нет или он снят с продажи." />
        </Page>
      )
    }
    const related = product.categorySlug
      ? (await listProducts(ctx, { category: product.categorySlug, limit: 9 })).filter(p => p.id !== product.id).slice(0, 4)
      : []
    return (
      <Page title={product.title} description={product.description.slice(0, 160)}>
        <ProductPage product={product} related={related} categories={categories} />
      </Page>
    )
  })
