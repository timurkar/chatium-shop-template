<template>
  <div class="min-h-screen flex flex-col">
    <Header :categories="categories" active="catalog" :active-category="filter.category" :initial-query="filter.q" />

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <nav class="text-sm text-stone-500 flex items-center gap-2">
        <a :href="indexRoute.url()" class="hover:text-stone-900">Главная</a>
        <span>/</span>
        <a :href="catalogRoute.url()" class="hover:text-stone-900" :class="{ 'text-stone-900': !currentCategory }">Каталог</a>
        <template v-if="currentCategory"><span>/</span><span class="text-stone-900">{{ currentCategory.name }}</span></template>
      </nav>

      <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-black tracking-tight">
            {{ currentCategory ? currentCategory.emoji + ' ' + currentCategory.name : query ? `Поиск: «${query}»` : 'Все товары' }}
          </h1>
          <p class="mt-1 text-stone-500">{{ products.length }} {{ pluralize(products.length, 'товар', 'товара', 'товаров') }}</p>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-stone-500 hidden sm:block">Сортировка</label>
          <select v-model="sort" class="h-10 px-3 rounded-full border border-stone-300 bg-white text-sm outline-none focus:border-stone-500" @change="reload">
            <option v-for="(label, key) in SORT_OPTIONS" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
      </div>

      <!-- Category chips -->
      <div class="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        <a
          :href="catalogRoute.url()"
          class="shrink-0 h-10 px-4 rounded-full border text-sm font-medium inline-flex items-center"
          :class="!filter.category ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300 hover:border-stone-500'"
        >Все</a>
        <a
          v-for="c in categories"
          :key="c.id"
          :href="catalogRoute.query({ category: c.slug }).url()"
          class="shrink-0 h-10 px-4 rounded-full border text-sm font-medium inline-flex items-center gap-1.5"
          :class="filter.category === c.slug ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300 hover:border-stone-500'"
        >{{ c.emoji }} {{ c.name }}</a>
      </div>

      <!-- Search -->
      <form class="mt-4 flex gap-2 max-w-lg" @submit.prevent="reload">
        <label class="relative flex-1">
          <span class="absolute inset-y-0 left-3 flex items-center text-stone-400"><Icon name="search" size="w-4 h-4" /></span>
          <input v-model="query" type="search" placeholder="Найти товар" class="w-full h-11 pl-9 pr-3 rounded-full bg-white border border-stone-300 outline-none focus:border-stone-500 text-sm" />
        </label>
        <button type="submit" class="h-11 px-5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700">Найти</button>
      </form>

      <div class="mt-8" :aria-busy="loading">
        <p v-if="error" class="text-rose-600">{{ error }}</p>
        <div v-else-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <div v-for="i in 8" :key="i" class="rounded-2xl bg-white border border-stone-200/80 overflow-hidden animate-pulse">
            <div class="aspect-square bg-stone-100"></div>
            <div class="p-4 space-y-2"><div class="h-3 bg-stone-100 rounded w-1/3"></div><div class="h-4 bg-stone-100 rounded w-3/4"></div><div class="h-6 bg-stone-100 rounded w-1/2 mt-4"></div></div>
          </div>
        </div>
        <EmptyState v-else-if="!products.length" emoji="🔍" title="Ничего не нашли" text="Попробуйте изменить запрос или выбрать другую категорию.">
          <a :href="catalogRoute.url()" class="h-11 px-5 rounded-full bg-stone-900 text-white font-medium inline-flex items-center">Показать все товары</a>
        </EmptyState>
        <ProductGrid v-else :products="products" />
      </div>
    </main>

    <Footer :categories="categories" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import ProductGrid from '../components/ProductGrid.vue'
import EmptyState from '../components/EmptyState.vue'
import { SORT_OPTIONS } from '../shared/config'
import { pluralize } from '../shared/cart'
import { indexRoute } from '../index'
import { catalogRoute } from '../catalog'
import { productsListRoute } from '../backend/products/list'

const props = defineProps<{
  categories: any[]
  products: any[]
  filter: { category: string; q: string; sort: string }
}>()

const products = ref<any[]>(props.products)
const query = ref(props.filter.q)
const sort = ref(props.filter.sort)
const loading = ref(false)
const error = ref('')

const currentCategory = computed(() => props.categories.find(c => c.slug === props.filter.category) ?? null)

async function reload() {
  loading.value = true
  error.value = ''
  try {
    products.value = await productsListRoute
      .query({ category: props.filter.category || undefined, q: query.value.trim() || undefined, sort: sort.value, limit: '200' })
      .run(ctx)
  } catch {
    error.value = 'Не удалось загрузить товары. Обновите страницу.'
  } finally {
    loading.value = false
  }
}
</script>
