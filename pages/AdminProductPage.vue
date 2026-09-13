<template>
  <div class="min-h-screen flex flex-col">
    <Header :categories="categories" active="admin" />

    <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
      <a :href="adminRoute.url()" class="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900"><Icon name="arrow-left" size="w-4 h-4" /> Ко всем товарам</a>
      <h1 class="mt-3 text-3xl md:text-4xl font-black tracking-tight">{{ product ? 'Редактирование товара' : 'Новый товар' }}</h1>

      <form class="mt-8 grid md:grid-cols-[280px_1fr] gap-8 items-start" @submit.prevent="save">
        <!-- Image -->
        <div class="space-y-3">
          <ProductImage :image-hash="form.imageHash || null" :emoji="form.emoji || '🛍️'" :title="form.title || 'Товар'" :seed="product?.id ?? form.title" wrapper-class="aspect-square rounded-2xl" emoji-class="text-8xl" />
          <label class="block">
            <span class="sr-only">Фото товара</span>
            <input type="file" accept="image/*" class="hidden" @change="onFile" ref="fileInput" />
            <button type="button" class="w-full h-11 rounded-full border border-stone-300 font-medium inline-flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50" :disabled="uploading" @click="fileInput?.click()">
              <Icon :name="uploading ? 'spinner' : 'image'" :size="uploading ? 'w-4 h-4 animate-spin' : 'w-4 h-4'" />
              {{ uploading ? 'Загружаем…' : form.imageHash ? 'Заменить фото' : 'Загрузить фото' }}
            </button>
          </label>
          <button v-if="form.imageHash" type="button" class="w-full text-sm text-stone-500 hover:text-rose-600" @click="form.imageHash = ''">Убрать фото</button>
          <p v-if="uploadError" class="text-sm text-rose-600">{{ uploadError }}</p>
          <label class="block">
            <span class="text-sm text-stone-600">Эмодзи-обложка (если нет фото)</span>
            <input v-model="form.emoji" class="mt-1 w-full h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500 text-center text-xl" placeholder="🛍️" />
          </label>
        </div>

        <!-- Fields -->
        <div class="space-y-4">
          <label class="block">
            <span class="text-sm text-stone-600">Название</span>
            <input v-model="form.title" required class="mt-1 w-full h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500" />
          </label>
          <label class="block">
            <span class="text-sm text-stone-600">Описание</span>
            <textarea v-model="form.description" rows="5" class="mt-1 w-full px-3 py-2 rounded-xl border border-stone-300 outline-none focus:border-stone-500"></textarea>
          </label>
          <div class="grid sm:grid-cols-3 gap-4">
            <label class="block">
              <span class="text-sm text-stone-600">Цена, ₽</span>
              <input v-model.number="form.price" required type="number" min="0" step="1" class="mt-1 w-full h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500" />
            </label>
            <label class="block">
              <span class="text-sm text-stone-600">Старая цена, ₽</span>
              <input v-model.number="form.oldPrice" type="number" min="0" step="1" class="mt-1 w-full h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500" placeholder="для скидки" />
            </label>
            <label class="block">
              <span class="text-sm text-stone-600">Остаток, шт.</span>
              <input v-model.number="form.stock" required type="number" min="0" step="1" class="mt-1 w-full h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500" />
            </label>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <label class="block">
              <span class="text-sm text-stone-600">Категория</span>
              <select v-model="form.categoryId" class="mt-1 w-full h-11 px-3 rounded-xl border border-stone-300 bg-white outline-none focus:border-stone-500">
                <option value="">Без категории</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.emoji }} {{ c.name }}</option>
              </select>
            </label>
            <label class="block">
              <span class="text-sm text-stone-600">Ярлык на карточке</span>
              <input v-model="form.badge" class="mt-1 w-full h-11 px-3 rounded-xl border border-stone-300 outline-none focus:border-stone-500" placeholder="Новинка, Хит…" />
            </label>
          </div>
          <div class="flex flex-wrap gap-6 pt-2">
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input v-model="form.featured" type="checkbox" class="w-5 h-5 rounded border-stone-300 accent-stone-900" />
              <span class="text-sm">Хит продаж — показывать на главной</span>
            </label>
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input v-model="published" type="checkbox" class="w-5 h-5 rounded border-stone-300 accent-stone-900" />
              <span class="text-sm">Опубликован</span>
            </label>
          </div>

          <p v-if="error" class="text-sm text-rose-600 rounded-xl bg-rose-50 p-3">{{ error }}</p>

          <div class="flex flex-wrap gap-3 pt-2">
            <button type="submit" class="h-12 px-7 rounded-full bg-stone-900 text-white font-semibold hover:bg-stone-700 disabled:opacity-50 inline-flex items-center gap-2" :disabled="saving || uploading">
              <Icon v-if="saving" name="spinner" size="w-5 h-5 animate-spin" />
              {{ saving ? 'Сохраняем…' : product ? 'Сохранить' : 'Создать товар' }}
            </button>
            <a :href="adminRoute.url()" class="h-12 px-5 rounded-full border border-stone-300 font-medium inline-flex items-center hover:bg-white">Отмена</a>
            <button v-if="product" type="button" class="ml-auto h-12 px-4 rounded-full text-rose-600 hover:bg-rose-50 font-medium" :disabled="saving" @click="remove">Удалить</button>
          </div>
        </div>
      </form>
    </main>

    <Footer :categories="categories" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { obtainStorageFilePutUrl } from '@app/storage'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import ProductImage from '../components/ProductImage.vue'
