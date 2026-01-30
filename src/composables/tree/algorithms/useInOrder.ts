/**
 * In-Order Traversal Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the In-Order Traversal algorithm implementation.
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

export const inOrderInfo: AlgorithmInfo = {
  name: 'In-Order Traversal',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(h) where h is height',
  description: 'Left → Node → Right (L-N-R). Prints BST nodes in sorted ascending order.',
}

// ============================================
// Algorithm Implementation
// ============================================

export async function runInOrderTraversal(): Promise<void> {
  if (!startTraversing()) return

  treeExplanation.value = [...treeInfo.value]
  treeExplanation.value.push('Starting In-Order Traversal (Left → Node → Right)...')

  const inOrder = async (nodeId: number | null) => {
    if (nodeId === null) return

    await waitWhilePaused()

    const node = treeNodes.value[nodeId]
    callStack.value.push(nodeId)
    currentTreeNode.value = nodeId
    treeExplanation.value.push(`Entering node ${node.label}`)
    await sleep(500 - treeSpeed.value * 4)

    // Traverse left subtree
    if (node.left !== null) {
      currentTreeEdge.value = { from: nodeId, to: node.left }
      treeEdgeExploredCount.value++
      treeExplanation.value.push(`Going to left child of ${node.label}`)
      await sleep(300 - treeSpeed.value * 2)
      currentTreeEdge.value = null
      await inOrder(node.left)
    }

    // Visit node (In-Order: visit after left)
    await waitWhilePaused()
    currentTreeNode.value = nodeId
    visitedTreeNodes.value.push(nodeId)
    traversalResult.value.push(node.value)
    treeVisitedCount.value++
    treeExplanation.value.push(
      `VISIT: ${node.label} → Result: [${traversalResult.value.join(', ')}]`,
    )
    await sleep(700 - treeSpeed.value * 6)

    // Traverse right subtree
    if (node.right !== null) {
      currentTreeEdge.value = { from: nodeId, to: node.right }
      treeEdgeExploredCount.value++
      treeExplanation.value.push(`Going to right child of ${node.label}`)
      await sleep(300 - treeSpeed.value * 2)
      currentTreeEdge.value = null
      await inOrder(node.right)
    }

    callStack.value.pop()
    currentTreeNode.value = null
  }

  await inOrder(0) // Start from root (id 0)

  finishTraversing()
  treeExplanation.value.push(
    `In-Order Traversal Complete! Result: [${traversalResult.value.join(', ')}]`,
  )
}

// ============================================
// Step Generation
// ============================================

export function generateInOrderSteps(): TreeStep[] {
  if (treeNodes.value.length === 0) return []

  const stepList: TreeStep[] = []
  const localVisited: number[] = []
  const localResult: number[] = []
  const localStack: number[] = []
  let localCurrent: number | null = null
  let localEdge: { from: number; to: number } | null = null
  let localVisitedCount = 0
  let localEdgeCount = 0

  const inOrder = (nodeId: number | null) => {
    if (nodeId === null) return

    const node = treeNodes.value[nodeId]
    localStack.push(nodeId)
    localCurrent = nodeId

    stepList.push({
      visitedNodes: [...localVisited],
      currentNode: localCurrent,
      currentEdge: localEdge,
      callStack: [...localStack],
      traversalResult: [...localResult],
      visitedCount: localVisitedCount,
      edgeExploredCount: localEdgeCount,
      description: `Enter ${node.label}`,
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
      inOrder(node.left)
    }

    // Visit
    localCurrent = nodeId
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

    // Right
    if (node.right !== null) {
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
      inOrder(node.right)
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
    description: 'Start In-Order Traversal',
  })

  inOrder(0)

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

export function prepareInOrderSteps(autoPlay = false): void {
  stopTreePlaying()
  treeExplanation.value = [...treeInfo.value]
  treeExplanation.value.push('Prepared In-Order steps.')
  treeSteps.value = generateInOrderSteps()
  treeStepIndex.value = -1
  if (autoPlay) playTreeSteps()
}

// ============================================
// Initialize
// ============================================

export function initInOrder(): void {
  setAlgorithmInfo(inOrderInfo)
}

export default {
  key: 'inorder',
  info: inOrderInfo,
  run: runInOrderTraversal,
  generateSteps: generateInOrderSteps,
  prepareSteps: prepareInOrderSteps,
  init: initInOrder,
}
