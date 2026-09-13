import { Heap } from '@app/heap'

const OrderItem = Heap.Object({
  productId: Heap.String({ customMeta: { title: 'ID товара' } }),
  title: Heap.String({ customMeta: { title: 'Название' } }),
  emoji: Heap.String({ customMeta: { title: 'Эмодзи' } }),
  imageHash: Heap.Optional(Heap.String({ customMeta: { title: 'Хеш фото' } })),
  price: Heap.Money({ customMeta: { title: 'Цена за единицу' } }),
  qty: Heap.Number({ customMeta: { title: 'Количество' } }),
}, { customMeta: { title: 'Позиция заказа' } })

const Orders = Heap.Table('t_shop_orders_N4RD', {
  number: Heap.String({ customMeta: { title: 'Номер заказа' } }),
  status: Heap.Enum(
    { new: 'new', processing: 'processing', shipped: 'shipped', done: 'done', cancelled: 'cancelled' } as const,
    { customMeta: { title: 'Статус' } },
  ),
  customerName: Heap.String({ customMeta: { title: 'Имя покупателя' } }),
  phone: Heap.String({ customMeta: { title: 'Телефон' } }),
  email: Heap.Optional(Heap.String({ customMeta: { title: 'Email' } })),
  delivery: Heap.Enum(
    { courier: 'courier', pickup: 'pickup' } as const,
    { customMeta: { title: 'Способ получения' } },
  ),
  address: Heap.Optional(Heap.String({ customMeta: { title: 'Адрес доставки' } })),
  comment: Heap.Optional(Heap.String({ customMeta: { title: 'Комментарий' } })),
  items: Heap.Array(OrderItem, { customMeta: { title: 'Состав заказа' } }),
  itemsTotal: Heap.Money({ customMeta: { title: 'Сумма товаров' } }),
  deliveryPrice: Heap.Money({ customMeta: { title: 'Стоимость доставки' } }),
  total: Heap.Money({ customMeta: { title: 'Итого' } }),
}, { customMeta: { title: 'Заказы', description: 'Заказы покупателей магазина' } })

export default Orders
