<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
  explanation: string[]
}>()

const isHidden = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}

watch(
  () => props.explanation,
  () => {
    scrollToBottom()
  },
  { deep: true },
)
</script>

<template>
  <!-- Unified Positioning Container -->
  <div
    class="pointer-events-none absolute bottom-4 right-4 z-50 flex flex-col-reverse items-end gap-3 transition-all duration-500 ease-in-out md:top-4 md:bottom-auto md:flex-col"
  >
    <!-- Toggle Button -->
    <button
      @click="isHidden = !isHidden"
      class="pointer-events-auto flex items-center gap-2 rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono text-[10px] font-black text-black shadow-[4px_4px_0px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 md:px-4 md:py-2 md:text-xs md:shadow-[5px_5px_0px_0px_black]"
    >
      <span
        class="size-1.5 rounded-none border border-black transition-colors duration-300 md:size-2"
        :class="isHidden ? 'bg-green-500' : 'bg-red-500'"
      ></span>
      {{ isHidden ? 'SHOW_LOGS' : 'HIDE_LOGS' }}
    </button>

    <!-- Explanation Card -->
    <div
      v-if="!isHidden"
      class="pointer-events-auto flex h-64 w-72 origin-bottom flex-col overflow-hidden rounded-none border-[3px] border-black bg-white shadow-[5px_5px_0px_0px_black] transition-all duration-500 md:h-[calc(100vh-320px)] md:max-h-96 md:w-80 md:origin-top md:shadow-[5px_5px_0px_0px_black] lg:w-96"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b-4 border-black bg-[#fafafa] p-4">
        <div class="flex flex-col">
          <span class="font-mono text-xs font-black text-black uppercase tracking-tighter">
            Execution_Log
          </span>
          <span class="font-mono text-[10px] text-gray-400">v1.0.4-stable</span>
        </div>
        <div class="flex gap-1.5">
          <div class="size-2.5 rounded-full border-2 border-black bg-[#ff5f56]"></div>
          <div class="size-2.5 rounded-full border-2 border-black bg-[#ffbd2e]"></div>
          <div class="size-2.5 rounded-full border-2 border-black bg-[#27c93f]"></div>
        </div>
      </div>

      <!-- Logs Container -->
      <div
        ref="scrollContainer"
        class="flex-1 overflow-y-auto bg-white p-4 pr-6 font-mono text-xs scrollbar-custom md:text-sm"
      >
        <div v-if="explanation.length > 0" class="flex flex-col gap-3">
          <div
            v-for="(step, index) in explanation"
            :key="index"
            class="group relative flex gap-3 border-l-2 border-gray-100 pl-4 transition-all hover:border-black"
          >
            <span
              class="absolute -left-1.25 top-1 size-2 rounded-full border border-black bg-white group-hover:bg-black"
            ></span>
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-gray-400"
                >STEP_{{ index.toString().padStart(3, '0') }}</span
              >
              <p class="leading-relaxed text-black">{{ step }}</p>
            </div>
          </div>
        </div>
        <div v-else class="flex h-full flex-col items-center justify-center text-center">
          <div
            class="mb-2 size-8 animate-pulse rounded-none border-2 border-dashed border-gray-300"
          ></div>
          <p class="italic text-gray-400">Waiting for algorithm<br />input...</p>
        </div>
      </div>

      <!-- Footer Stats -->
      <div
        class="flex items-center justify-between border-t-2 border-black bg-gray-50 px-4 py-2 font-mono text-[10px] text-gray-500"
      >
        <span>TOTAL_STEPS: {{ explanation.length }}</span>
        <span class="animate-pulse text-green-600">● LIVE</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Improved distinguished scrollbar */
.scrollbar-custom::-webkit-scrollbar {
  width: 12px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: black;
  border: 2px solid #f5f5f5;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #333;
}

.animate-in {
  animation: animate-in 0.3s ease-out forwards;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
