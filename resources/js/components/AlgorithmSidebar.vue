<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3'

const algorithms = [
    { name: 'Bubble Sort', href: '/visualize/bubble-sort' },
    { name: 'Selection Sort', href: '/visualize/selection-sort' },
]

const page = usePage()
</script>

<template>
    <aside class="w-64 bg-gray-800 border-r border-gray-700 p-4">
        <h2 class="text-lg font-semibold mb-6">Algorithms</h2>

        <nav class="space-y-2">
            <Link
                v-for="algo in algorithms"
                :key="algo.name"
                :href="algo.href"
                class="block px-4 py-2 rounded-lg transition"
                :class="page.url === algo.href
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-700'"
            >
                {{ algo.name }}
            </Link>
        </nav>
    </aside>
</template>
