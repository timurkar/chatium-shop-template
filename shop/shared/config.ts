// @shared

/**
 * Настройки магазина. Меняйте здесь название, контакты и валюту —
 * значения используются и на сервере, и в Vue-компонентах.
 */
export const SHOP = {
  name: 'NORD',
  tagline: 'Вещи для дома, с которыми хочется жить',
  description:
    'Посуда, текстиль, свет и декор в скандинавском стиле. Отбираем только то, что сами поставили бы дома.',
  currency: 'RUB' as const,
  phone: '+7 (900) 000-00-00',
  email: 'hello@nord.shop',
  address: 'Москва, ул. Примерная, 1',
  workingHours: 'Ежедневно 10:00–21:00',
  freeDeliveryFrom: 5000,
  deliveryPrice: 390,
  /** Фото для обложки главной (хеш в хранилище Chatium). Пустая строка — тёмный фон без фото. */
  heroImageHash: 'image_msk_ltBgifmZxC.1600x1067.jpeg',
}

export const ORDER_STATUSES = {
  new: 'Новый',
  processing: 'В обработке',
  shipped: 'Отправлен',
  done: 'Выполнен',
  cancelled: 'Отменён',
} as const

export type OrderStatus = keyof typeof ORDER_STATUSES

export const DELIVERY_METHODS = {
  courier: 'Курьером',
  pickup: 'Самовывоз',
} as const

export type DeliveryMethod = keyof typeof DELIVERY_METHODS

export const PRODUCT_STATUSES = {
  active: 'В продаже',
  draft: 'Скрыт',
} as const

export type ProductStatus = keyof typeof PRODUCT_STATUSES

export const SORT_OPTIONS = {
  popular: 'Сначала популярные',
  new: 'Сначала новые',
  price_asc: 'Сначала дешевле',
  price_desc: 'Сначала дороже',
} as const

export type SortOption = keyof typeof SORT_OPTIONS
