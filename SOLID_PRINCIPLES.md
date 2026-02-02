# SOLID Principles Applied to DSA Visualizer

This document explains how the SOLID principles can be applied to improve the architecture of the DSA Visualizer project.

## What are SOLID Principles?

SOLID is an acronym for five design principles that make software designs more understandable, flexible, and maintainable:

1. **S**ingle Responsibility Principle (SRP)
2. **O**pen/Closed Principle (OCP)
3. **L**iskov Substitution Principle (LSP)
4. **I**nterface Segregation Principle (ISP)
5. **D**ependency Inversion Principle (DIP)

---

## Current Code Analysis

### Current Structure (Before Refactoring)

```
src/composables/
├── useGraphController.ts     (2000+ lines - handles BFS, DFS, Dijkstra, A*, Prim's, Kruskal's, Bellman-Ford)
├── useSortingController.ts   (400+ lines - handles all sorting algorithms)
├── useTreeController.ts      (800+ lines - handles tree traversals)
├── useStackController.ts     (270 lines)
├── useQueueController.ts     (similar size)
└── useSearchController.ts    (similar size)
```

### Issues Identified

1. **Huge monolithic files** - `useGraphController.ts` is 2000+ lines with 7+ algorithms
2. **Algorithm logic mixed with state management** - Each controller handles both
3. **Strategy pattern violations** - Using if/else chains to select algorithms
4. **No abstraction layers** - Components directly import specific implementations

---

## Applying SOLID Principles

### 1. Single Responsibility Principle (SRP)

> "A class/module should have one, and only one, reason to change."

#### Current Violation
`useGraphController.ts` handles:
- Graph generation
- State management (nodes, edges, visited, etc.)
- 7+ different algorithms (BFS, DFS, Dijkstra, A*, Prim's, Kruskal's, Bellman-Ford)
- Step-by-step playback logic
- Algorithm info/metadata

#### Refactored Structure
```
src/composables/
├── graph/
│   ├── useGraphState.ts           # Only graph state management
│   ├── useGraphGenerator.ts       # Only graph generation
│   ├── useStepController.ts       # Only step playback logic
│   ├── algorithms/
│   │   ├── types.ts               # Shared interfaces
│   │   ├── useBFS.ts              # BFS algorithm only
│   │   ├── useDFS.ts              # DFS algorithm only
│   │   ├── useDijkstra.ts         # Dijkstra algorithm only
│   │   ├── useAStar.ts            # A* algorithm only
│   │   ├── usePrims.ts            # Prim's algorithm only
│   │   ├── useKruskals.ts         # Kruskal's algorithm only
│   │   └── useBellmanFord.ts      # Bellman-Ford algorithm only
│   └── index.ts                   # Unified exports
├── sorting/
│   ├── useSortingState.ts         # State management
│   ├── algorithms/
│   │   ├── useBubbleSort.ts
│   │   ├── useSelectionSort.ts
│   │   ├── useInsertionSort.ts
│   │   ├── useMergeSort.ts
│   │   └── useQuickSort.ts
│   └── index.ts
└── tree/
    ├── useTreeState.ts
    ├── algorithms/
    │   ├── useInOrder.ts
    │   ├── usePreOrder.ts
    │   └── usePostOrder.ts
    └── index.ts
```

---

### 2. Open/Closed Principle (OCP)

> "Software entities should be open for extension, but closed for modification."

#### Current Violation (in SortingControls.vue)
```typescript
const runSort = () => {
  const path = route.path
  if (path.includes('selection-sort')) {
    selectionSort()
  } else if (path.includes('insertion-sort')) {
    insertionSort()
  } else if (path.includes('merge-sort')) {
    mergeSort()
  } else if (path.includes('quick-sort')) {
    quickSort()
  } else {
    bubbleSort()
  }
}
```

This violates OCP because adding a new algorithm requires modifying this function.

#### Solution: Strategy Pattern with Registry
```typescript
// src/composables/sorting/algorithmRegistry.ts
import type { SortingAlgorithm } from './types'
import { bubbleSort } from './algorithms/useBubbleSort'
import { selectionSort } from './algorithms/useSelectionSort'
// ... other imports

interface AlgorithmEntry {
  key: string
  name: string
  execute: () => Promise<void>
  info: AlgorithmInfo
}

const algorithmRegistry = new Map<string, AlgorithmEntry>()

export function registerAlgorithm(entry: AlgorithmEntry) {
  algorithmRegistry.set(entry.key, entry)
}

export function getAlgorithm(key: string): AlgorithmEntry | undefined {
  return algorithmRegistry.get(key)
}

export function runAlgorithm(key: string) {
  const algo = getAlgorithm(key)
  if (algo) {
    algo.execute()
  }
}

// Register all algorithms
registerAlgorithm({
  key: 'bubble-sort',
  name: 'Bubble Sort',
  execute: bubbleSort,
  info: { timeComplexity: 'O(n²)', spaceComplexity: 'O(1)' }
})
// ... register others
```

