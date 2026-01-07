<script setup lang="ts">
import {
    arraySize,
    dataStructure,
    generateRandomArray,
    isPaused,
    isSearching,
    numbers,
    pause,
    resetState,
    resume,
    runBinarySearch,
    runLinearSearch,
    sortArray,
    speed,
    target,
} from '@/composables/useSearchController';
import { usePage } from '@inertiajs/vue3';

const page = usePage();

const runSearch = () => {
    const path = page.url;
    if (path.includes('binary-search')) {
        // Binary search requires sorted array
        if (dataStructure.value === 'array') {
            sortArray();
        }
        runBinarySearch();
    } else {
        runLinearSearch();
    }
};

const togglePause = () => {
    if (isPaused.value) {
        resume();
    } else {
        pause();
    }
};

const handleGenerate = () => {
    generateRandomArray(arraySize.value);
    const path = page.url;
    if (path.includes('binary-search') && dataStructure.value === 'array') {
        sortArray();
    }
};
</script>

<template>
    <header
        class="flex items-center justify-between border-b border-[#334155] bg-[#0f172a] px-6 py-3"
    >
        <!-- Sliders and Inputs -->
        <div class="flex items-center gap-6">
            <!-- Data Structure Selector -->
            <div>
                <label class="text-xs text-[#94a3b8]">Data Structure</label>
                <select
                    v-model="dataStructure"
                    class="mt-1 block w-32 rounded border-[#334155] bg-[#1e293b] px-2 py-1 text-sm text-[#f1f5f9]"
                    :disabled="isSearching"
                >
                    <option value="array">Array</option>
                    <option value="linkedlist">Linked List</option>
                </select>
            </div>


            <!-- Target Value -->
            <div class="grid">
                <label class="text-xs text-[#94a3b8]">Target</label>
                <input
                type="number"
                v-model.number="target"
                class="mt-1 w-24 rounded border-[#334155] bg-[#1e293b] px-2 py-1 text-sm text-[#f1f5f9]"
                :disabled="isSearching"
                />
            </div>

            <!-- Array Size -->
            <div class="grid">
                <label class="text-xs text-[#94a3b8]">Size: {{ arraySize }}</label>
                <input
                    type="range"
                    min="5"
                    max="20"
                    v-model.number="arraySize"
                    class="w-32 accent-[#3b82f6]"
                    :disabled="isSearching"
                />
            </div>

            <!-- Speed -->
            <div class="grid">
                <label class="text-xs text-[#94a3b8]">Speed</label>
                <input
                    type="range"
                    min="100"
                    max="1500"
                    step="100"
                    v-model.number="speed"
                    class="w-32 accent-[#3b82f6]"
                />
            </div>
        </div>

        <!-- Control Buttons -->
        <div class="flex items-center gap-3">
            <button
                class="rounded bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2563eb]"
                @click="handleGenerate"
                :disabled="isSearching"
            >
                Generate
            </button>
            <button
                class="rounded bg-[#10b981] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-50"
                @click="runSearch"
                :disabled="
                    isSearching || target === null || numbers.length === 0
                "
            >
                Start
            </button>
            <button
                class="rounded bg-[#f59e0b] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#d97706] disabled:cursor-not-allowed disabled:opacity-50"
                @click="togglePause"
                :disabled="!isSearching"
            >
                {{ isPaused ? 'Resume' : 'Pause' }}
            </button>
            <button
                class="rounded bg-[#ef4444] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#dc2626]"
                @click="resetState"
            >
                Reset
            </button>
        </div>
    </header>
</template>
