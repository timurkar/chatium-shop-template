import { getPublicProduct } from '../../server/product-data'

export const productGetRoute = app.get('/')
  .query(s => ({ id: s.string() }))
  .handle(async (ctx, req) => getPublicProduct(ctx, req.query.id))
