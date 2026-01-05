<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';

const algorithms = [
    { name: 'Bubble Sort', href: '/visualize/bubble-sort' },
    { name: 'Selection Sort', href: '/visualize/selection-sort' },
    { name: 'Insertion Sort', href: '/visualize/insertion-sort' },
    { name: 'Merge Sort', href: '/visualize/merge-sort' },
    { name: 'Quick Sort', href: '/visualize/quick-sort' },
];

const page = usePage();
</script>

<template>
    <aside class="w-64 border-r border-[#334155] bg-[#0f172a] p-4">
        <h2 class="mb-6 text-center text-lg font-semibold text-[#3b82f6]">
            <Link href="/">Algorithms</Link>
        </h2>

        <nav class="space-y-2">
            <Link
                v-for="algo in algorithms"
                :key="algo.name"
                :href="algo.href"
                class="block rounded-lg px-4 py-2 text-[#f1f5f9] transition"
                :class="
                    page.url === algo.href
                        ? 'bg-[#3b82f6] text-white'
                        : 'hover:bg-[#1e293b]'
                "
            >
                {{ algo.name }}
            </Link>
        </nav>
    </aside>
</template>
