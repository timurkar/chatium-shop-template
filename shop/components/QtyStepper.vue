<template>
  <div class="inline-flex items-center rounded-full border border-stone-300 bg-white" :class="size === 'lg' ? 'h-12' : 'h-10'">
    <button
      type="button"
      class="grid place-items-center rounded-full hover:bg-stone-100 disabled:opacity-40"
      :class="size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'"
      :disabled="modelValue <= min"
      aria-label="Уменьшить"
      @click="emit('update:modelValue', modelValue - 1)"
    >
      <Icon name="minus" size="w-4 h-4" />
    </button>
    <span class="min-w-[2rem] text-center font-semibold tabular-nums" :class="size === 'lg' ? 'text-base' : 'text-sm'">{{ modelValue }}</span>
    <button
      type="button"
      class="grid place-items-center rounded-full hover:bg-stone-100 disabled:opacity-40"
      :class="size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'"
      :disabled="max !== undefined && modelValue >= max"
      aria-label="Увеличить"
      @click="emit('update:modelValue', modelValue + 1)"
    >
      <Icon name="plus" size="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'

withDefaults(defineProps<{ modelValue: number; min?: number; max?: number; size?: 'md' | 'lg' }>(), {
  min: 1,
  max: undefined,
  size: 'md',
})
const emit = defineEmits<{ (e: 'update:modelValue', value: number): void }>()
</script>
