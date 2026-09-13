import { listProducts } from '../../server/product-data'
import { SORT_OPTIONS, SortOption } from '../../shared/config'

const sortKeys = Object.keys(SORT_OPTIONS) as SortOption[]

/** Публичный список товаров: только опубликованные. */
export const productsListRoute = app.get('/')
  .query(s => ({
    category: s.string().optional(),
    q: s.string().optional(),
    sort: s.string().optional(),
    featured: s.string().optional(),
    limit: s.string().optional(),
  }))
  .handle(async (ctx, req) => {
    const sort = sortKeys.find(k => k === req.query.sort)
    const limit = req.query.limit ? Number(req.query.limit) : undefined
    return listProducts(ctx, {
      category: req.query.category || undefined,
      q: req.query.q || undefined,
      sort,
      featured: req.query.featured === '1',
      limit: limit && Number.isFinite(limit) && limit > 0 ? limit : undefined,
    })
  })
