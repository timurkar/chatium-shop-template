<template>
  <div class="min-h-screen flex flex-col">
    <Header :categories="categories" />

    <main class="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center"><Icon name="check" size="w-8 h-8" /></div>
        <h1 class="mt-5 text-3xl md:text-4xl font-black tracking-tight">Заказ №{{ order.number }} принят</h1>
        <p class="mt-3 text-stone-500">Спасибо, {{ order.customerName }}! Мы свяжемся с вами по телефону {{ order.phone }}, чтобы подтвердить заказ.</p>
        <span class="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium" :class="statusClass">{{ statusLabel }}</span>
      </div>

      <section class="mt-10 bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100">
        <div v-for="item in order.items" :key="item.productId" class="p-4 flex items-center gap-4">
          <a :href="productRoute.query({ id: item.productId }).url()">
            <ProductImage :image-hash="item.imageHash" :emoji="item.emoji" :title="item.title" :seed="item.productId" :width="160" wrapper-class="w-16 h-16 rounded-xl" emoji-class="text-3xl" />
          </a>
          <div class="flex-1 min-w-0">
            <div class="font-semibold line-clamp-1">{{ item.title }}</div>
            <div class="text-sm text-stone-500">{{ item.qty }} × {{ item.priceFormatted }}</div>
          </div>
          <div class="font-bold">{{ item.sumFormatted }}</div>
        </div>
        <dl class="p-4 space-y-2 text-sm">
          <div class="flex justify-between"><dt class="text-stone-500">Товары</dt><dd>{{ order.itemsTotalFormatted }}</dd></div>
          <div class="flex justify-between"><dt class="text-stone-500">Доставка ({{ deliveryLabel }})</dt><dd>{{ order.deliveryPrice === 0 ? 'Бесплатно' : order.deliveryPriceFormatted }}</dd></div>
          <div class="flex justify-between text-base font-bold pt-2 border-t border-stone-100"><dt>Итого</dt><dd>{{ order.totalFormatted }}</dd></div>
        </dl>
      </section>

      <section class="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
        <div class="bg-white rounded-2xl border border-stone-200/80 p-4">
          <div class="text-stone-500">Получение</div>
          <div class="mt-1 font-medium">{{ deliveryLabel }}</div>
          <div class="mt-1 text-stone-600">{{ order.delivery === 'courier' ? order.address : `${SHOP.address}, ${SHOP.workingHours}` }}</div>
        </div>
        <div class="bg-white rounded-2xl border border-stone-200/80 p-4">
          <div class="text-stone-500">Контакты</div>
          <div class="mt-1 font-medium">{{ order.customerName }}</div>
          <div class="mt-1 text-stone-600">{{ order.phone }}<template v-if="order.email"> · {{ order.email }}</template></div>
          <div v-if="order.comment" class="mt-2 text-stone-500 italic">«{{ order.comment }}»</div>
        </div>
      </section>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a :href="catalogRoute.url()" class="h-11 px-5 rounded-full bg-stone-900 text-white font-medium inline-flex items-center">Продолжить покупки</a>
        <a :href="indexRoute.url()" class="h-11 px-5 rounded-full border border-stone-300 font-medium inline-flex items-center hover:bg-white">На главную</a>
      </div>
    </main>

    <Footer :categories="categories" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import ProductImage from '../components/ProductImage.vue'
import { DELIVERY_METHODS, DeliveryMethod, ORDER_STATUSES, OrderStatus, SHOP } from '../shared/config'
import { indexRoute } from '../index'
import { catalogRoute } from '../catalog'
import { productRoute } from '../product'

const props = defineProps<{ order: any; categories: any[] }>()

const statusLabel = computed(() => ORDER_STATUSES[props.order.status as OrderStatus] ?? props.order.status)
const deliveryLabel = computed(() => DELIVERY_METHODS[props.order.delivery as DeliveryMethod] ?? props.order.delivery)

const statusClass = computed(() => {
  switch (props.order.status) {
    case 'done': return 'bg-emerald-100 text-emerald-700'
    case 'cancelled': return 'bg-rose-100 text-rose-700'
    case 'shipped': return 'bg-sky-100 text-sky-700'
    case 'processing': return 'bg-amber-100 text-amber-700'
    default: return 'bg-stone-100 text-stone-700'
  }
})
</script>
