<script setup lang="ts">
import ArrayVisualizer from '@/components/ArrayVisualizer.vue'
import SearchControls from '@/components/SearchControls.vue'
import {
  arraySize,
  comparisonsCount,
  currentIndex,
  dataStructure,
  foundIndex,
  generateRandomArray,
  high,
  low,
  mid,
  notFound,
  numbers,
  setInitialInfo,
  target,
} from '@/composables/useSearchController'
import AppLayout from '@/layouts/AppLayout.vue'
import { useHead } from '@unhead/vue'
import { onMounted, ref, watch } from 'vue'

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Searching', href: '/searching' },
  { title: 'Linear Search' },
]

useHead({
  title: 'Linear Search',
  meta: [
    {
      name: 'description',
      content:
        'Visualize Linear Search algorithm. Watch as it sequentially checks each element in the list until a match is found.',
    },
  ],
})

const showNotFoundMessage = ref(false)

watch(notFound, (newValue) => {
  if (newValue) {
    showNotFoundMessage.value = true
    setTimeout(() => {
      showNotFoundMessage.value = false
    }, 3000)
  }
})

onMounted(() => {
  setInitialInfo('linear')
  generateRandomArray(arraySize.value)
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <template #controls>
      <SearchControls />
    </template>

    <!-- Notification Popup -->
    <div
      v-if="showNotFoundMessage"
      class="animate-slide-in-right fixed top-20 right-6 z-50 border-2 border-black bg-white px-6 py-4 font-mono shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
    >
      <div class="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p class="font-bold text-black">Element Not Found</p>
          <p class="text-sm text-gray-600">
            Target value {{ target }} is not in the
            {{ dataStructure }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex h-full flex-col items-center justify-center p-6">
      <ArrayVisualizer
        :numbers="numbers"
        :target="target"
        :currentIndex="currentIndex"
        :low="low"
        :high="high"
        :mid="mid"
        :foundIndex="foundIndex"
      />

      <div
        class="mt-6 flex w-full max-w-4xl flex-wrap items-center justify-center gap-x-4 gap-y-2 border-2 border-black bg-white px-4 py-3 font-mono text-xs shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:justify-between md:px-6 md:py-4 md:text-sm"
      >
        <div class="flex items-center gap-1 whitespace-nowrap">
          <strong class="text-gray-500">COMPARISONS:</strong>
          <span class="font-bold text-black">{{ comparisonsCount }}</span>
        </div>
        <div class="flex items-center gap-1 whitespace-nowrap">
          <strong class="text-gray-500">TIME:</strong>
          <span class="font-bold text-green-600">O(n)</span>
        </div>
        <div class="flex items-center gap-1 whitespace-nowrap">
          <strong class="text-gray-500">SPACE:</strong>
          <span class="font-bold text-blue-600">O(1)</span>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
