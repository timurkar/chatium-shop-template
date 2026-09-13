import { jsx } from '@app/html-jsx'
import { requireAccountRole, requireRealUser } from '@app/auth'
import { getUploadGetPutUrl } from '@app/storage'
import { Page } from './layout'
import { getAdminProduct, listCategories } from './server/product-data'
import AdminProductPage from './pages/AdminProductPage.vue'

/** Форма товара: без id — создание, с id — редактирование. */
export const adminProductRoute = app.get('/')
  .query(s => ({ id: s.string().optional() }))
  .handle(async (ctx, req) => {
    requireRealUser(ctx)
    requireAccountRole(ctx, 'Staff')
    const [categories, product] = await Promise.all([
      listCategories(ctx),
      req.query.id ? getAdminProduct(ctx, req.query.id) : Promise.resolve(null),
    ])
    const uploadUrl = getUploadGetPutUrl(ctx)
    return (
      <Page title={product ? `Товар: ${product.title}` : 'Новый товар'}>
        <AdminProductPage product={product} categories={categories} uploadUrl={uploadUrl} />
      </Page>
    )
  })
