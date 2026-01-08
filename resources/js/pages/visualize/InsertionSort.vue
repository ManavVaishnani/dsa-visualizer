<script setup lang="ts">
import BarsVisualizer from '@/components/BarsVisualizer.vue';
import SortingControls from '@/components/SortingControls.vue';
import { generateBars } from '@/composables/useSortingController';
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItemType } from '@/types';
import { Head } from '@inertiajs/vue3';
import { onMounted } from 'vue';

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

onMounted(() => generateBars());
</script>

<template>
    <Head title="Insertion Sort Visualization" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <template #controls>
            <SortingControls />
        </template>
        <div class="flex h-full items-center justify-center">
            <BarsVisualizer />
        </div>
    </AppLayout>
</template>
