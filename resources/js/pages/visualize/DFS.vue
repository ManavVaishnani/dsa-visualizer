<script setup lang="ts">
import GraphControls from '@/components/GraphControls.vue';
import GraphVisualizer from '@/components/GraphVisualizer.vue';
import TreeVisualizer from '@/components/TreeVisualizer.vue';
import {
    generateData,
    visualizationType,
} from '@/composables/useGraphController';
import AppSidebarLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItemType } from '@/types';
import { Head } from '@inertiajs/vue3';
import { onMounted } from 'vue';

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

onMounted(() => generateData());
</script>

<template>
    <Head title="DFS Visualization" />

    <AppSidebarLayout :breadcrumbs="breadcrumbs">
        <template #controls>
            <GraphControls :algorithm="'dfs'" />
        </template>

        <div class="h-full w-full">
            <GraphVisualizer v-if="visualizationType === 'graph'" />
            <TreeVisualizer v-else />
        </div>
    </AppSidebarLayout>
</template>
