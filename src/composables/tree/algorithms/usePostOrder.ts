/**
 * Post-Order Traversal Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the Post-Order Traversal algorithm implementation.
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

export const postOrderInfo: AlgorithmInfo = {
  name: 'Post-Order Traversal',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(h) where h is height',
  description: 'Left → Right → Node (L-R-N). Deletes tree from leaf to root, postfix expressions.',
}

// ============================================
// Algorithm Implementation
// ============================================

export async function runPostOrderTraversal(): Promise<void> {
  if (!startTraversing()) return

  treeExplanation.value = [...treeInfo.value]
  treeExplanation.value.push('Starting Post-Order Traversal (Left → Right → Node)...')

  const postOrder = async (nodeId: number | null) => {
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
      await postOrder(node.left)
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
      await postOrder(node.right)
    }

    // Visit node LAST (Post-Order)
    await waitWhilePaused()
    currentTreeNode.value = nodeId
    visitedTreeNodes.value.push(nodeId)
    traversalResult.value.push(node.value)
    treeVisitedCount.value++
    treeExplanation.value.push(
      `VISIT: ${node.label} → Result: [${traversalResult.value.join(', ')}]`,
    )
    await sleep(700 - treeSpeed.value * 6)

    callStack.value.pop()
    currentTreeNode.value = null
  }

  await postOrder(0) // Start from root (id 0)

  finishTraversing()
  treeExplanation.value.push(
    `Post-Order Traversal Complete! Result: [${traversalResult.value.join(', ')}]`,
  )
}

// ============================================
// Step Generation
// ============================================

export function generatePostOrderSteps(): TreeStep[] {
  if (treeNodes.value.length === 0) return []

  const stepList: TreeStep[] = []
  const localVisited: number[] = []
  const localResult: number[] = []
  const localStack: number[] = []
  let localCurrent: number | null = null
  let localEdge: { from: number; to: number } | null = null
  let localVisitedCount = 0
  let localEdgeCount = 0

  const postOrder = (nodeId: number | null) => {
    if (nodeId === null) return

    const node = treeNodes.value[nodeId]
    localStack.push(nodeId)
    localCurrent = nodeId

    stepList.push({
      visitedNodes: [...localVisited],
      currentNode: localCurrent,
      currentEdge: null,
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
      postOrder(node.left)
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
      postOrder(node.right)
    }

    // Visit last
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
    description: 'Start Post-Order Traversal',
  })

  postOrder(0)

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

export function preparePostOrderSteps(autoPlay = false): void {
  stopTreePlaying()
  treeExplanation.value = [...treeInfo.value]
  treeExplanation.value.push('Prepared Post-Order steps.')
  treeSteps.value = generatePostOrderSteps()
  treeStepIndex.value = -1
  if (autoPlay) playTreeSteps()
}

// ============================================
// Initialize
// ============================================

export function initPostOrder(): void {
  setAlgorithmInfo(postOrderInfo)
}

export default {
  key: 'postorder',
  info: postOrderInfo,
  run: runPostOrderTraversal,
  generateSteps: generatePostOrderSteps,
  prepareSteps: preparePostOrderSteps,
  init: initPostOrder,
}
