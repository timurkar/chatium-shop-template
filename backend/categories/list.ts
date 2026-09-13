import { listCategories } from '../../server/product-data'

export const categoriesListRoute = app.get('/', async ctx => listCategories(ctx))
