/**
 * SOLID Principles - Shared Type Definitions
 *
 * These interfaces follow Interface Segregation Principle (ISP):
 * - Base interfaces contain only common properties
 * - Specialized interfaces extend for specific use cases
 *
 * They also enable Liskov Substitution Principle (LSP):
 * - Any algorithm implementing these interfaces can be used interchangeably
 */

// ============================================
// Algorithm Information Interfaces
// ============================================

export interface AlgorithmInfo {
  name: string
  timeComplexity: string
  spaceComplexity: string
  description: string
}

// ============================================
// Base Step Interface (shared by all algorithms)
// ============================================

export interface BaseStep {
  description?: string
}

// ============================================
// Sorting Algorithm Interfaces
// ============================================

export interface SortingStep extends BaseStep {
  bars: number[]
  active: number[]
  swapping: number[]
  sorted: number[]
}

export interface SortingState {
  bars: number[]
  active: number[]
  swapping: number[]
  sorted: number[]
  speed: number
  isSorting: boolean
  isPaused: boolean
  explanation: string[]
}

export interface SortingAlgorithm {
  key: string
  info: AlgorithmInfo
  execute: () => Promise<void>
}

// ============================================
// Graph Algorithm Interfaces
// ============================================

export interface GraphNode {
  id: number
  x: number
  y: number
  label: string
}

export interface GraphEdge {
  from: number
  to: number
  weight?: number
}

export interface GraphBaseStep extends BaseStep {
  visitedNodes: number[]
  currentNode: number | null
  currentEdge: { from: number; to: number } | null
  visitedCount: number
  edgeExploredCount: number
}

// For BFS/DFS traversal algorithms
export interface TraversalStep extends GraphBaseStep {
  queue: number[] // Can be queue (BFS) or stack (DFS)
  dfsCallStack?: number[]
  targetFound?: boolean
}

// For Dijkstra, A*, Bellman-Ford
export interface ShortestPathStep extends GraphBaseStep {
  distances: Record<number, number>
  predecessors: Record<number, number | null>
  shortestPathEdges?: { from: number; to: number }[]
}

// For Prim's, Kruskal's
export interface MSTStep extends GraphBaseStep {
  mstEdges: { from: number; to: number; weight: number }[]
  totalWeight?: number
}

export type GraphStep = TraversalStep | ShortestPathStep | MSTStep

export type GraphAlgorithmCategory = 'traversal' | 'shortest-path' | 'mst'

export interface GraphAlgorithm {
  key: string
  info: AlgorithmInfo
  category: GraphAlgorithmCategory
  run: (startNode?: number, targetNode?: number) => Promise<void>
  generateSteps: (startNode?: number, targetNode?: number) => GraphStep[]
  prepareSteps?: (autoPlay?: boolean) => void
  requiresWeights?: boolean
  supportsTarget?: boolean
}

// ============================================
// Tree Algorithm Interfaces
// ============================================

export interface TreeNode {
  id: number
  x: number
  y: number
  label: string
  value: number
  left: number | null
  right: number | null
  parent: number | null
}

export interface TreeEdge {
  from: number
  to: number
}

export interface TreeStep extends BaseStep {
  visitedNodes: number[]
  currentNode: number | null
  currentEdge: { from: number; to: number } | null
  callStack: number[]
  traversalResult: number[]
  visitedCount: number
  edgeExploredCount: number
}

export interface TreeAlgorithm {
  key: string
  info: AlgorithmInfo
  run: () => Promise<void>
  generateSteps: () => TreeStep[]
  prepareSteps?: (autoPlay?: boolean) => void
}

// ============================================
// Data Structure Interfaces (Stack, Queue)
// ============================================

export interface DataStructureInfo {
  name: string
  timeComplexity: string
  spaceComplexity: string
  description: string
}

export interface StackState {
  stack: number[]
  topIndex: number
  highlightedIndex: number
  animatingIndex: number
  animationType: 'push' | 'pop' | 'peek' | null
  maxSize: number
  speed: number
  isAnimating: boolean
  isPaused: boolean
  explanation: string[]
}

export interface QueueState {
  queue: number[]
  frontIndex: number
  rearIndex: number
  highlightedIndex: number
  animatingIndex: number
  animationType: 'enqueue' | 'dequeue' | 'peek' | null
  maxSize: number
  speed: number
  isAnimating: boolean
  isPaused: boolean
  explanation: string[]
}
