/**
 * Graph Algorithm Registry (Open/Closed Principle)
 *
 * This registry allows adding new graph algorithms WITHOUT modifying existing code.
 * Simply call registerGraphAlgorithm() to add a new algorithm.
 */

import type { AlgorithmInfo } from '@/types/algorithm'
import type { Step, GraphAlgo } from './useGraphState'
import { currentGraphAlgo, algoInfo, explanation } from './useGraphState'

// Import all algorithms
import bfsAlgo from './algorithms/useBFS'
import dfsAlgo from './algorithms/useDFS'
import dijkstraAlgo from './algorithms/useDijkstra'
import astarAlgo from './algorithms/useAStar'
import primsAlgo from './algorithms/usePrims'
import kruskalsAlgo from './algorithms/useKruskals'
import bellmanFordAlgo from './algorithms/useBellmanFord'

// ============================================
// Types
// ============================================

export interface GraphAlgorithm {
  key: string
  info: AlgorithmInfo
  run: (start?: number) => Promise<void>
  generateSteps: (start?: number) => Step[]
  prepareSteps?: (...args: unknown[]) => void
  init: () => void
}

// ============================================
// Algorithm Registry
// ============================================

const algorithmRegistry = new Map<string, GraphAlgorithm>()

/**
 * Register a graph algorithm
 * Follow Open/Closed Principle: Open for extension, closed for modification
 */
export function registerGraphAlgorithm(algorithm: GraphAlgorithm): void {
  algorithmRegistry.set(algorithm.key, algorithm)
}

/**
 * Get a graph algorithm by key
 */
export function getGraphAlgorithm(key: string): GraphAlgorithm | undefined {
  return algorithmRegistry.get(key)
}

/**
 * Get all registered algorithms
 */
export function getAllGraphAlgorithms(): GraphAlgorithm[] {
  return Array.from(algorithmRegistry.values())
}

/**
 * Get algorithm info by key
 */
export function getGraphAlgorithmInfo(key: string): AlgorithmInfo | undefined {
  return algorithmRegistry.get(key)?.info
}

/**
 * Run a graph algorithm by key
 */
export async function runGraphAlgorithm(key: string, start?: number): Promise<void> {
  const algorithm = getGraphAlgorithm(key)
  if (algorithm) {
    await algorithm.run(start)
  } else {
    console.warn(`Graph algorithm "${key}" not found in registry`)
  }
}

/**
 * Initialize an algorithm (set its info in state)
 */
export function initializeGraphAlgorithm(key: string): void {
  const algorithm = getGraphAlgorithm(key)
  if (algorithm) {
    algorithm.init()
  }
}

/**
 * Prepare steps for an algorithm
 */
export function prepareGraphAlgorithmSteps(key: string, start?: number, autoPlay = false): void {
  const algorithm = getGraphAlgorithm(key)
  if (algorithm?.prepareSteps) {
    algorithm.prepareSteps(start, autoPlay)
  }
}

/**
 * Check if an algorithm is registered
 */
export function hasGraphAlgorithm(key: string): boolean {
  return algorithmRegistry.has(key)
}

// ============================================
// Register Default Algorithms
// ============================================

// Note: Using type assertions because algorithms have slightly different prepareSteps signatures
// (some require start node, some don't). This is acceptable as the registry wrapper handles
// the dispatch appropriately via prepareGraphAlgorithmSteps()
registerGraphAlgorithm(bfsAlgo as unknown as GraphAlgorithm)
registerGraphAlgorithm(dfsAlgo as unknown as GraphAlgorithm)
registerGraphAlgorithm(dijkstraAlgo as unknown as GraphAlgorithm)
registerGraphAlgorithm(astarAlgo as unknown as GraphAlgorithm)
registerGraphAlgorithm(primsAlgo as unknown as GraphAlgorithm)
registerGraphAlgorithm(kruskalsAlgo as unknown as GraphAlgorithm)
registerGraphAlgorithm(bellmanFordAlgo as unknown as GraphAlgorithm)

// ============================================
// Backward Compatibility
// ============================================

const algoInfoMap: Record<GraphAlgo, string[]> = {
  bfs: [
    'ALGO: Breadth First Search (BFS)',
    'WHAT: Level-by-level traversal of a graph using a queue.',
    'WHY: Finds the shortest path in unweighted graphs.',
    'WHERE: Peer-to-peer networks, GPS navigation, social networks.',
  ],
  dfs: [
    'ALGO: Depth First Search (DFS)',
    'WHAT: Explores as far as possible along each branch before backtracking.',
    'WHY: Very memory efficient; great for pathfinding and cycle detection.',
    'WHERE: Solving puzzles, topological sorting, scheduling.',
  ],
  dijkstra: [
    "ALGO: Dijkstra's Algorithm",
    'WHAT: Finds the shortest paths from a source node to all other nodes in a weighted graph.',
    'WHY: Guaranteed to find the absolute shortest path if all edge weights are non-negative.',
    'WHERE: Google Maps, OSPF routing protocol, network pathfinding.',
  ],
  astar: [
    'ALGO: A* Search Algorithm',
    'WHAT: An informed search algorithm that uses both path cost and heuristics to find the shortest path.',
    'WHY: More efficient than Dijkstra as it uses a heuristic to guide the search towards the target.',
    'WHERE: Game AI, pathfinding in complex maps, robotics.',
  ],
  prims: [
    "ALGO: Prim's Algorithm",
    'WHAT: Finds the Minimum Spanning Tree (MST) for a weighted undirected graph.',
    'WHY: Guaranteed to find a subset of edges that connects all vertices with the minimum total weight.',
    'WHERE: Network design, laying cables, building transportation networks.',
  ],
  kruskals: [
    "ALGO: Kruskal's Algorithm",
    "WHAT: Finds the Minimum Spanning Tree (MST) by sorting edges and adding them if they don't form a cycle.",
    'WHY: Efficient for sparse graphs; easy to implement with Union-Find.',
    'WHERE: LAN network design, clustering, image segmentation.',
  ],
  bellmanford: [
    'ALGO: Bellman-Ford Algorithm',
    'WHAT: Finds the shortest paths from a source node to all other nodes, even with negative edge weights.',
    'WHY: Can handle negative edge weights and detect negative cycles (unlike Dijkstra).',
    'WHERE: Currency arbitrage detection, routing protocols (RIP), network flow analysis.',
  ],
}

export function setInitialInfo(algo: GraphAlgo): void {
  currentGraphAlgo.value = algo
  algoInfo.value = algoInfoMap[algo]
  explanation.value = [...algoInfoMap[algo]]

  // Initialize the algorithm
  initializeGraphAlgorithm(algo)
}

// Export for backward compatibility
export { type GraphAlgo }
