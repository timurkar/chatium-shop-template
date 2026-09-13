import { requireAccountRole } from '@app/auth'
import Categories from '../../../shop/tables/categories.table'
import { slugify, toCategoryData } from '../../../shop/server/product-data'

export const categoryCreateRoute = app.post('/')
  .body(s => ({
    name: s.string().min(1),
    emoji: s.string().optional(),
    description: s.string().optional(),
  }))
  .handle(async (ctx, req) => {
    requireAccountRole(ctx, 'Staff')
    const count = await Categories.countBy(ctx)
    let slug = slugify(req.body.name)
    if (await Categories.findOneBy(ctx, { slug })) slug = `${slug}-${count + 1}`
    const row = await Categories.create(ctx, {
      name: req.body.name.trim(),
      slug,
      emoji: req.body.emoji?.trim() || '🛍️',
      description: req.body.description?.trim() || undefined,
      sortOrder: count + 1,
    })
    return toCategoryData(row)
  })
