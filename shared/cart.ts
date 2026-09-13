// @shared

/**
 * Корзина хранится в localStorage браузера: посетителю не нужно входить,
 * чтобы собрать заказ. Компоненты подписываются на событие `shop-cart-updated`.
 */
export type CartItem = { id: string; qty: number }

const STORAGE_KEY = 'shop-cart'
export const CART_EVENT = 'shop-cart-updated'

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function readCart(): CartItem[] {
  if (!hasStorage()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((x): x is CartItem => !!x && typeof x.id === 'string' && typeof x.qty === 'number' && x.qty > 0)
      .map(x => ({ id: x.id, qty: Math.floor(x.qty) }))
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]): void {
  if (!hasStorage()) return
  const clean = items.filter(x => x.qty > 0)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
  window.dispatchEvent(new CustomEvent(CART_EVENT))
}

export function addToCart(id: string, qty = 1): CartItem[] {
  const items = readCart()
  const existing = items.find(x => x.id === id)
  if (existing) existing.qty += qty
  else items.push({ id, qty })
  writeCart(items)
  return items
}

export function setCartQty(id: string, qty: number): CartItem[] {
  const items = readCart().map(x => (x.id === id ? { ...x, qty } : x))
  writeCart(items)
  return items.filter(x => x.qty > 0)
}

export function removeFromCart(id: string): CartItem[] {
  const items = readCart().filter(x => x.id !== id)
  writeCart(items)
  return items
}

export function clearCart(): void {
  writeCart([])
}

export function cartCount(items = readCart()): number {
  return items.reduce((sum, x) => sum + x.qty, 0)
}

export function cartQtyOf(id: string, items = readCart()): number {
  return items.find(x => x.id === id)?.qty ?? 0
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(amount) + ' ₽'
}

export function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}
