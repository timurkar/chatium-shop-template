import { Heap } from '@app/heap'

const Categories = Heap.Table('t_shop_categories_N4RD', {
  name: Heap.String({ customMeta: { title: 'Название' } }),
  slug: Heap.String({ customMeta: { title: 'Слаг (для ссылок)' } }),
  emoji: Heap.String({ customMeta: { title: 'Эмодзи / иконка' } }),
  description: Heap.Optional(Heap.String({ customMeta: { title: 'Описание' } })),
  sortOrder: Heap.Number({ customMeta: { title: 'Порядок сортировки' } }),
}, { customMeta: { title: 'Категории товаров', description: 'Разделы каталога магазина' } })

export default Categories
