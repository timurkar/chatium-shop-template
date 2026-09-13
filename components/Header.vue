<template>
  <header class="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-stone-200">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
      <button
        type="button"
        class="md:hidden -ml-2 p-2 rounded-lg hover:bg-stone-100"
        aria-label="Меню"
        @click="menuOpen = !menuOpen"
      >
        <Icon :name="menuOpen ? 'close' : 'menu'" size="w-6 h-6" />
      </button>

      <a :href="indexRoute.url()" class="flex items-center gap-2 shrink-0">
        <span class="w-8 h-8 rounded-lg bg-stone-900 text-white grid place-items-center font-black text-sm">{{ SHOP.name.slice(0, 1) }}</span>
        <span class="font-black text-lg tracking-tight">{{ SHOP.name }}</span>
      </a>

      <nav class="hidden md:flex items-center gap-1 ml-4 text-sm">
        <a
          :href="catalogRoute.url()"
          class="px-3 py-2 rounded-lg hover:bg-stone-100"
          :class="{ 'bg-stone-100 font-semibold': active === 'catalog' && !activeCategory }"
        >Все товары</a>
        <a
          v-for="c in categories.slice(0, 5)"
          :key="c.id"
          :href="catalogRoute.query({ category: c.slug }).url()"
          class="px-3 py-2 rounded-lg hover:bg-stone-100 whitespace-nowrap"
          :class="{ 'bg-stone-100 font-semibold': activeCategory === c.slug }"
        >{{ c.name }}</a>
      </nav>

      <form class="hidden sm:flex flex-1 max-w-sm ml-auto" @submit.prevent="search">
        <label class="relative w-full">
          <span class="absolute inset-y-0 left-3 flex items-center text-stone-400"><Icon name="search" size="w-4 h-4" /></span>
          <input
            v-model="query"
            type="search"
            placeholder="Поиск по каталогу"
            class="w-full h-10 pl-9 pr-3 rounded-full bg-stone-100 border border-transparent focus:bg-white focus:border-stone-300 outline-none text-sm"
          />
        </label>
      </form>

      <div class="flex items-center gap-1 ml-auto sm:ml-0">
        <a
          v-if="isStaff"
          :href="adminRoute.url()"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 h-10 rounded-full text-sm hover:bg-stone-100"
          title="Панель управления"
        >
          <Icon name="settings" size="w-4 h-4" /> Админка
        </a>
        <a
          :href="cartRoute.url()"
          class="relative inline-flex items-center gap-2 h-10 px-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700"
        >
          <Icon name="cart" size="w-4 h-4" />
          <span class="hidden sm:inline">Корзина</span>
          <span
            v-if="count > 0"
            class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-amber-400 text-stone-900 text-xs font-bold grid place-items-center"
          >{{ count }}</span>
        </a>
      </div>
    </div>

    <div v-if="menuOpen" class="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3">
      <form class="flex" @submit.prevent="search">
        <input
          v-model="query"
          type="search"
          placeholder="Поиск по каталогу"
          class="w-full h-10 px-4 rounded-full bg-stone-100 outline-none text-sm"
        />
      </form>
      <nav class="grid gap-1 text-sm">
        <a :href="catalogRoute.url()" class="px-3 py-2 rounded-lg hover:bg-stone-100 font-medium">Все товары</a>
        <a
          v-for="c in categories"
          :key="c.id"
          :href="catalogRoute.query({ category: c.slug }).url()"
          class="px-3 py-2 rounded-lg hover:bg-stone-100"
        >{{ c.emoji }} {{ c.name }}</a>
        <a v-if="isStaff" :href="adminRoute.url()" class="px-3 py-2 rounded-lg hover:bg-stone-100">⚙️ Админка</a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from './Icon.vue'
import { SHOP } from '../shared/config'
import { CART_EVENT, cartCount } from '../shared/cart'
import { indexRoute } from '../index'
import { catalogRoute } from '../catalog'
import { cartRoute } from '../cart'
import { adminRoute } from '../admin'

type Category = { id: string; name: string; slug: string; emoji: string }

const props = withDefaults(
  defineProps<{
    categories?: Category[]
    active?: 'home' | 'catalog' | 'cart' | 'admin'
    activeCategory?: string
    initialQuery?: string
  }>(),
  { categories: () => [], active: 'home', activeCategory: '', initialQuery: '' },
)

const menuOpen = ref(false)
const query = ref(props.initialQuery)
const count = ref(0)
const isStaff = ref(false)

function refreshCount() {
  count.value = cartCount()
}

function search() {
  const q = query.value.trim()
  window.location.href = q ? catalogRoute.query({ q }).url() : catalogRoute.url()
}

onMounted(() => {
  refreshCount()
  isStaff.value = !!ctx.user?.is?.('Staff')
  window.addEventListener(CART_EVENT, refreshCount)
  window.addEventListener('storage', refreshCount)
})

onBeforeUnmount(() => {
  window.removeEventListener(CART_EVENT, refreshCount)
  window.removeEventListener('storage', refreshCount)
})
</script>
