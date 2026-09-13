import { s } from '@app/schema'

/** Поля формы товара — общие для создания и обновления. */
export const productBody = {
  title: s.string().min(1),
  description: s.string(),
  price: s.number().min(0),
  oldPrice: s.number().min(0).optional(),
  categoryId: s.string().optional(),
  emoji: s.string().optional(),
  imageHash: s.string().optional(),
  status: s.enum(['active', 'draft']),
  stock: s.number().int().min(0),
  featured: s.boolean(),
  badge: s.string().optional(),
  sortOrder: s.number().optional(),
}
