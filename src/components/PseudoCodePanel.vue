<script setup lang="ts">
import { ref } from 'vue'
import type { PseudoCodeLine } from '@/composables/sorting'

defineProps<{
  lines: PseudoCodeLine[]
  subtitle?: string
}>()

const isHidden = ref(false)
</script>

<template>
  <div
    class="pointer-events-none absolute bottom-2 left-2 z-50 flex flex-col-reverse items-start gap-3 transition-all duration-500 ease-in-out md:top-4 md:left-4 md:bottom-auto md:flex-col"
  >
    <button
      @click="isHidden = !isHidden"
      class="pointer-events-auto flex items-center gap-2 rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-[10px] font-black text-black shadow-[4px_4px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 md:px-4 md:py-2 md:text-xs md:shadow-[5px_5px_0px_0px_black]"
    >
      <span
        class="size-1.5 rounded-none border border-black transition-colors duration-300 md:size-2"
        :class="isHidden ? 'bg-green-500' : 'bg-blue-500'"
      ></span>
      {{ isHidden ? 'SHOW_PSEUDO' : 'HIDE_PSEUDO' }}
    </button>

    <div
      v-if="!isHidden"
      class="pointer-events-auto flex h-64 w-72 origin-bottom flex-col overflow-hidden rounded-none border-[3px] border-black bg-white shadow-[5px_5px_0px_0px_black] transition-all duration-500 md:h-[calc(100vh-320px)] md:max-h-96 md:w-80 md:origin-top lg:w-96"
    >
      <div class="flex items-center justify-between border-b-4 border-black bg-[#fafafa] p-4">
        <div class="flex flex-col">
          <span class="font-mono text-xs font-black text-black uppercase tracking-tighter">
            Pseudo_Code
          </span>
          <span class="font-mono text-[10px] text-gray-400">{{ subtitle || 'sorting' }}</span>
        </div>
        <div class="font-mono text-[10px] font-bold text-gray-500">static-view</div>
      </div>

      <div class="flex-1 overflow-y-auto bg-white p-3 font-mono text-xs">
        <div class="space-y-1">
          <div
            v-for="line in lines"
            :key="line.id"
            class="flex items-start gap-2 border border-transparent px-2 py-1"
          >
            <span class="min-w-16 text-[10px] text-gray-500">{{ line.id }}</span>
            <span :style="{ marginLeft: `${(line.indent || 0) * 10}px` }" class="text-black">{{
              line.text
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
