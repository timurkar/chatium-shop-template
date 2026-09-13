<template>
  <div class="relative overflow-hidden bg-stone-100" :class="wrapperClass">
    <img
      v-if="imageHash"
      :src="getThumbnailUrl(ctx, imageHash, width)"
      :alt="title"
      class="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
    <div v-else class="absolute inset-0 grid place-items-center text-stone-300" :title="title">
      <Icon name="image" :size="iconSize" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getThumbnailUrl } from '@app/storage'
import Icon from './Icon.vue'

/** Фото товара из хранилища Chatium; без фото — нейтральная заглушка. */
withDefaults(
  defineProps<{ imageHash?: string | null; title: string; width?: number; wrapperClass?: string; iconSize?: string }>(),
  { imageHash: null, width: 600, wrapperClass: 'aspect-square rounded-xl', iconSize: 'w-10 h-10' },
)
</script>
