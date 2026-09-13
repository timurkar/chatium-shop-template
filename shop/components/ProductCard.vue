<template>
  <article class="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition">
    <a :href="productRoute.query({ id: product.id }).url()" class="block relative">
      <ProductImage
        :image-hash="product.imageHash"
        :title="product.title"
        wrapper-class="aspect-square [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-105"
      />
      <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
        <span v-if="product.discountPercent" class="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">−{{ product.discountPercent }}%</span>
        <span v-else-if="product.badge" class="px-2 py-0.5 rounded-full bg-stone-900 text-white text-xs font-semibold">{{ product.badge }}</span>
      </div>
      <span v-if="product.stock <= 0" class="absolute inset-0 grid place-items-center bg-white/70 text-sm font-semibold text-stone-600">Нет в наличии</span>
    </a>

    <div class="p-4 flex flex-col flex-1 gap-2">
      <span v-if="product.categoryName" class="text-xs text-stone-400">{{ product.categoryName }}</span>
      <a :href="productRoute.query({ id: product.id }).url()" class="font-semibold leading-snug line-clamp-2 hover:underline">{{ product.title }}</a>
      <div class="mt-auto flex items-end justify-between gap-3 pt-2">
        <div>
          <div class="text-lg font-bold">{{ product.priceFormatted }}</div>
          <div v-if="product.oldPriceFormatted" class="text-xs text-stone-400 line-through">{{ product.oldPriceFormatted }}</div>
        </div>
        <button
          v-if="qty === 0"
          type="button"
          class="h-10 px-4 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 disabled:bg-stone-300 flex items-center gap-2"
          :disabled="product.stock <= 0"
          @click="add"
        >
          <Icon name="cart" size="w-4 h-4" /><span class="hidden lg:inline whitespace-nowrap">В корзину</span>
        </button>
        <QtyStepper v-else :model-value="qty" :min="0" :max="product.stock" @update:model-value="setQty" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from './Icon.vue'
import ProductImage from './ProductImage.vue'
import QtyStepper from './QtyStepper.vue'
import { productRoute } from '../product'
import { CART_EVENT, addToCart, cartQtyOf, setCartQty } from '../shared/cart'

type Product = {
  id: string
  title: string
  priceFormatted: string
  oldPriceFormatted: string | null
  discountPercent: number | null
  categoryName: string | null
  imageHash: string | null
  stock: number
  badge: string | null
}

const props = defineProps<{ product: Product }>()
const qty = ref(0)

function refresh() {
  qty.value = cartQtyOf(props.product.id)
}
function add() {
  addToCart(props.product.id, 1)
}
function setQty(value: number) {
  setCartQty(props.product.id, value)
}

onMounted(() => {
  refresh()
  window.addEventListener(CART_EVENT, refresh)
})
onBeforeUnmount(() => window.removeEventListener(CART_EVENT, refresh))
</script>
