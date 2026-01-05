<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';

const algorithms = [
    {
        title: 'Bubble Sort',
        href: '/visualize/bubble-sort',
        img: '/bubble-sort.png',
    },
    {
        title: 'Selection Sort',
        href: '/visualize/selection-sort',
        img: '/selection-sort.png',
    },
    {
        title: 'Insertion Sort',
        href: '/visualize/insertion-sort',
        img: '/insertion-sort.png',
    },
    {
        title: 'Merge Sort',
        href: '/visualize/merge-sort',
        img: '/merge-sort.png',
    },
    {
        title: 'Quick Sort',
        href: '/visualize/quick-sort',
        img: '/quick-sort.png',
    },
];
</script>

<template>
    <Head title="Algorithms"> </Head>

    <div class="min-h-screen bg-[#0f172a] px-6 py-8 text-[#f1f5f9]">
        <div class="mx-auto max-w-6xl">
            <h1 class="mb-6 text-center text-3xl font-semibold text-[#3b82f6]">
                Algorithms
            </h1>

            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="algo in algorithms" :key="algo.href">
                    <div
                        class="bg-neutral-primary-soft border-default rounded-base block max-w-sm overflow-hidden border shadow-xs"
                    >
                        <Link :href="algo.href">
                            <img
                                class="h-44 w-full object-cover"
                                :src="algo.img"
                                :alt="algo.title"
                            />
                        </Link>
                        <div class="bg-[#1e293b] p-6 text-center">
                            <Link :href="algo.href" class="block">
                                <h5
                                    class="mt-3 mb-0 text-2xl font-semibold tracking-tight text-[#f1f5f9] hover:text-[#3b82f6]"
                                >
                                    {{ algo.title }}
                                </h5>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Use Abel font imported in Head */
.rounded-base {
    border-radius: 12px;
}
.shadow-xs {
    box-shadow: 0 1px 3px rgba(2, 6, 23, 0.2);
}
.border-default {
    border-color: #334155;
}
</style>
