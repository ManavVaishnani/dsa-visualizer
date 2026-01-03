<script setup lang="ts">
import {
    barCount,
    speed,
    generateBars,
    bubbleSort,
    selectionSort,
    isPaused,
    isSorting
} from '@/composables/useSortingController'

const pause = () => {
    isPaused.value = !isPaused.value
}

import { usePage } from '@inertiajs/vue3';

const page = usePage();

const runSort = () => {
    const path = page.url;
    if (path.includes('selection-sort')) {
        selectionSort();
    } else {
        bubbleSort();
    }
};
</script>

<template>
    <header class="bg-gray-800 border-b border-gray-700 px-6 py-3 flex justify-between items-center">
        <!-- Sliders -->
        <div class="flex gap-6 items-center">
            <div>
                <label class="text-xs text-gray-400">Bars: {{ barCount }}</label>
                <input
                    type="range"
                    min="10"
                    max="100"
                    v-model="barCount"
                    class="w-32 accent-blue-500"
                />
            </div>

            <div>
                <label class="text-xs text-gray-400">Speed</label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    v-model="speed"
                    class="w-32 accent-green-500"
                />
            </div>
        </div>

        <!-- Controls -->
        <button
            class="px-4 py-2 rounded text-sm font-medium transition bg-blue-600 hover:bg-blue-700"
            @click="generateBars"
        >
            Generate
        </button>
        <button
            class="px-4 py-2 rounded text-sm font-medium transition bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="runSort"
            :disabled="isSorting"
        >
            Start
        </button>
        <button
            class="px-4 py-2 rounded text-sm font-medium transition bg-yellow-500 hover:bg-yellow-600"
            @click="pause"
        >
            {{ isPaused ? 'Resume' : 'Pause' }}
        </button>
        <button
            class="px-4 py-2 rounded text-sm font-medium transition bg-red-600 hover:bg-red-700"
            @click="generateBars"
        >
            Reset
        </button>
    </header>
</template>
