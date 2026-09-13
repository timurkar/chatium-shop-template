<template>
  <header class="sticky top-0 z-40 bg-white border-b border-stone-200">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
      <a :href="adminRoute.url()" class="flex items-center gap-2 shrink-0">
        <span class="w-8 h-8 rounded-lg bg-stone-900 text-white grid place-items-center"><Icon name="settings" size="w-4 h-4" /></span>
        <span class="font-black text-lg tracking-tight">{{ SHOP.name }} <span class="text-stone-400 font-medium">· админка</span></span>
      </a>
      <nav class="hidden sm:flex items-center gap-1 ml-4 text-sm">
        <a :href="adminRoute.query({ tab: 'products' }).url()" class="px-3 py-2 rounded-lg hover:bg-stone-100" :class="{ 'bg-stone-100 font-semibold': active === 'products' }">Товары</a>
        <a :href="adminRoute.query({ tab: 'orders' }).url()" class="px-3 py-2 rounded-lg hover:bg-stone-100" :class="{ 'bg-stone-100 font-semibold': active === 'orders' }">Заказы</a>
        <a :href="adminRoute.query({ tab: 'categories' }).url()" class="px-3 py-2 rounded-lg hover:bg-stone-100" :class="{ 'bg-stone-100 font-semibold': active === 'categories' }">Категории</a>
      </nav>
      <a :href="indexRoute.url()" target="_blank" class="ml-auto inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-stone-300 text-sm font-medium hover:bg-stone-50">
        Открыть магазин <Icon name="arrow-right" size="w-4 h-4" />
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import Icon from '../../shop/components/Icon.vue'
import { SHOP } from '../../shop/shared/config'
import { indexRoute } from '../../shop/index'
import { adminRoute } from '../index'

withDefaults(defineProps<{ active?: 'products' | 'orders' | 'categories' | 'form' }>(), { active: 'products' })
</script>
