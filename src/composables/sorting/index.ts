/**
 * Sorting Module Index (Dependency Inversion Principle)
 *
 * This is the unified entry point for all sorting functionality.
 * Views and components should import from here, not from individual files.
 *
 * Benefits:
 * - Single import point for all sorting functionality
 * - Abstracts away implementation details
 * - Easy to refactor internal structure without breaking consumers
 */

// ============================================
// State Management
// ============================================

export {
  // Types
  type PseudoCodeLine,
  type PseudoVariableValue,
  // Reactive state
  bars,
  active,
  swapping,
  sorted,
  barCount,
  speed,
  isSorting,
  isPaused,
  explanation,
  pseudoCodeLines,
  activePseudoLineId,
  pseudoVariables,
  currentAlgorithmInfo,
  // Computed
  canStart,
  canPause,
  canReset,
  // State utilities
  generateBars,
  resetVisualState,
  clearState,
  togglePause,
  setExplanation,
  appendExplanation,
  setPseudoCode,
  setPseudoState,
  clearPseudoState,
  markSorted,
  markAllSorted,
} from './useSortingState'

// ============================================
// Algorithm Registry (OCP Implementation)
// ============================================

export {
  registerSortingAlgorithm,
  getSortingAlgorithm,
  getAllSortingAlgorithms,
  getSortingAlgorithmInfo,
  runSortingAlgorithm,
  initializeSortingAlgorithm,
  hasSortingAlgorithm,
  // Backward compatibility
  getLegacyAlgorithmKey,
  runSortingAlgorithmByLegacyName,
  initializeSortingAlgorithmByLegacyName,
} from './algorithmRegistry'

// ============================================
// Individual Algorithms (for direct access if needed)
// ============================================

export {
  bubbleSort,
  bubbleSortInfo,
  bubbleSortPseudoCode,
  useBubbleSort,
  initBubbleSort,
} from './algorithms/useBubbleSort'
export {
  selectionSort,
  selectionSortInfo,
  selectionSortPseudoCode,
  useSelectionSort,
  initSelectionSort,
} from './algorithms/useSelectionSort'
export {
  insertionSort,
  insertionSortInfo,
  insertionSortPseudoCode,
  useInsertionSort,
  initInsertionSort,
} from './algorithms/useInsertionSort'
export {
  mergeSort,
  mergeSortInfo,
  mergeSortPseudoCode,
  useMergeSort,
  initMergeSort,
} from './algorithms/useMergeSort'
export {
  quickSort,
  quickSortInfo,
  quickSortPseudoCode,
  useQuickSort,
  initQuickSort,
} from './algorithms/useQuickSort'

// ============================================
// Backward Compatibility Exports
// ============================================

import { initializeSortingAlgorithmByLegacyName } from './algorithmRegistry'

// Legacy setInitialInfo function for backward compatibility
export type SortAlgo = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick'
export const currentSortAlgo = { value: null as SortAlgo | null }

export function setInitialInfo(algo: SortAlgo): void {
  currentSortAlgo.value = algo
  initializeSortingAlgorithmByLegacyName(algo)
}
