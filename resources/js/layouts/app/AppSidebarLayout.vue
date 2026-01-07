<script setup lang="ts">
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import SortingControls from '@/components/SortingControls.vue';
import type { BreadcrumbItemType } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
    breadcrumbs?: BreadcrumbItemType[];
}>();

// Transform breadcrumbs from {label, href} to {title, href} format
const transformedBreadcrumbs = computed(() => {
    if (!props.breadcrumbs) return [];
    return props.breadcrumbs.map((item) => ({
        title: (item as any).label || item.title || '',
        href: item.href,
    }));
});
</script>

<template>
    <div class="flex h-screen bg-[#0f172a] text-[#f1f5f9]">
        <!-- Main Area -->
        <div class="flex flex-1 flex-col overflow-hidden">
            <!-- Top Controls -->
            <SortingControls />

            <!-- Breadcrumbs -->
            <div
                v-if="transformedBreadcrumbs.length > 0"
                class="border-b border-[#334155] px-4 py-3 md:px-6"
            >
                <Breadcrumbs :breadcrumbs="transformedBreadcrumbs" />
            </div>

            <!-- Content -->
            <main class="flex-1 overflow-hidden p-4 md:p-6">
                <slot />
            </main>
        </div>
    </div>
</template>
