<script setup lang="ts">

import AlgorithmSidebar from '@/components/AlgorithmSidebar.vue'
import SortingControls from '@/components/SortingControls.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import type { BreadcrumbItemType } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
    breadcrumbs?: BreadcrumbItemType[]
}>()

// Transform breadcrumbs from {label, href} to {title, href} format
const transformedBreadcrumbs = computed(() => {
    if (!props.breadcrumbs) return []
    return props.breadcrumbs.map(item => ({
        title: (item as any).label || item.title || '',
        href: item.href
    }))
})
</script>

<template>
    <div class="flex h-screen bg-gray-900 text-white">
        <!-- Sidebar -->
        <AlgorithmSidebar />

        <!-- Main Area -->
        <div class="flex flex-col flex-1 overflow-hidden">
            <!-- Top Controls -->
            <SortingControls />

            <!-- Breadcrumbs -->
            <div v-if="transformedBreadcrumbs.length > 0" class="px-6 py-3 border-b border-gray-700">
                <Breadcrumbs :breadcrumbs="transformedBreadcrumbs" />
            </div>

            <!-- Content -->
            <main class="flex-1 p-6 overflow-hidden">
                <slot />
            </main>
        </div>
    </div>
</template>
