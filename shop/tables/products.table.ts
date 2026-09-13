import { Heap } from '@app/heap'
import Categories from './categories.table'

const Products = Heap.Table('t_shop_products_N4RD', {
  title: Heap.String({ customMeta: { title: 'Название' }, searchable: { langs: ['ru', 'en'] } }),
  description: Heap.String({ customMeta: { title: 'Описание' }, searchable: { langs: ['ru', 'en'] } }),
  price: Heap.Money({ customMeta: { title: 'Цена' } }),
  oldPrice: Heap.Optional(Heap.Money({ customMeta: { title: 'Старая цена (для скидки)' } })),
  category: Heap.Optional(Heap.RefLink(Categories, { customMeta: { title: 'Категория' } })),
  imageHash: Heap.Optional(Heap.String({ customMeta: { title: 'Хеш фото в хранилище' } })),
  status: Heap.Enum(
    { active: 'active', draft: 'draft' } as const,
    { customMeta: { title: 'Статус публикации' } },
  ),
  stock: Heap.Number({ customMeta: { title: 'Остаток на складе' } }),
  featured: Heap.Boolean({ customMeta: { title: 'Хит продаж (показывать на главной)' } }),
  badge: Heap.Optional(Heap.String({ customMeta: { title: 'Ярлык на карточке (например «Новинка»)' } })),
  sortOrder: Heap.Number({ customMeta: { title: 'Порядок в каталоге' } }),
}, { customMeta: { title: 'Товары', description: 'Каталог товаров магазина' } })

export default Products