Now adding a new algorithm only requires calling `registerAlgorithm()`, not modifying existing code.

---

### 3. Liskov Substitution Principle (LSP)

> "Objects of a superclass should be replaceable with objects of its subclasses."

#### Application in TypeScript/Vue
In TypeScript, we achieve LSP through well-defined interfaces that all implementations must follow:

```typescript
// src/composables/graph/algorithms/types.ts
export interface Step {
  visitedNodes: number[]
  currentNode: number | null
  queue?: number[]
  currentEdge: { from: number; to: number } | null
  description?: string
  // ... other common properties
}

export interface GraphAlgorithm {
  name: string
  category: 'traversal' | 'shortest-path' | 'mst'
  
  // All algorithms must implement these
  generateSteps(startNode?: number, targetNode?: number): Step[]
  getInfo(): AlgorithmInfo
  
  // Optional properties based on category
  requiresWeights?: boolean
  supportsTarget?: boolean
}
```

Any algorithm implementing `GraphAlgorithm` can be used interchangeably:

```typescript
function runVisualization(algorithm: GraphAlgorithm, startNode: number) {
  const steps = algorithm.generateSteps(startNode)
  // Works with BFS, DFS, Dijkstra, etc.
  return steps
}
```

---

### 4. Interface Segregation Principle (ISP)

> "Clients should not be forced to depend on interfaces they don't use."

#### Current Issue
All algorithms share the same `Step` interface, but not all algorithms need all properties:
- BFS/DFS use `queue/stack` but not `distances`
- Dijkstra uses `distances` but differently than Bellman-Ford
- MST algorithms use `mstEdges` which others don't need

#### Solution: Segregated Interfaces
```typescript
// Base step interface - minimal, shared by all
export interface BaseStep {
  visitedNodes: number[]
  currentNode: number | null
  currentEdge: { from: number; to: number } | null
  description?: string
}

// Traversal-specific (BFS, DFS)
export interface TraversalStep extends BaseStep {
  queue: number[]  // or stack for DFS
  visitedCount: number
}

// Shortest-path specific (Dijkstra, A*, Bellman-Ford)
export interface ShortestPathStep extends BaseStep {
  distances: Record<number, number>
  predecessors: Record<number, number | null>
  shortestPathEdges?: { from: number; to: number }[]
}

// MST-specific (Prim's, Kruskal's)
export interface MSTStep extends BaseStep {
  mstEdges: { from: number; to: number; weight: number }[]
  totalWeight: number
}
```

Components can now work with only the interfaces they need:

```typescript
// TraversalVisualizer.vue only uses TraversalStep
const step = ref<TraversalStep | null>(null)

// ShortestPathVisualizer.vue uses ShortestPathStep
const step = ref<ShortestPathStep | null>(null)
```

---

### 5. Dependency Inversion Principle (DIP)

> "High-level modules should not depend on low-level modules. Both should depend on abstractions."

#### Current Violation
Views directly import specific algorithm implementations:

```typescript
// BubbleSort.vue - High-level module depends on low-level implementation
import { bubbleSort, generateBars } from '@/composables/useSortingController'
```

#### Solution: Dependency Injection via Composition API
```typescript
// src/composables/sorting/useSortingVisualization.ts
import type { SortingAlgorithm } from './types'
import { useSortingState } from './useSortingState'

export function useSortingVisualization(algorithmKey: string) {
  const state = useSortingState()
  const algorithm = getSortingAlgorithm(algorithmKey) // Get from registry
  
  const run = async () => {
    await algorithm.execute(state.bars.value)
  }
  
  return {
    ...state,
    run,
    info: algorithm.info
  }
}

// BubbleSort.vue - Now depends on abstraction
const { bars, run, info } = useSortingVisualization('bubble-sort')
```

---

## Implementation Status

### Phase 1: Create Type Definitions ✅ COMPLETED
- [x] Created `src/types/algorithm.ts` for shared interfaces
- [x] Created category-specific step interfaces (Sorting, Graph Traversal, Shortest Path, MST, Tree)

