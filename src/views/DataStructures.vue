<script setup lang="ts">
import RetroCard from '@/components/RetroCard.vue'
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'

useHead({
  title: 'Data Structures',
  meta: [
    {
      name: 'description',
      content:
        'Explore interactive visualizations of fundamental data structures including Stack, Queue, Linked List, and more.',
    },
  ],
})

const dataStructures = [
  {
    title: 'Stack',
    href: '/visualize/stack',
    img: '/stack.svg',
    description: 'LIFO - Last In First Out',
  },
]
</script>

<template>
  <div class="min-h-screen px-6 py-8 font-sans text-gray-900">
    <div class="mx-auto max-w-6xl">
      <h1 class="mb-6 border-b-2 border-black pb-4 text-center font-mono text-3xl font-bold">
        Data Structures
      </h1>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="ds in dataStructures" :key="ds.href">
          <RetroCard
            class="h-full overflow-hidden p-0 transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <RouterLink :to="ds.href" class="group flex h-full flex-col">
              <div
                class="flex h-44 items-center justify-center border-b-2 border-black bg-gray-100 p-4 transition-colors group-hover:bg-gray-200"
              >
                <img
                  class="h-32 w-auto object-contain opacity-80 mix-blend-multiply transition-opacity group-hover:opacity-100"
                  :src="ds.img"
                  :alt="ds.title"
                />
              </div>
              <div class="flex flex-1 flex-col bg-white p-4">
                <h5 class="font-mono text-xl font-bold tracking-tight group-hover:underline">
                  {{ ds.title }}
                </h5>
                <p class="mt-1 font-mono text-xs text-gray-500">{{ ds.description }}</p>
                <div class="mt-auto flex gap-2 pt-4">
                  <span class="border border-black px-1 font-mono text-[10px] uppercase"
                    >Visualizer</span
                  >
                  <span
                    class="border border-black bg-black px-1 font-mono text-[10px] text-white uppercase"
                    >Interactive</span
                  >
                </div>
              </div>
            </RouterLink>
          </RetroCard>
        </div>
      </div>
    </div>
  </div>
</template>
