<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue: string | number
  options: Option[]
  placeholder?: string
  class?: string
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const selectedLabel = computed(() => {
  const option = props.options.find((o) => o.value === props.modelValue)
  return option ? option.label : props.placeholder || 'Select...'
})

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="containerRef" :class="cn('relative inline-block w-full min-w-30', props.class)">
    <button
      type="button"
      @click="toggleDropdown"
      class="flex w-full items-center justify-between border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none focus:outline-none md:text-sm"
    >
      <span>{{ selectedLabel }}</span>
      <ChevronDown
        class="ml-2 h-4 w-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute left-0 top-[calc(100%+4px)] z-50 w-full border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <div class="max-h-60 overflow-y-auto">
        <button
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="flex w-full items-center justify-between px-3 py-2 text-left font-mono text-xs font-bold uppercase transition-colors md:text-sm"
          :class="[
            modelValue === option.value
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-gray-100',
          ]"
        >
          <span>{{ option.label }}</span>
          <Check v-if="modelValue === option.value" class="h-3 w-3 md:h-4 md:w-4" />
        </button>
      </div>
    </div>
  </div>
</template>
