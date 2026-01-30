/**
 * Pre-Order Traversal Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the Pre-Order Traversal algorithm implementation.
 * It uses the shared state from useTreeState.
 */

import type { AlgorithmInfo } from '@/types/algorithm'
import {
  treeNodes,
  visitedTreeNodes,
  currentTreeNode,
  currentTreeEdge,
  traversalResult,
  callStack,
  treeSpeed,
  treeVisitedCount,
  treeEdgeExploredCount,
  treeExplanation,
  treeInfo,
  treeSteps,
  treeStepIndex,
  sleep,
  waitWhilePaused,
  startTraversing,
  finishTraversing,
  setAlgorithmInfo,
  stopTreePlaying,
  playTreeSteps,
  type TreeStep,
} from '../useTreeState'

// ============================================
// Algorithm Metadata
// ============================================

export const preOrderInfo: AlgorithmInfo = {
  name: 'Pre-Order Traversal',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(h) where h is height',
  description: 'Node → Left → Right (N-L-R). Creates a copy of the tree, prefix expressions.',
}

// ============================================
// Algorithm Implementation
// ============================================

export async function runPreOrderTraversal(): Promise<void> {
  if (!startTraversing()) return

  treeExplanation.value = [...treeInfo.value]
  treeExplanation.value.push('Starting Pre-Order Traversal (Node → Left → Right)...')

  const preOrder = async (nodeId: number | null) => {
    if (nodeId === null) return

    await waitWhilePaused()

    const node = treeNodes.value[nodeId]
    callStack.value.push(nodeId)
    currentTreeNode.value = nodeId

    // Visit node FIRST (Pre-Order)
    visitedTreeNodes.value.push(nodeId)
    traversalResult.value.push(node.value)
    treeVisitedCount.value++
    treeExplanation.value.push(
      `VISIT: ${node.label} → Result: [${traversalResult.value.join(', ')}]`,
    )
    await sleep(700 - treeSpeed.value * 6)

    // Traverse left subtree
    if (node.left !== null) {
      currentTreeEdge.value = { from: nodeId, to: node.left }
      treeEdgeExploredCount.value++
      treeExplanation.value.push(`Going to left child of ${node.label}`)
      await sleep(300 - treeSpeed.value * 2)
      currentTreeEdge.value = null
      await preOrder(node.left)
    }

    // Traverse right subtree
    await waitWhilePaused()
    if (node.right !== null) {
      currentTreeNode.value = nodeId
      currentTreeEdge.value = { from: nodeId, to: node.right }
      treeEdgeExploredCount.value++
      treeExplanation.value.push(`Going to right child of ${node.label}`)
      await sleep(300 - treeSpeed.value * 2)
      currentTreeEdge.value = null
      await preOrder(node.right)
    }

    callStack.value.pop()
    currentTreeNode.value = null
  }

  await preOrder(0) // Start from root (id 0)

  finishTraversing()
  treeExplanation.value.push(
    `Pre-Order Traversal Complete! Result: [${traversalResult.value.join(', ')}]`,
  )
}

// ============================================
// Step Generation
// ============================================

export function generatePreOrderSteps(): TreeStep[] {
  if (treeNodes.value.length === 0) return []

  const stepList: TreeStep[] = []
  const localVisited: number[] = []
  const localResult: number[] = []
  const localStack: number[] = []
  let localCurrent: number | null = null
  let localEdge: { from: number; to: number } | null = null
  let localVisitedCount = 0
  let localEdgeCount = 0

  const preOrder = (nodeId: number | null) => {
    if (nodeId === null) return

    const node = treeNodes.value[nodeId]
    localStack.push(nodeId)
    localCurrent = nodeId

    // Visit first
    localVisited.push(nodeId)
    localResult.push(node.value)
    localVisitedCount++
    stepList.push({
      visitedNodes: [...localVisited],
      currentNode: localCurrent,
      currentEdge: null,
      callStack: [...localStack],
      traversalResult: [...localResult],
      visitedCount: localVisitedCount,
      edgeExploredCount: localEdgeCount,
      description: `VISIT ${node.label}`,
    })

    // Left
    if (node.left !== null) {
      localEdge = { from: nodeId, to: node.left }
      localEdgeCount++
      stepList.push({
        visitedNodes: [...localVisited],
        currentNode: localCurrent,
        currentEdge: localEdge,
        callStack: [...localStack],
        traversalResult: [...localResult],
        visitedCount: localVisitedCount,
        edgeExploredCount: localEdgeCount,
        description: `Go left from ${node.label}`,
      })
      localEdge = null
      preOrder(node.left)
    }

    // Right
    if (node.right !== null) {
      localCurrent = nodeId
      localEdge = { from: nodeId, to: node.right }
      localEdgeCount++
      stepList.push({
        visitedNodes: [...localVisited],
        currentNode: localCurrent,
        currentEdge: localEdge,
        callStack: [...localStack],
        traversalResult: [...localResult],
        visitedCount: localVisitedCount,
        edgeExploredCount: localEdgeCount,
        description: `Go right from ${node.label}`,
      })
      localEdge = null
      preOrder(node.right)
    }

    localStack.pop()
    stepList.push({
      visitedNodes: [...localVisited],
      currentNode: null,
      currentEdge: null,
      callStack: [...localStack],
      traversalResult: [...localResult],
      visitedCount: localVisitedCount,
      edgeExploredCount: localEdgeCount,
      description: `Backtrack from ${node.label}`,
    })
  }

  stepList.push({
    visitedNodes: [],
    currentNode: null,
    currentEdge: null,
    callStack: [],
    traversalResult: [],
    visitedCount: 0,
    edgeExploredCount: 0,
    description: 'Start Pre-Order Traversal',
  })

  preOrder(0)

  stepList.push({
    visitedNodes: [...localVisited],
    currentNode: null,
    currentEdge: null,
    callStack: [],
    traversalResult: [...localResult],
    visitedCount: localVisitedCount,
    edgeExploredCount: localEdgeCount,
    description: 'Complete!',
  })

  return stepList
}

export function preparePreOrderSteps(autoPlay = false): void {
  stopTreePlaying()
  treeExplanation.value = [...treeInfo.value]
  treeExplanation.value.push('Prepared Pre-Order steps.')
  treeSteps.value = generatePreOrderSteps()
  treeStepIndex.value = -1
  if (autoPlay) playTreeSteps()
}

// ============================================
// Initialize
// ============================================

export function initPreOrder(): void {
  setAlgorithmInfo(preOrderInfo)
}

export default {
  key: 'preorder',
  info: preOrderInfo,
  run: runPreOrderTraversal,
  generateSteps: generatePreOrderSteps,
  prepareSteps: preparePreOrderSteps,
  init: initPreOrder,
}