import { adminRoute } from '../admin'
import { productCreateRoute } from '../api/products/create'
import { productUpdateRoute } from '../api/products/update'
import { productDeleteRoute } from '../api/products/delete'

const props = defineProps<{ product: any | null; categories: any[]; uploadUrl: string }>()

const form = reactive({
  title: props.product?.title ?? '',
  description: props.product?.description ?? '',
  price: props.product?.price ?? 0,
  oldPrice: props.product?.oldPrice ?? null,
  stock: props.product?.stock ?? 10,
  categoryId: props.product?.categoryId ?? '',
  emoji: props.product?.emoji ?? '',
  imageHash: props.product?.imageHash ?? '',
  badge: props.product?.badge ?? '',
  featured: props.product?.featured ?? false,
  status: (props.product?.status ?? 'active') as 'active' | 'draft',
})

const published = computed({
  get: () => form.status === 'active',
  set: v => (form.status = v ? 'active' : 'draft'),
})

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const saving = ref(false)
const error = ref('')

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = ''
  try {
    const putUrl = await obtainStorageFilePutUrl(ctx, { getPutUrl: props.uploadUrl })
    const body = new FormData()
    body.append('Filedata', file)
    const response = await fetch(putUrl, { method: 'POST', body })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const hash = (await response.text()).trim()
    if (!hash) throw new Error('Пустой ответ хранилища')
    form.imageHash = hash
  } catch (e: any) {
    uploadError.value = 'Не удалось загрузить фото: ' + (e?.message || 'ошибка')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

function payload() {
  return {
    title: form.title,
    description: form.description,
    price: Number(form.price) || 0,
    oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
    categoryId: form.categoryId || undefined,
    emoji: form.emoji || undefined,
    imageHash: form.imageHash || undefined,
    status: form.status,
    stock: Math.max(0, Math.floor(Number(form.stock) || 0)),
    featured: form.featured,
    badge: form.badge || undefined,
  }
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (props.product) await productUpdateRoute.query({ id: props.product.id }).run(ctx, payload())
    else await productCreateRoute.run(ctx, payload())
    window.location.href = adminRoute.url()
  } catch (e: any) {
    error.value = e?.message || 'Не удалось сохранить товар'
    saving.value = false
  }
}

async function remove() {
  if (!props.product || !window.confirm(`Удалить «${props.product.title}»?`)) return
  saving.value = true
  try {
    await productDeleteRoute.query({ id: props.product.id }).run(ctx)
    window.location.href = adminRoute.url()
  } catch (e: any) {
    error.value = e?.message || 'Не удалось удалить товар'
    saving.value = false
  }
}
</script>
