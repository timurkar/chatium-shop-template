<template>
  <div class="min-h-screen flex flex-col">
    <Header :categories="categories" active="admin" />

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-black tracking-tight">Панель управления</h1>
          <p class="mt-1 text-stone-500">Товары, заказы и категории магазина</p>
        </div>
        <a :href="adminProductRoute.url()" class="h-11 px-5 rounded-full bg-stone-900 text-white font-medium inline-flex items-center gap-2 hover:bg-stone-700">
          <Icon name="plus" size="w-4 h-4" /> Новый товар
        </a>
      </div>

      <div class="mt-6 inline-flex p-1 rounded-full bg-stone-200/70 text-sm font-medium">
        <button v-for="t in tabs" :key="t.key" type="button" class="h-9 px-4 rounded-full transition" :class="tab === t.key ? 'bg-white shadow-sm' : 'text-stone-500 hover:text-stone-900'" @click="tab = t.key">
          {{ t.label }} <span class="ml-1 text-xs text-stone-400">{{ t.count }}</span>
        </button>
      </div>

      <p v-if="error" class="mt-4 text-sm text-rose-600 rounded-xl bg-rose-50 p-3">{{ error }}</p>

      <!-- Products -->
      <section v-if="tab === 'products'" class="mt-6">
        <div class="flex flex-wrap gap-2 mb-4">
          <input v-model="productQuery" type="search" placeholder="Поиск по названию" class="h-10 px-4 rounded-full bg-white border border-stone-300 outline-none focus:border-stone-500 text-sm w-64" />
          <select v-model="productCategory" class="h-10 px-3 rounded-full bg-white border border-stone-300 text-sm outline-none">
            <option value="">Все категории</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.emoji }} {{ c.name }}</option>
          </select>
        </div>
        <EmptyState v-if="!products.length" emoji="📦" title="Товаров пока нет" text="Добавьте первый товар или наполните каталог демо-данными.">
          <a :href="adminProductRoute.url()" class="h-11 px-5 rounded-full bg-stone-900 text-white font-medium inline-flex items-center">Добавить товар</a>
          <button type="button" class="h-11 px-5 rounded-full border border-stone-300 font-medium hover:bg-white" :disabled="busy" @click="seed">Демо-данные</button>
        </EmptyState>
        <div v-else class="bg-white rounded-2xl border border-stone-200/80 overflow-x-auto">
          <table class="w-full text-sm min-w-[720px]">
            <thead class="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-100">
              <tr><th class="p-4">Товар</th><th class="p-4">Категория</th><th class="p-4 text-right">Цена</th><th class="p-4 text-right">Остаток</th><th class="p-4">Статус</th><th class="p-4"></th></tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr v-for="p in filteredProducts" :key="p.id" class="hover:bg-stone-50/70">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <ProductImage :image-hash="p.imageHash" :emoji="p.emoji" :title="p.title" :seed="p.id" :width="100" wrapper-class="w-11 h-11 rounded-lg shrink-0" emoji-class="text-xl" />
                    <div class="min-w-0">
                      <a :href="adminProductRoute.query({ id: p.id }).url()" class="font-medium hover:underline line-clamp-1">{{ p.title }}</a>
                      <div class="text-xs text-stone-400 flex gap-2"><span v-if="p.featured">★ хит</span><span v-if="p.badge">{{ p.badge }}</span></div>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-stone-500">{{ p.categoryName ?? '—' }}</td>
                <td class="p-4 text-right whitespace-nowrap">
                  <div class="font-semibold">{{ p.priceFormatted }}</div>
                  <div v-if="p.oldPriceFormatted" class="text-xs text-stone-400 line-through">{{ p.oldPriceFormatted }}</div>
                </td>
                <td class="p-4 text-right" :class="p.stock === 0 ? 'text-rose-600 font-semibold' : ''">{{ p.stock }}</td>
                <td class="p-4">
                  <button type="button" class="rounded-full px-2.5 py-1 text-xs font-medium" :class="p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'" :disabled="busy" @click="toggleStatus(p)">
                    {{ PRODUCT_STATUSES[p.status as 'active' | 'draft'] }}
                  </button>
                </td>
                <td class="p-4 text-right whitespace-nowrap">
                  <a :href="productRoute.query({ id: p.id }).url()" class="inline-grid place-items-center w-9 h-9 rounded-full hover:bg-stone-100 text-stone-500" title="Открыть на сайте" target="_blank"><Icon name="arrow-right" size="w-4 h-4" /></a>
                  <a :href="adminProductRoute.query({ id: p.id }).url()" class="inline-grid place-items-center w-9 h-9 rounded-full hover:bg-stone-100 text-stone-500" title="Редактировать"><Icon name="edit" size="w-4 h-4" /></a>
                  <button type="button" class="inline-grid place-items-center w-9 h-9 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600" title="Удалить" :disabled="busy" @click="deleteProduct(p)"><Icon name="trash" size="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Orders -->
      <section v-if="tab === 'orders'" class="mt-6">
        <div class="flex flex-wrap gap-2 mb-4">
          <button type="button" class="h-9 px-3 rounded-full text-sm border" :class="orderStatus === '' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300'" @click="orderStatus = ''">Все</button>
          <button v-for="(label, key) in ORDER_STATUSES" :key="key" type="button" class="h-9 px-3 rounded-full text-sm border" :class="orderStatus === key ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300'" @click="orderStatus = key">{{ label }}</button>
        </div>
        <EmptyState v-if="!filteredOrders.length" emoji="🧾" title="Заказов нет" text="Здесь появятся заказы покупателей." />
        <div v-else class="space-y-3">
          <details v-for="o in filteredOrders" :key="o.id" class="bg-white rounded-2xl border border-stone-200/80 group">
            <summary class="p-4 flex flex-wrap items-center gap-3 cursor-pointer list-none">
              <span class="font-bold">№{{ o.number }}</span>
              <span class="text-sm text-stone-500">{{ formatDate(o.createdAt) }}</span>
              <span class="text-sm">{{ o.customerName }} · {{ o.phone }}</span>
              <span class="ml-auto font-bold">{{ o.totalFormatted }}</span>
              <select :value="o.status" class="h-9 px-2 rounded-full border border-stone-300 text-sm bg-white" :disabled="busy" @click.stop @change="(e: Event) => setOrderStatus(o, (e.target as HTMLSelectElement).value)">
                <option v-for="(label, key) in ORDER_STATUSES" :key="key" :value="key">{{ label }}</option>
              </select>
            </summary>
            <div class="px-4 pb-4 grid md:grid-cols-[1fr_280px] gap-4">
              <ul class="divide-y divide-stone-100 text-sm">
                <li v-for="item in o.items" :key="item.productId" class="py-2 flex items-center gap-3">
                  <span class="text-xl">{{ item.emoji }}</span>
                  <span class="flex-1">{{ item.title }}</span>
                  <span class="text-stone-500">{{ item.qty }} × {{ item.priceFormatted }}</span>
                  <span class="font-medium w-24 text-right">{{ item.sumFormatted }}</span>
                </li>
                <li class="py-2 flex justify-between text-stone-500"><span>Доставка</span><span>{{ o.deliveryPrice === 0 ? 'Бесплатно' : o.deliveryPriceFormatted }}</span></li>
              </ul>
              <div class="rounded-xl bg-stone-50 p-3 text-sm space-y-1">
                <div><span class="text-stone-500">Получение:</span> {{ DELIVERY_METHODS[o.delivery as 'courier' | 'pickup'] }}</div>
                <div v-if="o.address"><span class="text-stone-500">Адрес:</span> {{ o.address }}</div>
                <div v-if="o.email"><span class="text-stone-500">Email:</span> {{ o.email }}</div>
                <div v-if="o.comment"><span class="text-stone-500">Комментарий:</span> {{ o.comment }}</div>
                <a :href="orderRoute.query({ id: o.id }).url()" target="_blank" class="inline-block mt-2 underline text-stone-600">Страница заказа</a>
              </div>
            </div>
          </details>
        </div>
      </section>

      <!-- Categories -->
      <section v-if="tab === 'categories'" class="mt-6 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div class="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100">
          <div v-if="!categories.length" class="p-8 text-center text-stone-500">Категорий пока нет</div>
          <div v-for="c in categories" :key="c.id" class="p-4 flex items-center gap-3">
            <template v-if="editingCategory?.id === c.id">
              <input v-model="editingCategory.emoji" class="w-14 h-10 text-center rounded-lg border border-stone-300" />
              <input v-model="editingCategory.name" class="flex-1 h-10 px-3 rounded-lg border border-stone-300" />
              <input v-model="editingCategory.description" placeholder="Описание" class="flex-1 h-10 px-3 rounded-lg border border-stone-300 hidden md:block" />
              <button type="button" class="h-10 px-4 rounded-full bg-stone-900 text-white text-sm" :disabled="busy" @click="saveCategory">Сохранить</button>
              <button type="button" class="h-10 px-3 rounded-full text-sm text-stone-500" @click="editingCategory = null">Отмена</button>
            </template>
            <template v-else>
              <span class="text-2xl w-10 text-center">{{ c.emoji }}</span>
              <div class="flex-1 min-w-0">
                <div class="font-medium">{{ c.name }} <span class="text-xs text-stone-400 font-normal">/{{ c.slug }}</span></div>
                <div class="text-sm text-stone-500 line-clamp-1">{{ c.description || '—' }}</div>
              </div>
              <span class="text-xs text-stone-400">{{ productCountIn(c.id) }} тов.</span>
              <button type="button" class="w-9 h-9 rounded-full grid place-items-center hover:bg-stone-100 text-stone-500" @click="editingCategory = { ...c }"><Icon name="edit" size="w-4 h-4" /></button>
              <button type="button" class="w-9 h-9 rounded-full grid place-items-center hover:bg-rose-50 text-stone-400 hover:text-rose-600" :disabled="busy" @click="deleteCategory(c)"><Icon name="trash" size="w-4 h-4" /></button>
            </template>
          </div>
        </div>
        <form class="bg-white rounded-2xl border border-stone-200/80 p-5 space-y-3" @submit.prevent="createCategory">
          <h2 class="font-bold">Новая категория</h2>
          <div class="flex gap-2">
            <input v-model="newCategory.emoji" placeholder="🛍️" class="w-16 h-11 text-center rounded-xl border border-stone-300 outline-none focus:border-stone-500" />
            <input v-model="newCategory.name" required placeholder="Название" class="flex-1 h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500" />
          </div>
          <input v-model="newCategory.description" placeholder="Короткое описание" class="w-full h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500" />
          <button type="submit" class="w-full h-11 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-700 disabled:opacity-50" :disabled="busy">Добавить</button>
        </form>
      </section>
    </main>

    <Footer :categories="categories" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import ProductImage from '../components/ProductImage.vue'
