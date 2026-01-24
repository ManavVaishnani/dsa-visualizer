<script setup lang="ts">
import {
  queue,
  highlightedIndex,
  animatingIndex,
  animationType,
  explanation,
  maxSize,
} from '@/composables/useQueueController'
import AlgorithmExplanation from './AlgorithmExplanation.vue'

const getItemClass = (index: number): string => {
  const classes: string[] = ['border-2', 'border-black', 'transition-all', 'duration-300']

  // Animation states
  if (animatingIndex.value === index) {
    if (animationType.value === 'enqueue') {
      classes.push('bg-green-400', 'scale-105', 'animate-pulse')
    } else if (animationType.value === 'dequeue') {
      classes.push('bg-red-400', 'scale-95', 'opacity-50')
    }
  } else if (highlightedIndex.value === index) {
    classes.push('bg-amber-400', 'scale-105', 'ring-4', 'ring-amber-300')
  } else if (index === 0) {
    // Front element
    classes.push('bg-blue-400')
  } else if (index === queue.value.length - 1) {
    // Rear element
    classes.push('bg-purple-400')
  } else {
    classes.push('bg-gray-200')
  }

  return classes.join(' ')
}
</script>

<template>
  <div class="relative flex h-full w-full flex-col items-center justify-start gap-8 px-4 py-8 md:px-8">
    <AlgorithmExplanation :explanation="explanation" />

    <!-- Queue Container -->
    <div class="flex w-full flex-col items-center gap-4">
      <!-- Queue Label -->
      <div class="font-mono text-sm font-bold text-gray-500 uppercase tracking-wider">
        Queue ({{ queue.length }}/{{ maxSize }})
      </div>

      <!-- Queue Visual (Horizontal) -->
      <div class="relative flex w-full max-w-4xl items-center justify-center gap-2 overflow-x-auto p-4">

        <!-- Empty State -->
        <div
          v-if="queue.length === 0"
          class="flex h-24 w-full max-w-md items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 font-mono text-sm text-gray-400"
        >
          <span>Empty Queue (Enqueue to add)</span>
        </div>

        <!-- Queue Elements -->
        <div
          v-for="(value, index) in queue"
          :key="index"
          class="relative flex flex-col items-center gap-2"
        >
          <!-- Front Indicator -->
          <div
            v-if="index === 0"
            class="absolute -top-8 font-mono text-xs font-bold text-blue-600 animate-bounce"
          >
            FRONT
          </div>

          <!-- Rear Indicator -->
          <div
            v-else-if="index === queue.length - 1"
            class="absolute -top-8 font-mono text-xs font-bold text-purple-600 animate-bounce"
          >
            REAR
          </div>

          <!-- Element Box -->
          <div
            :class="getItemClass(index)"
            class="flex h-16 w-16 items-center justify-center font-mono text-xl font-bold shadow-[3px_3px_0px_0px_black]"
          >
            {{ value }}
          </div>

          <!-- Index -->
          <div class="font-mono text-xs text-gray-400">
            [{{ index }}]
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-8 flex flex-wrap justify-center gap-6 font-mono text-xs">
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 border-2 border-black bg-blue-400"></div>
          <span>Front (Dequeue)</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 border-2 border-black bg-purple-400"></div>
          <span>Rear (Enqueue)</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 border-2 border-black bg-green-400"></div>
          <span>Enqueueing</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 border-2 border-black bg-red-400"></div>
          <span>Dequeueing</span>
        </div>
         <div class="flex items-center gap-2">
          <div class="h-4 w-4 border-2 border-black bg-amber-400"></div>
          <span>Peeking</span>
        </div>
      </div>
    </div>
  </div>
</template>
