<script setup lang="ts">
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import GraphControls from '@/components/GraphControls.vue';
import GraphVisualizer from '@/components/GraphVisualizer.vue';
import { generateGraph } from '@/composables/useGraphController';
import type { BreadcrumbItemType } from '@/types';
import { Head } from '@inertiajs/vue3';
import { computed, onMounted } from 'vue';

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

onMounted(() => generateGraph());
</script>

<template>
    <Head title="BFS Visualization" />

    <div class="flex h-screen bg-[#0f172a] text-[#f1f5f9]">
        <!-- Main Area -->
        <div class="flex flex-1 flex-col overflow-hidden">
            <!-- Top Controls -->
            <GraphControls />

            <!-- Breadcrumbs -->
            <div
                v-if="transformedBreadcrumbs.length > 0"
                class="border-b border-[#334155] px-6 py-3"
            >
                <Breadcrumbs :breadcrumbs="transformedBreadcrumbs" />
            </div>

            <!-- Content -->
            <main class="flex-1 overflow-hidden">
                <GraphVisualizer />
            </main>
        </div>
    </div>
</template>
