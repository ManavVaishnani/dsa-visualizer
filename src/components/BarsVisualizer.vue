<script setup lang="ts">
import { computed } from 'vue'
import {
  active,
  bars,
  currentAlgorithmInfo,
  explanation,
  pseudoCodeLines,
  sorted,
  swapping,
} from '@/composables/sorting'
import AlgorithmExplanation from './AlgorithmExplanation.vue'
import PseudoCodePanel from './PseudoCodePanel.vue'

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

const algorithmSubtitle = computed(() =>
  currentAlgorithmInfo.value?.name.toLowerCase() || 'sorting'
)
</script>

<template>
  <div class="relative flex h-full w-full items-center justify-center overflow-hidden px-2 md:px-4">
    <AlgorithmExplanation :explanation="explanation" />
    <PseudoCodePanel :lines="pseudoCodeLines" :subtitle="algorithmSubtitle" />
    <!-- Main Sorting Container -->
    <div
      class="flex h-[80%] w-full max-w-5xl items-end justify-center gap-px border-b-2 border-black pb-px md:gap-1"
    >
      <div
        v-for="(value, index) in bars"
        :key="index"
        class="flex h-full flex-1 flex-col items-center justify-end gap-1"
      >
        <!-- Bar Container to align bars to bottom -->
        <div class="flex h-full w-full items-end justify-center">
          <div
            class="relative w-full border-x border-t border-black transition-all duration-150"
            :class="getColor(index)"
            :style="{
              height: value + '%',
            }"
          >
            <!-- Optional: Add retro shine or texture here if needed -->
          </div>
        </div>

        <!-- Number Value -->
        <span class="font-mono text-[10px] font-bold leading-none text-gray-600 md:text-xs">
          {{ value }}
        </span>
      </div>
    </div>
  </div>
</template>
