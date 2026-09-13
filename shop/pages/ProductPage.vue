<template>
  <div class="min-h-screen flex flex-col">
    <Header :categories="categories" active="catalog" :active-category="product.categorySlug ?? ''" />

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <nav class="text-sm text-stone-500 flex flex-wrap items-center gap-2">
        <a :href="indexRoute.url()" class="hover:text-stone-900">Главная</a>
        <span>/</span>
        <a :href="catalogRoute.url()" class="hover:text-stone-900">Каталог</a>
        <template v-if="product.categoryName">
          <span>/</span>
          <a :href="catalogRoute.query({ category: product.categorySlug }).url()" class="hover:text-stone-900">{{ product.categoryName }}</a>
        </template>
        <span>/</span>
        <span class="text-stone-900 line-clamp-1">{{ product.title }}</span>
      </nav>

      <div class="mt-6 grid lg:grid-cols-2 gap-8 lg:gap-14">
        <div class="relative">
          <ProductImage
            :image-hash="product.imageHash"
            :emoji="product.emoji"
            :title="product.title"
            :seed="product.id"
            :width="1000"
            wrapper-class="aspect-square rounded-3xl"
            emoji-class="text-[10rem] md:text-[14rem]"
          />
          <div class="absolute top-4 left-4 flex gap-2">
            <span v-if="product.discountPercent" class="px-3 py-1 rounded-full bg-rose-500 text-white text-sm font-bold">−{{ product.discountPercent }}%</span>
            <span v-else-if="product.badge" class="px-3 py-1 rounded-full bg-stone-900 text-white text-sm font-semibold">{{ product.badge }}</span>
          </div>
        </div>

        <div class="flex flex-col">
          <span v-if="product.categoryName" class="text-sm text-stone-500">{{ product.categoryName }}</span>
          <h1 class="mt-1 text-3xl md:text-4xl font-black tracking-tight">{{ product.title }}</h1>

          <div class="mt-5 flex items-baseline gap-3">
            <span class="text-3xl font-black">{{ product.priceFormatted }}</span>
            <span v-if="product.oldPriceFormatted" class="text-lg text-stone-400 line-through">{{ product.oldPriceFormatted }}</span>
          </div>

          <p class="mt-2 text-sm" :class="product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'">
            <template v-if="product.stock > 5">✓ В наличии</template>
            <template v-else-if="product.stock > 0">Осталось {{ product.stock }} шт.</template>
            <template v-else>Нет в наличии</template>
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <QtyStepper v-model="qty" :min="1" :max="Math.max(product.stock, 1)" size="lg" />
            <button
              type="button"
              class="h-12 px-7 rounded-full bg-stone-900 text-white font-semibold hover:bg-stone-700 disabled:bg-stone-300 inline-flex items-center gap-2 transition"
              :disabled="product.stock <= 0"
              @click="add"
            >
              <Icon :name="added ? 'check' : 'cart'" size="w-5 h-5" />
              {{ added ? 'Добавлено' : 'В корзину' }}
            </button>
            <a v-if="inCart > 0" :href="cartRoute.url()" class="h-12 px-5 rounded-full border border-stone-300 font-medium inline-flex items-center gap-2 hover:bg-white">
              В корзине {{ inCart }} шт. <Icon name="arrow-right" size="w-4 h-4" />
            </a>
          </div>

          <div class="mt-8 prose prose-stone max-w-none">
            <h2 class="text-lg font-bold">Описание</h2>
            <p class="mt-2 text-stone-600 leading-relaxed whitespace-pre-line">{{ product.description }}</p>
          </div>

          <ul class="mt-8 grid sm:grid-cols-3 gap-3 text-sm">
            <li class="rounded-xl bg-white border border-stone-200/80 p-4 flex gap-3"><Icon name="truck" size="w-5 h-5 text-amber-600 shrink-0" /><span>Доставка 1–2 дня, бесплатно от {{ freeFrom }}</span></li>
            <li class="rounded-xl bg-white border border-stone-200/80 p-4 flex gap-3"><Icon name="refresh" size="w-5 h-5 text-amber-600 shrink-0" /><span>Возврат в течение 14 дней</span></li>
            <li class="rounded-xl bg-white border border-stone-200/80 p-4 flex gap-3"><Icon name="shield" size="w-5 h-5 text-amber-600 shrink-0" /><span>Проверяем перед отправкой</span></li>
          </ul>
        </div>
      </div>

      <section v-if="related.length" class="mt-16">
        <SectionTitle title="Похожие товары" :link-href="product.categorySlug ? catalogRoute.query({ category: product.categorySlug }).url() : catalogRoute.url()" />
        <ProductGrid :products="related" />
      </section>
    </main>

    <Footer :categories="categories" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import ProductImage from '../components/ProductImage.vue'
import QtyStepper from '../components/QtyStepper.vue'
import SectionTitle from '../components/SectionTitle.vue'
import ProductGrid from '../components/ProductGrid.vue'
import { SHOP } from '../shared/config'
import { CART_EVENT, addToCart, cartQtyOf, formatPrice } from '../shared/cart'
import { indexRoute } from '../index'
import { catalogRoute } from '../catalog'
import { cartRoute } from '../cart'

const props = defineProps<{ product: any; related: any[]; categories: any[] }>()

const qty = ref(1)
const added = ref(false)
const inCart = ref(0)
const freeFrom = formatPrice(SHOP.freeDeliveryFrom)
let addedTimer: ReturnType<typeof setTimeout> | null = null

function refresh() {
  inCart.value = cartQtyOf(props.product.id)
}

function add() {
  addToCart(props.product.id, qty.value)
  added.value = true
  if (addedTimer) clearTimeout(addedTimer)
  addedTimer = setTimeout(() => (added.value = false), 1500)
}

onMounted(() => {
  refresh()
  window.addEventListener(CART_EVENT, refresh)
})
onBeforeUnmount(() => window.removeEventListener(CART_EVENT, refresh))
</script>
