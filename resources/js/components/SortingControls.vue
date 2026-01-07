<script setup lang="ts">
import {
    barCount,
    bubbleSort,
    generateBars,
    insertionSort,
    isPaused,
    isSorting,
    mergeSort,
    quickSort,
    selectionSort,
    speed,
} from '@/composables/useSortingController';

const pause = () => {
    isPaused.value = !isPaused.value;
};

import { usePage } from '@inertiajs/vue3';

const page = usePage();

const runSort = () => {
    const path = page.url;
    if (path.includes('selection-sort')) {
        selectionSort();
    } else if (path.includes('insertion-sort')) {
        insertionSort();
    } else if (path.includes('merge-sort')) {
        mergeSort();
    } else if (path.includes('quick-sort')) {
        quickSort();
    } else {
        bubbleSort();
    }
};
</script>

<template>
    <header
        class="flex flex-col gap-4 border-b border-[#334155] bg-[#0f172a] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-3"
    >
        <!-- Sliders -->
        <div
            class="flex flex-wrap items-center justify-center gap-4 md:justify-start md:gap-6"
        >
            <div class="flex flex-col">
                <label class="text-xs text-[#94a3b8]"
                    >Bars: {{ barCount }}</label
                >
                <input
                    type="range"
                    min="10"
                    max="100"
                    v-model="barCount"
                    class="w-32 accent-[#3b82f6]"
                />
            </div>

            <div class="flex flex-col">
                <label class="text-xs text-[#94a3b8]">Speed</label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    v-model="speed"
                    class="w-32 accent-[#3b82f6]"
                />
            </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <button
                class="rounded bg-[#3b82f6] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#2563eb] md:px-4 md:py-2"
                @click="generateBars"
            >
                Generate
            </button>
            <button
                class="rounded bg-[#10b981] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2"
                @click="runSort"
                :disabled="isSorting"
            >
                Start
            </button>
            <button
                class="rounded bg-[#f59e0b] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#d97706] md:px-4 md:py-2"
                @click="pause"
            >
                {{ isPaused ? 'Resume' : 'Pause' }}
            </button>
            <button
                class="rounded bg-[#ef4444] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#dc2626] md:px-4 md:py-2"
                @click="generateBars"
            >
                Reset
            </button>
        </div>
    </header>
</template>
