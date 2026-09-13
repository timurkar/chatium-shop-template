<template>
  <footer class="mt-20 border-t border-stone-200 bg-white">
    <div class="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
      <div class="md:col-span-2">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-stone-900 text-white grid place-items-center font-black text-sm">{{ SHOP.name.slice(0, 1) }}</span>
          <span class="font-black text-lg tracking-tight">{{ SHOP.name }}</span>
        </div>
        <p class="mt-4 text-sm text-stone-500 max-w-md">{{ SHOP.description }}</p>
      </div>
      <div>
        <h3 class="font-semibold text-sm">Каталог</h3>
        <ul class="mt-3 space-y-2 text-sm text-stone-500">
          <li><a :href="catalogRoute.url()" class="hover:text-stone-900">Все товары</a></li>
          <li v-for="c in categories" :key="c.id">
            <a :href="catalogRoute.query({ category: c.slug }).url()" class="hover:text-stone-900">{{ c.name }}</a>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-sm">Контакты</h3>
        <ul class="mt-3 space-y-2 text-sm text-stone-500">
          <li>{{ SHOP.phone }}</li>
          <li>{{ SHOP.email }}</li>
          <li>{{ SHOP.address }}</li>
          <li>{{ SHOP.workingHours }}</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-stone-100">
      <div class="max-w-7xl mx-auto px-4 py-5 text-xs text-stone-400 flex flex-wrap gap-2 justify-between">
        <span>© {{ year }} {{ SHOP.name }}. Все права защищены.</span>
        <span>Сделано на Chatium</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SHOP } from '../shared/config'
import { catalogRoute } from '../catalog'

withDefaults(defineProps<{ categories?: Array<{ id: string; name: string; slug: string }> }>(), {
  categories: () => [],
})

const year = new Date().getFullYear()
</script>
