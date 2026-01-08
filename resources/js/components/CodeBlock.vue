<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps<{
    code: string;
    language?: string;
}>();

const displayedCode = ref('');

// Simple typewriter effect
onMounted(() => {
    let i = 0;
    const speed = 15;
    const type = () => {
        if (i < props.code.length) {
            displayedCode.value += props.code.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    // small delay before starting
    setTimeout(type, 500);
});
</script>

<template>
    <div
        class="overflow-x-auto rounded-md border-2 border-gray-200 bg-gray-50 p-4 font-mono text-sm"
    >
        <div class="mb-3 flex gap-1.5 border-b border-gray-200 pb-2">
            <div class="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
            <div class="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
        </div>
        <pre><code class="text-gray-800">{{ displayedCode }}<span class="animate-pulse inline-block w-2 h-4 bg-gray-800 align-middle ml-1"></span></code></pre>
    </div>
</template>
