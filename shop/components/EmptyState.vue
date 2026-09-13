<template>
  <div class="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
    <div class="mx-auto w-16 h-16 rounded-full bg-stone-100 text-stone-400 grid place-items-center"><Icon :name="icon" size="w-7 h-7" /></div>
    <h3 class="mt-4 text-xl font-bold">{{ title }}</h3>
    <p v-if="text" class="mt-2 text-stone-500 max-w-md mx-auto">{{ text }}</p>
    <div v-if="$slots.default" class="mt-6 flex flex-wrap justify-center gap-3"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'

withDefaults(defineProps<{ icon?: string; title: string; text?: string }>(), { icon: 'box', text: '' })
</script>
