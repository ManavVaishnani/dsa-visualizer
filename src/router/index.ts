import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Algorithms from '../views/Algorithms.vue'
import Sorting from '../views/Sorting.vue'
import Searching from '../views/Searching.vue'
import Graphs from '../views/Graphs.vue'
import Trees from '../views/Trees.vue'
import BubbleSort from '../views/visualize/BubbleSort.vue'
import SelectionSort from '../views/visualize/SelectionSort.vue'
import InsertionSort from '../views/visualize/InsertionSort.vue'
import MergeSort from '../views/visualize/MergeSort.vue'
import QuickSort from '../views/visualize/QuickSort.vue'
import LinearSearch from '../views/visualize/LinearSearch.vue'
import BinarySearch from '../views/visualize/BinarySearch.vue'
import BFS from '../views/visualize/BFS.vue'
import DFS from '../views/visualize/DFS.vue'
import Dijkstra from '../views/visualize/Dijkstra.vue'
import AStar from '../views/visualize/AStar.vue'
import InOrderTraversal from '../views/visualize/InOrderTraversal.vue'
import PreOrderTraversal from '../views/visualize/PreOrderTraversal.vue'
import PostOrderTraversal from '../views/visualize/PostOrderTraversal.vue'
import Prims from '../views/visualize/Prims.vue'
import Kruskals from '../views/visualize/Kruskals.vue'
import BellmanFord from '../views/visualize/BellmanFord.vue'
import DataStructures from '../views/DataStructures.vue'
import Stack from '../views/visualize/Stack.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/algorithms', name: 'algorithms', component: Algorithms },
    { path: '/sorting', name: 'sorting', component: Sorting },
    { path: '/searching', name: 'searching', component: Searching },
    { path: '/graphs', name: 'graphs', component: Graphs },
    { path: '/trees', name: 'trees', component: Trees },
    { path: '/visualize/bubble-sort', name: 'bubble-sort', component: BubbleSort },
    { path: '/visualize/selection-sort', name: 'selection-sort', component: SelectionSort },
    { path: '/visualize/insertion-sort', name: 'insertion-sort', component: InsertionSort },
    { path: '/visualize/merge-sort', name: 'merge-sort', component: MergeSort },
    { path: '/visualize/quick-sort', name: 'quick-sort', component: QuickSort },
    { path: '/visualize/linear-search', name: 'linear-search', component: LinearSearch },
    { path: '/visualize/binary-search', name: 'binary-search', component: BinarySearch },
    { path: '/visualize/bfs', name: 'bfs', component: BFS },
    { path: '/visualize/dfs', name: 'dfs', component: DFS },
    { path: '/visualize/dijkstra', name: 'dijkstra', component: Dijkstra },
    { path: '/visualize/astar', name: 'astar', component: AStar },
    { path: '/visualize/inorder-traversal', name: 'inorder-traversal', component: InOrderTraversal },
    { path: '/visualize/preorder-traversal', name: 'preorder-traversal', component: PreOrderTraversal },
    { path: '/visualize/postorder-traversal', name: 'postorder-traversal', component: PostOrderTraversal },
    { path: '/visualize/prims', name: 'prims', component: Prims },
    { path: '/visualize/kruskals', name: 'kruskals', component: Kruskals },
    { path: '/visualize/bellman-ford', name: 'bellman-ford', component: BellmanFord },
    { path: '/data-structures', name: 'data-structures', component: DataStructures },
    { path: '/visualize/stack', name: 'stack', component: Stack },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
