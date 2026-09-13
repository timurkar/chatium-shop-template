<template>
  <div class="relative overflow-hidden bg-stone-100" :class="wrapperClass">
    <img
      v-if="imageHash"
      :src="getThumbnailUrl(ctx, imageHash, width)"
      :alt="title"
      class="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
    <div v-else class="absolute inset-0 grid place-items-center bg-gradient-to-br" :class="gradient">
      <span class="select-none drop-shadow-sm" :class="emojiClass">{{ emoji }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getThumbnailUrl } from '@app/storage'

const props = withDefaults(
  defineProps<{
    imageHash?: string | null
    emoji: string
    title: string
    seed?: string
    width?: number
    wrapperClass?: string
    emojiClass?: string
  }>(),
  { imageHash: null, seed: '', width: 600, wrapperClass: 'aspect-square rounded-xl', emojiClass: 'text-6xl' },
)

const gradients = [
  'from-amber-100 to-orange-200',
  'from-sky-100 to-indigo-200',
  'from-emerald-100 to-teal-200',
  'from-rose-100 to-pink-200',
  'from-violet-100 to-purple-200',
  'from-lime-100 to-green-200',
  'from-stone-100 to-stone-300',
  'from-yellow-100 to-amber-200',
]

const gradient = computed(() => {
  const key = props.seed || props.title
  let hash = 0
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return gradients[hash % gradients.length]
})
</script>
