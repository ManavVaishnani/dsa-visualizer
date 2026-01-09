<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useHead } from '@unhead/vue'

useHead({
  titleTemplate: (title) => (title ? `${title} | AlgoFlow` : 'AlgoFlow - Visualize DSA'),
})
</script>

<template>
  <RouterView />
</template>