import EmptyState from '../components/EmptyState.vue'
import { DELIVERY_METHODS, ORDER_STATUSES, PRODUCT_STATUSES } from '../shared/config'
import { adminProductRoute } from '../admin-product'
import { productRoute } from '../product'
import { orderRoute } from '../order'
import { seedRoute } from '../seed'
import { productUpdateRoute } from '../api/products/update'
import { productDeleteRoute } from '../api/products/delete'
import { orderUpdateStatusRoute } from '../api/orders/update-status'
import { categoryCreateRoute } from '../api/categories/create'
import { categoryUpdateRoute } from '../api/categories/update'
import { categoryDeleteRoute } from '../api/categories/delete'

const props = defineProps<{
  categories: any[]
  products: any[]
  orders: any[]
  initialTab: string
}>()

type Tab = 'products' | 'orders' | 'categories'
const tab = ref<Tab>((props.initialTab as Tab) || 'products')
const products = ref<any[]>(props.products)
const orders = ref<any[]>(props.orders)
const categories = ref<any[]>(props.categories)
const busy = ref(false)
const error = ref('')

const tabs = computed(() => [
  { key: 'products' as Tab, label: 'Товары', count: products.value.length },
  { key: 'orders' as Tab, label: 'Заказы', count: orders.value.filter(o => o.status === 'new').length || orders.value.length },
  { key: 'categories' as Tab, label: 'Категории', count: categories.value.length },
])

