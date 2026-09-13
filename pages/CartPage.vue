<template>
  <div class="min-h-screen flex flex-col">
    <Header :categories="categories" active="cart" />

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <h1 class="text-3xl md:text-4xl font-black tracking-tight">Корзина</h1>

      <div v-if="loading" class="mt-8 text-stone-500">Загружаем корзину…</div>

      <EmptyState v-else-if="!lines.length" class="mt-8" emoji="🛒" title="В корзине пока пусто" text="Загляните в каталог — там точно найдётся что-то для дома.">
        <a :href="catalogRoute.url()" class="h-11 px-5 rounded-full bg-stone-900 text-white font-medium inline-flex items-center">Перейти в каталог</a>
      </EmptyState>

      <div v-else class="mt-8 grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <!-- Items -->
        <section class="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100">
          <div v-for="line in lines" :key="line.product.id" class="p-4 sm:p-5 flex gap-4">
            <a :href="productRoute.query({ id: line.product.id }).url()" class="shrink-0">
              <ProductImage :image-hash="line.product.imageHash" :emoji="line.product.emoji" :title="line.product.title" :seed="line.product.id" :width="200" wrapper-class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl" emoji-class="text-4xl" />
            </a>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between gap-3">
                <div class="min-w-0">
                  <a :href="productRoute.query({ id: line.product.id }).url()" class="font-semibold hover:underline line-clamp-2">{{ line.product.title }}</a>
                  <div class="text-sm text-stone-500 mt-0.5">{{ line.product.priceFormatted }} за шт.</div>
                  <div v-if="line.qty > line.product.stock" class="text-xs text-rose-600 mt-1">В наличии только {{ line.product.stock }} шт.</div>
                </div>
                <button type="button" class="shrink-0 w-9 h-9 rounded-full grid place-items-center text-stone-400 hover:bg-stone-100 hover:text-rose-600" aria-label="Удалить" @click="remove(line.product.id)">
                  <Icon name="trash" size="w-4 h-4" />
                </button>
              </div>
              <div class="mt-3 flex items-center justify-between gap-3">
                <QtyStepper :model-value="line.qty" :min="0" :max="line.product.stock" @update:model-value="v => setQty(line.product.id, v)" />
                <div class="font-bold">{{ formatPrice(line.product.price * line.qty) }}</div>
              </div>
            </div>
          </div>
          <div v-if="missing > 0" class="p-4 text-sm text-stone-500 bg-stone-50 rounded-b-2xl">
            {{ missing }} {{ pluralize(missing, 'товар', 'товара', 'товаров') }} из корзины больше недоступны и были убраны.
          </div>
        </section>

        <!-- Checkout -->
        <aside class="lg:sticky lg:top-24 space-y-4">
          <div class="bg-white rounded-2xl border border-stone-200/80 p-5">
            <h2 class="font-bold text-lg">Итого</h2>
            <dl class="mt-3 space-y-2 text-sm">
              <div class="flex justify-between"><dt class="text-stone-500">{{ totalQty }} {{ pluralize(totalQty, 'товар', 'товара', 'товаров') }}</dt><dd>{{ formatPrice(itemsTotal) }}</dd></div>
              <div class="flex justify-between"><dt class="text-stone-500">Доставка</dt><dd>{{ deliveryPrice === 0 ? 'Бесплатно' : formatPrice(deliveryPrice) }}</dd></div>
              <div v-if="form.delivery === 'courier' && deliveryPrice > 0" class="text-xs text-stone-400">Бесплатно от {{ formatPrice(SHOP.freeDeliveryFrom) }} — добавьте ещё на {{ formatPrice(SHOP.freeDeliveryFrom - itemsTotal) }}</div>
            </dl>
            <div class="mt-4 pt-4 border-t border-stone-100 flex justify-between items-baseline">
              <span class="font-semibold">К оплате</span>
              <span class="text-2xl font-black">{{ formatPrice(itemsTotal + deliveryPrice) }}</span>
            </div>
          </div>

          <form class="bg-white rounded-2xl border border-stone-200/80 p-5 space-y-4" @submit.prevent="submit">
            <h2 class="font-bold text-lg">Оформление</h2>

            <div class="grid grid-cols-2 gap-2 p-1 rounded-full bg-stone-100 text-sm font-medium">
              <button v-for="(label, key) in DELIVERY_METHODS" :key="key" type="button" class="h-9 rounded-full transition" :class="form.delivery === key ? 'bg-white shadow-sm' : 'text-stone-500'" @click="form.delivery = key">{{ label }}</button>
            </div>

            <label class="block">
              <span class="text-sm text-stone-600">Имя</span>
              <input v-model="form.customerName" required class="mt-1 w-full h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500" placeholder="Как к вам обращаться" />
            </label>
            <label class="block">
              <span class="text-sm text-stone-600">Телефон</span>
              <input v-model="form.phone" required type="tel" class="mt-1 w-full h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500" placeholder="+7 (900) 000-00-00" />
            </label>
            <label class="block">
              <span class="text-sm text-stone-600">Email <span class="text-stone-400">(необязательно)</span></span>
              <input v-model="form.email" type="email" class="mt-1 w-full h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500" placeholder="для подтверждения заказа" />
            </label>
            <label v-if="form.delivery === 'courier'" class="block">
              <span class="text-sm text-stone-600">Адрес доставки</span>
              <input v-model="form.address" required class="mt-1 w-full h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500" placeholder="Город, улица, дом, квартира" />
            </label>
            <p v-else class="text-sm text-stone-500 rounded-xl bg-stone-50 p-3">Самовывоз: {{ SHOP.address }}, {{ SHOP.workingHours }}</p>
            <label class="block">
              <span class="text-sm text-stone-600">Комментарий</span>
              <textarea v-model="form.comment" rows="2" class="mt-1 w-full px-3 py-2 rounded-xl border border-stone-300 outline-none focus:border-stone-500" placeholder="Код домофона, удобное время…"></textarea>
            </label>

            <p v-if="error" class="text-sm text-rose-600 rounded-xl bg-rose-50 p-3">{{ error }}</p>

            <button type="submit" class="w-full h-12 rounded-full bg-stone-900 text-white font-semibold hover:bg-stone-700 disabled:opacity-50 inline-flex items-center justify-center gap-2" :disabled="submitting || hasStockIssues">
              <Icon v-if="submitting" name="spinner" size="w-5 h-5 animate-spin" />
              {{ submitting ? 'Оформляем…' : 'Оформить заказ' }}
            </button>
            <p class="text-xs text-stone-400 text-center">Нажимая кнопку, вы соглашаетесь с условиями обработки данных.</p>
          </form>
        </aside>
      </div>
    </main>

    <Footer :categories="categories" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import ProductImage from '../components/ProductImage.vue'
