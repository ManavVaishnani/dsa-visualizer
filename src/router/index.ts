import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Algorithms from '../views/Algorithms.vue'
import Sorting from '../views/Sorting.vue'
import Searching from '../views/Searching.vue'
import Graphs from '../views/Graphs.vue'
import BubbleSort from '../views/visualize/BubbleSort.vue'
import SelectionSort from '../views/visualize/SelectionSort.vue'
import InsertionSort from '../views/visualize/InsertionSort.vue'
import MergeSort from '../views/visualize/MergeSort.vue'
import QuickSort from '../views/visualize/QuickSort.vue'
import LinearSearch from '../views/visualize/LinearSearch.vue'
import BinarySearch from '../views/visualize/BinarySearch.vue'
import BFS from '../views/visualize/BFS.vue'
import DFS from '../views/visualize/DFS.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/algorithms', name: 'algorithms', component: Algorithms },
    { path: '/sorting', name: 'sorting', component: Sorting },
    { path: '/searching', name: 'searching', component: Searching },
    { path: '/graphs', name: 'graphs', component: Graphs },
    { path: '/visualize/bubble-sort', name: 'bubble-sort', component: BubbleSort },
    { path: '/visualize/selection-sort', name: 'selection-sort', component: SelectionSort },
    { path: '/visualize/insertion-sort', name: 'insertion-sort', component: InsertionSort },
    { path: '/visualize/merge-sort', name: 'merge-sort', component: MergeSort },
    { path: '/visualize/quick-sort', name: 'quick-sort', component: QuickSort },
    { path: '/visualize/linear-search', name: 'linear-search', component: LinearSearch },
    { path: '/visualize/binary-search', name: 'binary-search', component: BinarySearch },
    { path: '/visualize/bfs', name: 'bfs', component: BFS },
    { path: '/visualize/dfs', name: 'dfs', component: DFS },
  ],
})

export default router
