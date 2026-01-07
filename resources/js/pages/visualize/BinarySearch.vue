<script setup lang="ts">
import ArrayVisualizer from '@/components/ArrayVisualizer.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import LinkedListVisualizer from '@/components/LinkedListVisualizer.vue';
import SearchControls from '@/components/SearchControls.vue';
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
    sortArray,
    target,
} from '@/composables/useSearchController';
import type { BreadcrumbItemType } from '@/types';
import { Head } from '@inertiajs/vue3';
import { computed, onMounted, ref, watch } from 'vue';

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const transformedBreadcrumbs = computed(() => {
    if (!props.breadcrumbs) return [];
    return props.breadcrumbs.map((item) => ({
        title: (item as any).label || item.title || '',
        href: item.href,
    }));
});

const showNotFoundMessage = ref(false);

watch(notFound, (newValue) => {
    if (newValue) {
        showNotFoundMessage.value = true;
        setTimeout(() => {
            showNotFoundMessage.value = false;
        }, 3000);
    }
});

onMounted(() => {
    generateRandomArray(arraySize.value);
    // Binary search requires sorted array
    if (dataStructure.value === 'array') {
        sortArray();
    }
});
</script>

<template>
    <Head title="Binary Search Visualization" />

    <div class="flex h-screen bg-[#0f172a] text-[#f1f5f9]">
        <!-- Notification Popup -->
        <div
            v-if="showNotFoundMessage"
            class="animate-slide-in-right fixed top-20 right-6 z-50 rounded-lg border border-[#ef4444] bg-[#1e293b] px-6 py-4 shadow-xl"
        >
            <div class="flex items-center gap-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-[#ef4444]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <div>
                    <p class="font-semibold text-[#f1f5f9]">
                        Element Not Found
                    </p>
                    <p class="text-sm text-[#94a3b8]">
                        Target value {{ target }} is not in the
                        {{ dataStructure }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Main Area -->
        <div class="flex flex-1 flex-col overflow-hidden">
            <!-- Top Controls -->
            <SearchControls />

            <!-- Breadcrumbs -->
            <div
                v-if="transformedBreadcrumbs.length > 0"
                class="border-b border-[#334155] px-6 py-3"
            >
                <Breadcrumbs :breadcrumbs="transformedBreadcrumbs" />
            </div>

            <!-- Content -->
            <main
                class="flex flex-1 flex-col items-center justify-center overflow-hidden"
            >
                <!-- Title Section -->
                <div class="mb-6 text-center">
                    <h1 class="text-3xl font-bold text-[#f1f5f9]">
                        Binary Search Visualization
                    </h1>
                    <p class="mt-2 text-sm text-[#94a3b8]">
                        Efficiently searches a sorted array by repeatedly
                        dividing the search interval in half
                    </p>
                </div>

                <!-- Visualizer -->
                <div class="w-full flex-1 overflow-auto">
                    <ArrayVisualizer
                        v-if="dataStructure === 'array'"
                        :numbers="numbers"
                        :target="target"
                        :currentIndex="currentIndex"
                        :low="low"
                        :high="high"
                        :mid="mid"
                        :foundIndex="foundIndex"
                    />
                    <LinkedListVisualizer
                        v-else
                        :numbers="numbers"
                        :target="target"
                        :currentIndex="currentIndex"
                        :low="low"
                        :high="high"
                        :mid="mid"
                        :foundIndex="foundIndex"
                    />
                </div>

                <!-- Stats Section -->
                <div
                    class="mt-6 flex w-full max-w-4xl justify-between rounded-lg bg-[#1e293b] px-6 py-4 text-sm"
                >
                    <div>
                        <strong class="text-[#94a3b8]">Comparisons:</strong>
                        <span class="ml-2 text-[#f1f5f9]">{{
                            comparisonsCount
                        }}</span>
                    </div>
                    <div>
                        <strong class="text-[#94a3b8]">Time Complexity:</strong>
                        <span class="ml-2 text-[#f1f5f9]">O(log n)</span>
                    </div>
                    <div>
                        <strong class="text-[#94a3b8]"
                            >Space Complexity:</strong
                        >
                        <span class="ml-2 text-[#f1f5f9]">O(1)</span>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
