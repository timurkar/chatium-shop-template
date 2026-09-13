import Products from '../../tables/products.table'
import { toProductDataList } from '../../server/product-data'

/** Товары корзины: клиент присылает id из localStorage, сервер отдаёт актуальные цены и остатки. */
export const productsByIdsRoute = app.post('/')
  .body(s => ({ ids: s.array(s.string()) }))
  .handle(async (ctx, req) => {
    const ids = [...new Set(req.body.ids)].slice(0, 200)
    if (!ids.length) return []
    const rows = await Products.findAll(ctx, { where: { id: ids, status: 'active' }, limit: 200 })
    return toProductDataList(ctx, rows)
  })