### Phase 2: Refactor Controllers (SRP) ✅ COMPLETED
- [x] **Split `useGraphController.ts` into smaller modules** ✅
  - `src/composables/graph/useGraphState.ts` - State management only
  - `src/composables/graph/algorithms/useBFS.ts`
  - `src/composables/graph/algorithms/useDFS.ts`
  - `src/composables/graph/algorithms/useDijkstra.ts`
  - `src/composables/graph/algorithms/useAStar.ts`
  - `src/composables/graph/algorithms/usePrims.ts`
  - `src/composables/graph/algorithms/useKruskals.ts`
  - `src/composables/graph/algorithms/useBellmanFord.ts`
- [x] **Split `useSortingController.ts` into smaller modules** ✅
  - `src/composables/sorting/useSortingState.ts` - State management only
  - `src/composables/sorting/algorithms/useBubbleSort.ts`
  - `src/composables/sorting/algorithms/useSelectionSort.ts`
  - `src/composables/sorting/algorithms/useInsertionSort.ts`
  - `src/composables/sorting/algorithms/useMergeSort.ts`
  - `src/composables/sorting/algorithms/useQuickSort.ts`
- [x] **Split `useTreeController.ts` into smaller modules** ✅
  - `src/composables/tree/useTreeState.ts` - State management only
  - `src/composables/tree/algorithms/useInOrder.ts`
  - `src/composables/tree/algorithms/usePreOrder.ts`
  - `src/composables/tree/algorithms/usePostOrder.ts`

### Phase 3: Implement Strategy Pattern (OCP) ✅ COMPLETED
- [x] Created `src/composables/sorting/algorithmRegistry.ts`
- [x] Created `src/composables/graph/algorithmRegistry.ts`
- [x] Created `src/composables/tree/algorithmRegistry.ts`
- [x] Refactored controls to use registry instead of if/else

### Phase 4: Apply DIP ✅ COMPLETED
- [x] Created `src/composables/sorting/index.ts` as facade
- [x] Created `src/composables/graph/index.ts` as facade
- [x] Created `src/composables/tree/index.ts` as facade
- [x] Updated views to use the new abstractions

---

## Example Refactored Code

### types.ts
```typescript
export interface AlgorithmInfo {
  name: string
  timeComplexity: string
  spaceComplexity: string
  description: string
}

export interface BaseStep {
  description?: string
}

export interface SortingStep extends BaseStep {
  bars: number[]
  active: number[]
  swapping: number[]
  sorted: number[]
}

export interface SortingAlgorithm {
  key: string
  info: AlgorithmInfo
  execute: (bars: number[]) => Promise<void>
  generateSteps: (bars: number[]) => SortingStep[]
}
```

### useBubbleSort.ts
```typescript
import type { SortingAlgorithm, SortingStep } from '../types'
import { useSortingState } from '../useSortingState'

export function useBubbleSort(): SortingAlgorithm {
  const { bars, active, swapping, sorted, speed, isPaused } = useSortingState()
  
  const info = {
    name: 'Bubble Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly steps through the list, compares adjacent elements...'
  }
  
  async function execute() {
    // Bubble sort implementation
  }
  
  function generateSteps(inputBars: number[]): SortingStep[] {
    // Generate step-by-step visualization
  }
  
  return {
    key: 'bubble-sort',
    info,
    execute,
    generateSteps
  }
}
```

### SortingControls.vue (Refactored)
```vue
<script setup lang="ts">
import { useSortingVisualization } from '@/composables/sorting'

const props = defineProps<{
  algorithmKey: string
}>()

const { bars, run, generate, reset, info, isSorting, isPaused } = useSortingVisualization(props.algorithmKey)
</script>

<template>
  <header>
    <button @click="generate">Generate</button>
    <button @click="run" :disabled="isSorting">Start</button>
    <!-- No more if/else for algorithm selection! -->
  </header>
</template>
```

---

## Benefits of This Refactoring

1. **Maintainability**: Each module has a single responsibility
2. **Extensibility**: Add new algorithms without modifying existing code
3. **Testability**: Smaller, focused modules are easier to unit test
4. **Readability**: Easier to understand the codebase
5. **Reusability**: Algorithm implementations can be shared across different views

---

## Conclusion

While the current codebase works, applying SOLID principles will make it:
- Easier to add new algorithms
- Easier to maintain existing code
- More scalable as the project grows
- Better organized for collaboration

The refactoring can be done incrementally, starting with the largest files (`useGraphController.ts`) and working through each category.
