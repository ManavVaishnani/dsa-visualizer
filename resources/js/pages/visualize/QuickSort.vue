<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import BarsVisualizer from '@/components/BarsVisualizer.vue'
import { generateBars } from '@/composables/useSortingController'
import { Head } from '@inertiajs/vue3'
import type { BreadcrumbItemType } from '@/types'

interface Props {
    breadcrumbs?: BreadcrumbItemType[]
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => []
})

onMounted(() => generateBars())
</script>

<template>
    <Head title="Quick Sort Visualization" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="h-full flex items-center justify-center">
            <BarsVisualizer />
        </div>
    </AppLayout>
</template>
