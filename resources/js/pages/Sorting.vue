<script setup lang="ts">
import RetroCard from '@/components/RetroCard.vue';
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, Binary } from 'lucide-vue-next';

const algorithms = [
    {
        title: 'Bubble Sort',
        href: '/visualize/bubble-sort',
        img: '/bubble-sort.svg',
        desc: 'Simple comparison-based sorting algorithm.',
        complexity: 'O(N²)',
    },
    {
        title: 'Selection Sort',
        href: '/visualize/selection-sort',
        img: '/selection-sort.svg',
        desc: 'In-place comparison sorting algorithm.',
        complexity: 'O(N²)',
    },
    {
        title: 'Insertion Sort',
        href: '/visualize/insertion-sort',
        img: '/insertion-sort.svg',
        desc: 'Builds the final sorted array one item at a time.',
        complexity: 'O(N²)',
    },
    {
        title: 'Merge Sort',
        href: '/visualize/merge-sort',
        img: '/merge-sort.svg',
        desc: 'Divider and conquer algorithm.',
        complexity: 'O(N log N)',
    },
    {
        title: 'Quick Sort',
        href: '/visualize/quick-sort',
        img: '/quick-sort.svg',
        desc: 'Efficient divide and conquer sorting algorithm.',
        complexity: 'O(N log N)',
    },
];
</script>

<template>
    <Head title="Sorting Algorithms" />

    <div class="min-h-screen bg-gray-50 px-6 py-8 font-sans text-gray-900">
        <div class="mx-auto max-w-6xl">
            <Link
                href="/"
                class="mb-4 inline-flex items-center gap-2 font-mono text-sm font-bold hover:underline"
            >
                <ArrowLeft class="h-4 w-4" /> BACK_TO_ROOT
            </Link>

            <div class="mb-8 border-b-2 border-black pb-4">
                <h1
                    class="flex items-center gap-3 font-mono text-3xl font-black uppercase"
                >
                    <Binary class="h-8 w-8" />
                    Sorting_Module
                </h1>
                <p class="mt-2 font-mono text-gray-600">
                    > Initialize comparison and non-comparison based sorting
                    visualizations.
                </p>
            </div>

            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="algo in algorithms" :key="algo.href">
                    <RetroCard
                        class="h-full overflow-hidden p-0 transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                        <Link
                            :href="algo.href"
                            class="group flex h-full flex-col"
                        >
                            <div
                                class="flex h-40 items-center justify-center border-b-2 border-black bg-gray-100 p-4 transition-colors group-hover:bg-gray-200"
                            >
                                <img
                                    class="h-24 w-auto object-contain opacity-80 mix-blend-multiply transition-opacity group-hover:opacity-100"
                                    :src="algo.img"
                                    :alt="algo.title"
                                />
                            </div>
                            <div class="flex flex-1 flex-col bg-white p-4">
                                <h5
                                    class="font-mono text-xl font-bold tracking-tight group-hover:underline"
                                >
                                    {{ algo.title }}
                                </h5>
                                <p
                                    class="mt-1 line-clamp-2 font-mono text-xs text-gray-500"
                                >
                                    {{ algo.desc }}
                                </p>
                                <div class="mt-auto flex gap-2 pt-4">
                                    <span
                                        class="border border-black px-1 font-mono text-[10px] uppercase"
                                        >{{ algo.complexity }}</span
                                    >
                                    <span
                                        class="border border-black bg-black px-1 font-mono text-[10px] text-white uppercase"
                                        >Visualizer</span
                                    >
                                </div>
                            </div>
                        </Link>
                    </RetroCard>
                </div>
            </div>
        </div>
    </div>
</template>
