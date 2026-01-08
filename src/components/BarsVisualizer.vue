<script setup lang="ts">
import { active, bars, sorted, swapping } from '@/composables/useSortingController'

const getColor = (index: number) => {
  // Nerdy Color Scheme
  // Sorted: Greenish or 'Done' state (Keep distinct but retro)
  if (sorted.value.includes(index)) return 'bg-[#10b981] border-black'

  // Swapping: Red/Danger/Hot
  if (swapping.value.includes(index)) return 'bg-[#ef4444] border-black'

  // Active: Orange/Focus
  if (active.value.includes(index)) return 'bg-[#f59e0b] border-black'

  // Default: Light Grey with Black Border
  return 'bg-gray-200 border-black'
}
</script>

<template>
  <div
    class="flex h-full w-full items-center justify-center overflow-hidden bg-gray-50 px-2 md:px-4"
  >
    <!-- Main Sorting Container -->
    <div
      class="flex h-[80%] w-full max-w-5xl items-end justify-center gap-px border-b-2 border-black pb-px md:gap-1"
    >
      <div
        v-for="(value, index) in bars"
        :key="index"
        class="relative min-w-1 flex-1 border-x border-t border-black transition-all duration-150"
        :class="getColor(index)"
        :style="{
          height: value + '%',
        }"
      >
        <!-- Optional: Add retro shine or texture here if needed -->
      </div>
    </div>
  </div>
</template>
