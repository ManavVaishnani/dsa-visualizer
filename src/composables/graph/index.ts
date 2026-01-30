/**
 * Graph Module Index (Dependency Inversion Principle)
 *
 * This is the unified entry point for all graph functionality.
 * Views and components should import from here, not from individual files.
 */

// ============================================
// State Management
// ============================================

export {
  // Types
  type Node,
  type Edge,
  type Step,
  type GraphType,
  type VisualizationType,
  type GraphAlgo,
  // Reactive state
  nodes,
  edges,
  visitedNodes,
  currentNode,
  queue,
  currentEdge,
  speed,
  isTraversing,
  isPaused,
  explanation,
  shortestPathEdges,
  currentGraphAlgo,
  algoInfo,
  currentAlgorithmInfo,
  distances,
  predecessors,
  selectedStartNode,
  selectedTargetNode,
  targetFound,
  dfsCallStack,
  visitedCount,
  edgeExploredCount,
  steps,
  stepIndex,
  isPlaying,
  graphType,
  visualizationType,
  mstEdges,
  // State utilities
  resetGraphState,
  resetGraph,
  setAlgorithmInfo,
  appendExplanation,
  pauseTraversal,
  buildAdjacencyList,
  snapshot,
  sleep,
  waitWhilePaused,
  // Generation
  generateTree,
  generateGraph,
  generateData,
  // Step controls
  nextStep,
  previousStep,
  gotoStep,
  playSteps,
  stopPlaying,
  resetSteps,
} from './useGraphState'

// ============================================
// Algorithm Registry (OCP Implementation)
// ============================================

export {
  type GraphAlgorithm,
  registerGraphAlgorithm,
  getGraphAlgorithm,
  getAllGraphAlgorithms,
  getGraphAlgorithmInfo,
  runGraphAlgorithm,
  initializeGraphAlgorithm,
  prepareGraphAlgorithmSteps,
  hasGraphAlgorithm,
  // Backward compatibility
  setInitialInfo,
} from './algorithmRegistry'

// ============================================
// Individual Algorithms
// ============================================

// BFS
export {
  runBFS,
  generateBFSSteps,
  prepareBFSSteps,
  initBFS,
  bfsInfo,
} from './algorithms/useBFS'

// DFS
export {
  runDFS,
  generateDFSSteps,
  prepareDFSSteps,
  initDFS,
  dfsInfo,
} from './algorithms/useDFS'

// Dijkstra
export {
  runDijkstra,
  generateDijkstraSteps,
  prepareDijkstraSteps,
  initDijkstra,
  dijkstraInfo,
} from './algorithms/useDijkstra'

// A*
export {
  runAStar,
  generateAStarSteps,
  prepareAStarSteps,
  initAStar,
  astarInfo,
  getHeuristic,
} from './algorithms/useAStar'

// Prim's
export {
  runPrims,
  generatePrimsSteps,
  preparePrimsSteps,
  initPrims,
  primsInfo,
} from './algorithms/usePrims'

// Kruskal's
export {
  runKruskals,
  generateKruskalsSteps,
  prepareKruskalsSteps,
  initKruskals,
  kruskalsInfo,
} from './algorithms/useKruskals'

// Bellman-Ford
export {
  runBellmanFord,
  generateBellmanFordSteps,
  prepareBellmanFordSteps,
  initBellmanFord,
  bellmanFordInfo,
  negativeCycleDetected,
} from './algorithms/useBellmanFord'
