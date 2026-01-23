<script setup lang="ts">
import {
  stack,
  topIndex,
  highlightedIndex,
  animatingIndex,
  animationType,
  explanation,
  maxSize,
} from '@/composables/useStackController'
import AlgorithmExplanation from './AlgorithmExplanation.vue'

const getItemClass = (index: number): string => {
  const classes: string[] = ['border-2', 'border-black', 'transition-all', 'duration-300']

  // Top element styling
  if (index === topIndex.value) {
    classes.push('border-t-4')
  }

  // Animation states
  if (animatingIndex.value === index) {
    if (animationType.value === 'push') {
      classes.push('bg-green-400', 'scale-105', 'animate-pulse')
    } else if (animationType.value === 'pop') {
      classes.push('bg-red-400', 'scale-95', 'opacity-50')
    }
  } else if (highlightedIndex.value === index) {
    classes.push('bg-amber-400', 'scale-105', 'ring-4', 'ring-amber-300')
  } else if (index === topIndex.value) {
    classes.push('bg-blue-400')
  } else {
    classes.push('bg-gray-200')
  }

  return classes.join(' ')
}
</script>

<template>
  <div class="relative flex h-full w-full items-center justify-center gap-8 px-4 md:px-8">
    <AlgorithmExplanation :explanation="explanation" />

    <!-- Stack Container -->
    <div class="flex flex-col items-center gap-4">
      <!-- Stack Label -->
      <div class="font-mono text-sm font-bold text-gray-500 uppercase tracking-wider">
        Stack ({{ stack.length }}/{{ maxSize }})
      </div>

      <!-- Stack Visual -->
      <div class="relative flex flex-col-reverse items-center gap-1">
        <!-- Empty State -->
        <div
          v-if="stack.length === 0"
          class="flex h-48 w-32 flex-col items-center justify-center border-2 border-dashed border-gray-400 bg-gray-50 font-mono text-sm text-gray-400"
        >
          <span>Empty</span>
          <span class="text-xs">Push to add</span>
        </div>

        <!-- Stack Elements -->
        <div
          v-for="(value, index) in stack"
          :key="index"
          :class="getItemClass(index)"
          class="relative flex h-12 w-32 items-center justify-center font-mono text-lg font-bold shadow-[3px_3px_0px_0px_black] md:h-14 md:w-40 md:text-xl"
        >
          <!-- Value -->
          <span>{{ value }}</span>

          <!-- Top Indicator -->
          <div
            v-if="index === topIndex"
            class="absolute -right-14 flex items-center gap-1 font-mono text-xs font-bold text-blue-600"
          >
            <span class="animate-pulse">←</span>
            <span>TOP</span>
          </div>

          <!-- Index -->
          <div
            class="absolute -left-8 font-mono text-xs text-gray-400"
          >
            [{{ index }}]
          </div>
        </div>

        <!-- Stack Bottom -->
        <div
          v-if="stack.length > 0"
          class="h-2 w-36 border-2 border-black bg-gray-800 md:w-44"
        ></div>
      </div>

      <!-- Stack Info -->
      <div class="mt-4 flex flex-wrap justify-center gap-4 font-mono text-xs">
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 border-2 border-black bg-blue-400"></div>
          <span>Top</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 border-2 border-black bg-green-400"></div>
          <span>Pushing</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 border-2 border-black bg-red-400"></div>
          <span>Popping</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 border-2 border-black bg-amber-400"></div>
          <span>Peeking</span>
        </div>
      </div>
    </div>
  </div>
</template>
