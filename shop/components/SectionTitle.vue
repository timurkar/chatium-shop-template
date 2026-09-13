<template>
  <div class="flex items-end justify-between gap-4 mb-6">
    <div>
      <h2 class="text-2xl md:text-3xl font-black tracking-tight">{{ title }}</h2>
      <p v-if="subtitle" class="mt-1 text-stone-500">{{ subtitle }}</p>
    </div>
    <a v-if="linkHref" :href="linkHref" class="shrink-0 inline-flex items-center gap-1 text-sm font-medium hover:underline">
      {{ linkText }} <Icon name="arrow-right" size="w-4 h-4" />
    </a>
  </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'

withDefaults(defineProps<{ title: string; subtitle?: string; linkHref?: string; linkText?: string }>(), {
  subtitle: '',
  linkHref: '',
  linkText: 'Смотреть все',
})
</script>
