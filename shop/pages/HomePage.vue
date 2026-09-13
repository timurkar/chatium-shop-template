<template>
  <div class="min-h-screen flex flex-col">
    <Header :categories="categories" active="home" />

    <main class="flex-1">
      <!-- Hero -->
      <section class="max-w-7xl mx-auto px-4 pt-8 md:pt-12">
        <div class="relative overflow-hidden rounded-3xl bg-stone-900 text-white px-6 py-14 md:px-14 md:py-20">
          <img v-if="heroImage" :src="heroImage" alt="" class="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div class="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-stone-900/20"></div>
          <div class="relative max-w-2xl">
            <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Бесплатная доставка от {{ freeFrom }}
            </span>
            <h1 class="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">{{ SHOP.tagline }}</h1>
            <p class="mt-5 text-stone-300 text-lg max-w-xl">{{ SHOP.description }}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a :href="catalogRoute.url()" class="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white text-stone-900 font-semibold hover:bg-stone-200">
                Смотреть каталог <Icon name="arrow-right" size="w-4 h-4" />
              </a>
              <a v-if="categories[0]" :href="catalogRoute.query({ category: categories[0].slug }).url()" class="inline-flex items-center h-12 px-6 rounded-full border border-white/30 hover:bg-white/10 font-medium">
                {{ categories[0].name }}
              </a>
            </div>
          </div>
          <div class="relative mt-10 grid grid-cols-3 gap-4 max-w-md text-sm text-stone-300">
            <div><div class="text-2xl font-black text-white">{{ productCount }}+</div>товаров в каталоге</div>
            <div><div class="text-2xl font-black text-white">1–2</div>дня доставка по городу</div>
            <div><div class="text-2xl font-black text-white">14</div>дней на возврат</div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section v-if="categories.length" class="max-w-7xl mx-auto px-4 mt-14">
        <SectionTitle title="Категории" subtitle="Выберите, с чего начать" />
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <a
            v-for="c in categories"
            :key="c.id"
            :href="catalogRoute.query({ category: c.slug }).url()"
            class="group block relative overflow-hidden rounded-2xl bg-stone-200 aspect-[4/5] hover:shadow-lg hover:-translate-y-0.5 transition"
          >
            <ProductImage :image-hash="c.imageHash" :title="c.name" :width="600" wrapper-class="w-full h-full [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div class="font-semibold text-lg">{{ c.name }}</div>
              <div v-if="c.description" class="mt-0.5 text-xs text-stone-300 line-clamp-2">{{ c.description }}</div>
            </div>
          </a>
        </div>
      </section>

      <!-- Empty catalog -->
      <section v-if="!featured.length && !newest.length" class="max-w-7xl mx-auto px-4 mt-14">
        <EmptyState icon="box" title="Каталог пока пуст"  text="Наполните магазин демо-товарами одним кликом или добавьте свои через панель управления.">
          <button type="button" class="h-11 px-5 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-700 disabled:opacity-50" :disabled="seeding" @click="seed">
            {{ seeding ? 'Наполняем…' : 'Наполнить демо-данными' }}
          </button>
        </EmptyState>
        <p v-if="seedError" class="mt-3 text-sm text-rose-600">{{ seedError }}</p>
      </section>

      <!-- Featured -->
      <section v-if="featured.length" class="max-w-7xl mx-auto px-4 mt-14">
        <SectionTitle title="Хиты продаж" subtitle="То, что выбирают чаще всего" :link-href="catalogRoute.url()" />
        <ProductGrid :products="featured" />
      </section>

      <!-- Benefits -->
      <section class="max-w-7xl mx-auto px-4 mt-14">
        <div class="grid sm:grid-cols-3 gap-4">
          <div v-for="b in benefits" :key="b.title" class="rounded-2xl bg-white border border-stone-200/80 p-6 flex gap-4">
            <span class="w-11 h-11 shrink-0 rounded-xl bg-amber-100 text-amber-700 grid place-items-center"><Icon :name="b.icon" /></span>
            <div>
              <div class="font-semibold">{{ b.title }}</div>
              <div class="mt-1 text-sm text-stone-500">{{ b.text }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- New -->
      <section v-if="newest.length" class="max-w-7xl mx-auto px-4 mt-14">
        <SectionTitle title="Новинки" subtitle="Только что появились в каталоге" :link-href="catalogRoute.query({ sort: 'new' }).url()" />
        <ProductGrid :products="newest" />
      </section>
    </main>

    <Footer :categories="categories" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import SectionTitle from '../components/SectionTitle.vue'
import ProductGrid from '../components/ProductGrid.vue'
import EmptyState from '../components/EmptyState.vue'
import ProductImage from '../components/ProductImage.vue'
import { getThumbnailUrl } from '@app/storage'
import { SHOP } from '../shared/config'
import { formatPrice } from '../shared/cart'
import { catalogRoute } from '../catalog'
import { seedRoute } from '../seed'

const props = defineProps<{
  categories: any[]
  featured: any[]
  newest: any[]
}>()

const freeFrom = formatPrice(SHOP.freeDeliveryFrom)
const heroImage = SHOP.heroImageHash ? getThumbnailUrl(ctx, SHOP.heroImageHash, 1800) : ''
const productCount = computed(() => {
  const ids = new Set([...props.featured, ...props.newest].map(p => p.id))
  return Math.max(ids.size, 10)
})

const benefits = [
  { icon: 'truck', title: 'Быстрая доставка', text: `Курьером за 1–2 дня, бесплатно от ${freeFrom}. Самовывоз — в день заказа.` },
  { icon: 'refresh', title: 'Простой возврат', text: '14 дней на возврат без объяснения причин. Вернём деньги в течение 3 дней.' },
  { icon: 'shield', title: 'Проверенное качество', text: 'Каждый товар проверяем вручную перед отправкой — никаких сюрпризов.' },
]

const seeding = ref(false)
const seedError = ref('')

async function seed() {
  seeding.value = true
  seedError.value = ''
  try {
    await seedRoute.run(ctx)
    window.location.reload()
  } catch (e) {
    seedError.value = 'Не удалось наполнить каталог. Попробуйте открыть /seed вручную.'
    seeding.value = false
  }
}
</script>
