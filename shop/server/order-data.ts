import { Money } from '@app/heap'
import Orders from '../tables/orders.table'
import Products from '../tables/products.table'
import { DeliveryMethod, OrderStatus, SHOP } from '../shared/config'

const moneyFormat = { minimumFractionDigits: 0, maximumFractionDigits: 0 }

export type OrderItemData = {
  productId: string
  title: string
  emoji: string
  imageHash: string | null
  price: number
  priceFormatted: string
  qty: number
  sum: number
  sumFormatted: string
}

export type OrderData = {
  id: string
  number: string
  status: OrderStatus
  customerName: string
  phone: string
  email: string | null
  delivery: DeliveryMethod
  address: string | null
  comment: string | null
  items: OrderItemData[]
  itemsTotal: number
  itemsTotalFormatted: string
  deliveryPrice: number
  deliveryPriceFormatted: string
  total: number
  totalFormatted: string
  createdAt: string
}

export function toOrderData(ctx: app.Ctx, row: typeof Orders.T): OrderData {
  return {
    id: row.id,
    number: row.number,
    status: row.status,
    customerName: row.customerName,
    phone: row.phone,
    email: row.email ?? null,
    delivery: row.delivery,
    address: row.address ?? null,
    comment: row.comment ?? null,
    items: row.items.map(item => {
      const sum = item.price.multiply(item.qty)
      return {
        productId: item.productId,
        title: item.title,
        emoji: item.emoji,
        imageHash: item.imageHash ?? null,
        price: item.price.amount,
        priceFormatted: item.price.format(ctx, moneyFormat),
        qty: item.qty,
        sum: sum.amount,
        sumFormatted: sum.format(ctx, moneyFormat),
      }
    }),
    itemsTotal: row.itemsTotal.amount,
    itemsTotalFormatted: row.itemsTotal.format(ctx, moneyFormat),
    deliveryPrice: row.deliveryPrice.amount,
    deliveryPriceFormatted: row.deliveryPrice.format(ctx, moneyFormat),
    total: row.total.amount,
    totalFormatted: row.total.format(ctx, moneyFormat),
    createdAt: row.createdAt.toISOString(),
  }
}

export type CreateOrderInput = {
  customerName: string
  phone: string
  email?: string
  delivery: DeliveryMethod
  address?: string
  comment?: string
  items: Array<{ id: string; qty: number }>
}

export class OrderError extends Error {}

/**
 * Создаёт заказ. Цены и наличие берутся из базы, а не из запроса клиента.
 */
export async function createOrder(ctx: app.Ctx, input: CreateOrderInput) {
  const wanted = new Map<string, number>()
  for (const item of input.items) {
    const qty = Math.floor(item.qty)
    if (qty > 0) wanted.set(item.id, (wanted.get(item.id) ?? 0) + qty)
  }
  if (!wanted.size) throw new OrderError('Корзина пуста')
  if (input.delivery === 'courier' && !input.address?.trim()) {
    throw new OrderError('Укажите адрес доставки')
  }

  const products = await Products.findAll(ctx, {
    where: { id: [...wanted.keys()], status: 'active' },
    limit: 200,
  })
  const byId = new Map(products.map(p => [p.id, p]))

  const items: Array<typeof Orders.T['items'][number]> = []
  let itemsTotal = new Money(0, SHOP.currency)
  for (const [id, qty] of wanted) {
    const product = byId.get(id)
    if (!product) throw new OrderError('Часть товаров больше недоступна — обновите корзину')
    if (product.stock < qty) throw new OrderError(`«${product.title}»: в наличии только ${product.stock} шт.`)
    items.push({
      productId: product.id,
      title: product.title,
      emoji: product.emoji,
      imageHash: product.imageHash,
      price: product.price,
      qty,
    })
    itemsTotal = itemsTotal.add(product.price.multiply(qty))
  }

  const deliveryPrice =
    input.delivery === 'pickup' || itemsTotal.amount >= SHOP.freeDeliveryFrom
      ? new Money(0, SHOP.currency)
      : new Money(SHOP.deliveryPrice, SHOP.currency)

  const count = await Orders.countBy(ctx)
  const number = String(1000 + count + 1)

  const order = await Orders.create(ctx, {
    number,
    status: 'new',
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    delivery: input.delivery,
    address: input.delivery === 'courier' ? input.address?.trim() : undefined,
    comment: input.comment?.trim() || undefined,
    items,
    itemsTotal,
    deliveryPrice,
    total: itemsTotal.add(deliveryPrice),
  })

  // Списываем остатки
  for (const item of items) {
    const product = byId.get(item.productId)
    if (product) await Products.update(ctx, { id: product.id, stock: Math.max(0, product.stock - item.qty) })
  }

  return toOrderData(ctx, order)
}