import QtyStepper from '../components/QtyStepper.vue'
import EmptyState from '../components/EmptyState.vue'
import { DELIVERY_METHODS, DeliveryMethod, SHOP } from '../shared/config'
import { CART_EVENT, clearCart, formatPrice, pluralize, readCart, removeFromCart, setCartQty, writeCart } from '../shared/cart'
import { catalogRoute } from '../catalog'
import { productRoute } from '../product'
import { orderRoute } from '../order'
import { productsByIdsRoute } from '../api/products/by-ids'
import { orderCreateRoute } from '../api/orders/create'

defineProps<{ categories: any[] }>()

type Line = { product: any; qty: number }

const loading = ref(true)
const lines = ref<Line[]>([])
const missing = ref(0)
const submitting = ref(false)
const error = ref('')

const form = reactive({
  delivery: 'courier' as DeliveryMethod,
  customerName: '',
  phone: '',
  email: '',
  address: '',
  comment: '',
})

const totalQty = computed(() => lines.value.reduce((s, l) => s + l.qty, 0))
const itemsTotal = computed(() => lines.value.reduce((s, l) => s + l.product.price * l.qty, 0))
const deliveryPrice = computed(() =>
  form.delivery === 'pickup' || itemsTotal.value >= SHOP.freeDeliveryFrom ? 0 : SHOP.deliveryPrice,
)
const hasStockIssues = computed(() => lines.value.some(l => l.qty > l.product.stock))

async function load() {
  const cart = readCart()
  if (!cart.length) {
    lines.value = []
    loading.value = false
    return
  }
  try {
    const products = await productsByIdsRoute.run(ctx, { ids: cart.map(c => c.id) })
    const byId = new Map(products.map((p: any) => [p.id, p]))
    const next: Line[] = []
    for (const item of cart) {
      const product = byId.get(item.id)
      if (product) next.push({ product, qty: item.qty })
    }
    missing.value = cart.length - next.length
    if (missing.value > 0) writeCart(next.map(l => ({ id: l.product.id, qty: l.qty })))
    lines.value = next
  } finally {
    loading.value = false
  }
}

function syncFromStorage() {
  const cart = readCart()
  const qtyById = new Map(cart.map(c => [c.id, c.qty]))
  lines.value = lines.value.filter(l => qtyById.has(l.product.id)).map(l => ({ ...l, qty: qtyById.get(l.product.id) ?? l.qty }))
}

function setQty(id: string, qty: number) {
  setCartQty(id, qty)
}
function remove(id: string) {
  removeFromCart(id)
}

async function submit() {
  error.value = ''
  submitting.value = true
  try {
    const result = await orderCreateRoute.run(ctx, {
      customerName: form.customerName,
      phone: form.phone,
      email: form.email || undefined,
      delivery: form.delivery,
      address: form.address || undefined,
      comment: form.comment || undefined,
      items: lines.value.map(l => ({ id: l.product.id, qty: l.qty })),
    })
    if (!result.ok) {
      error.value = result.error
      await load()
      return
    }
    clearCart()
    window.location.href = orderRoute.query({ id: result.order.id }).url()
  } catch {
    error.value = 'Не удалось оформить заказ. Попробуйте ещё раз.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  load()
  window.addEventListener(CART_EVENT, syncFromStorage)
})
onBeforeUnmount(() => window.removeEventListener(CART_EVENT, syncFromStorage))
</script>