const productQuery = ref('')
const productCategory = ref('')
const filteredProducts = computed(() => {
  const q = productQuery.value.trim().toLowerCase()
  return products.value.filter(p => (!q || p.title.toLowerCase().includes(q)) && (!productCategory.value || p.categoryId === productCategory.value))
})

const orderStatus = ref('')
const filteredOrders = computed(() => orders.value.filter(o => !orderStatus.value || o.status === orderStatus.value))

const newCategory = reactive({ name: '', emoji: '', description: '' })
const editingCategory = ref<any | null>(null)

function productCountIn(categoryId: string) {
  return products.value.filter(p => p.categoryId === categoryId).length
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

async function run(action: () => Promise<void>) {
  busy.value = true
  error.value = ''
  try {
    await action()
  } catch (e: any) {
    error.value = e?.message || 'Не удалось выполнить действие'
  } finally {
    busy.value = false
  }
}

function toggleStatus(p: any) {
  return run(async () => {
    const updated = await productUpdateRoute.query({ id: p.id }).run(ctx, {
      title: p.title,
      description: p.description,
      price: p.price,
      oldPrice: p.oldPrice ?? undefined,
      categoryId: p.categoryId ?? undefined,
      emoji: p.emoji,
      imageHash: p.imageHash ?? undefined,
      status: p.status === 'active' ? 'draft' : 'active',
      stock: p.stock,
      featured: p.featured,
      badge: p.badge ?? undefined,
      sortOrder: p.sortOrder,
    })
    products.value = products.value.map(x => (x.id === updated.id ? updated : x))
  })
}

function deleteProduct(p: any) {
  if (!window.confirm(`Удалить «${p.title}»?`)) return
  return run(async () => {
    await productDeleteRoute.query({ id: p.id }).run(ctx)
    products.value = products.value.filter(x => x.id !== p.id)
  })
}

function setOrderStatus(o: any, status: string) {
  return run(async () => {
    const updated = await orderUpdateStatusRoute.query({ id: o.id }).run(ctx, { status: status as any })
    orders.value = orders.value.map(x => (x.id === updated.id ? updated : x))
  })
}

function createCategory() {
  return run(async () => {
    const created = await categoryCreateRoute.run(ctx, { ...newCategory })
    categories.value = [...categories.value, created]
    newCategory.name = ''
    newCategory.emoji = ''
    newCategory.description = ''
  })
}

function saveCategory() {
  const c = editingCategory.value
  if (!c) return
  return run(async () => {
    const updated = await categoryUpdateRoute.query({ id: c.id }).run(ctx, { name: c.name, emoji: c.emoji, description: c.description })
    categories.value = categories.value.map(x => (x.id === updated.id ? updated : x))
    editingCategory.value = null
  })
}

function deleteCategory(c: any) {
  if (!window.confirm(`Удалить категорию «${c.name}»?`)) return
  return run(async () => {
    await categoryDeleteRoute.query({ id: c.id }).run(ctx)
    categories.value = categories.value.filter(x => x.id !== c.id)
  })
}

function seed() {
  return run(async () => {
    await seedRoute.run(ctx)
    window.location.reload()
  })
}
</script>
