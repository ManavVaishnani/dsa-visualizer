/**
 * Tree Module Index (Dependency Inversion Principle)
 *
 * This is the unified entry point for all tree functionality.
 * Views and components should import from here, not from individual files.
 */

// ============================================
// State Management
// ============================================

export {
  // Types
  type TreeNode,
  type TreeEdge,
  type TreeStep,
  // Reactive state
  treeNodes,
  treeEdges,
  visitedTreeNodes,
  currentTreeNode,
  currentTreeEdge,
  traversalResult,
  callStack,
  treeSpeed,
  isTreeTraversing,
  isTreePaused,
  treeExplanation,
  currentAlgorithmInfo,
  treeInfo,
  treeVisitedCount,
  treeEdgeExploredCount,
  treeSteps,
  treeStepIndex,
  isTreePlaying,
  // State utilities
  resetTreeState,
  resetTree,
  setAlgorithmInfo,
  appendExplanation,
  togglePause,
  generateBinaryTree,
  // Step controls
  nextTreeStep,
  previousTreeStep,
  gotoTreeStep,
  playTreeSteps,
  stopTreePlaying,
  resetTreeSteps,
} from './useTreeState'

// ============================================
// Algorithm Registry (OCP Implementation)
// ============================================

export {
  type TreeAlgorithm,
  type TreeAlgo,
  registerTreeAlgorithm,
  getTreeAlgorithm,
  getAllTreeAlgorithms,
  getTreeAlgorithmInfo,
  runTreeAlgorithm,
  initializeTreeAlgorithm,
  prepareTreeAlgorithmSteps,
  hasTreeAlgorithm,
  // Backward compatibility
  setTreeInitialInfo,
} from './algorithmRegistry'

// ============================================
// Individual Algorithms
// ============================================

export {
  runInOrderTraversal,
  generateInOrderSteps,
  prepareInOrderSteps,
  initInOrder,
  inOrderInfo,
} from './algorithms/useInOrder'

export {
  runPreOrderTraversal,
  generatePreOrderSteps,
  preparePreOrderSteps,
  initPreOrder,
  preOrderInfo,
} from './algorithms/usePreOrder'

export {
  runPostOrderTraversal,
  generatePostOrderSteps,
  preparePostOrderSteps,
  initPostOrder,
  postOrderInfo,
} from './algorithms/usePostOrder'

// ============================================
// Backward Compatibility - Pause function
// ============================================

export { togglePause as pauseTreeTraversal } from './useTreeState'
