/**
 * Tree Algorithm Registry (Open/Closed Principle)
 *
 * This registry allows adding new tree algorithms WITHOUT modifying existing code.
 * Simply call registerTreeAlgorithm() to add a new algorithm.
 */

import type { AlgorithmInfo } from '@/types/algorithm'
import type { TreeStep } from './useTreeState'
import inOrderAlgo from './algorithms/useInOrder'
import preOrderAlgo from './algorithms/usePreOrder'
import postOrderAlgo from './algorithms/usePostOrder'

// ============================================
// Types
// ============================================

export interface TreeAlgorithm {
  key: string
  info: AlgorithmInfo
  run: () => Promise<void>
  generateSteps: () => TreeStep[]
  prepareSteps?: (autoPlay?: boolean) => void
  init: () => void
}

// ============================================
// Algorithm Registry
// ============================================

const algorithmRegistry = new Map<string, TreeAlgorithm>()

/**
 * Register a tree algorithm
 * Follow Open/Closed Principle: Open for extension, closed for modification
 */
export function registerTreeAlgorithm(algorithm: TreeAlgorithm): void {
  algorithmRegistry.set(algorithm.key, algorithm)
}

/**
 * Get a tree algorithm by key
 */
export function getTreeAlgorithm(key: string): TreeAlgorithm | undefined {
  return algorithmRegistry.get(key)
}

/**
 * Get all registered algorithms
 */
export function getAllTreeAlgorithms(): TreeAlgorithm[] {
  return Array.from(algorithmRegistry.values())
}

/**
 * Get algorithm info by key
 */
export function getTreeAlgorithmInfo(key: string): AlgorithmInfo | undefined {
  return algorithmRegistry.get(key)?.info
}

/**
 * Run a tree algorithm by key
 */
export async function runTreeAlgorithm(key: string): Promise<void> {
  const algorithm = getTreeAlgorithm(key)
  if (algorithm) {
    await algorithm.run()
  } else {
    console.warn(`Tree algorithm "${key}" not found in registry`)
  }
}

/**
 * Initialize an algorithm (set its info in state)
 */
export function initializeTreeAlgorithm(key: string): void {
  const algorithm = getTreeAlgorithm(key)
  if (algorithm) {
    algorithm.init()
  }
}

/**
 * Prepare steps for an algorithm
 */
export function prepareTreeAlgorithmSteps(key: string, autoPlay = false): void {
  const algorithm = getTreeAlgorithm(key)
  if (algorithm?.prepareSteps) {
    algorithm.prepareSteps(autoPlay)
  }
}

/**
 * Check if an algorithm is registered
 */
export function hasTreeAlgorithm(key: string): boolean {
  return algorithmRegistry.has(key)
}

// ============================================
// Register Default Algorithms
// ============================================

registerTreeAlgorithm(inOrderAlgo)
registerTreeAlgorithm(preOrderAlgo)
registerTreeAlgorithm(postOrderAlgo)

// ============================================
// Backward Compatibility
// ============================================

export type TreeAlgo = 'inorder' | 'preorder' | 'postorder'

export function setTreeInitialInfo(algo: TreeAlgo): void {
  initializeTreeAlgorithm(algo)
}
