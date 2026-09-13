<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    <ProductCard v-for="p in products" :key="p.id" :product="p" />
  </div>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue'

defineProps<{ products: any[] }>()
</script>
