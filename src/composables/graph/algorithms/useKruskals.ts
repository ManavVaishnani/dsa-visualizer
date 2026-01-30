/**
 * Kruskal's Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains Kruskal's algorithm implementation for MST.
 */

import type { AlgorithmInfo } from '@/types/algorithm'
import {
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
  algoInfo,
  targetFound,
  distances,
  predecessors,
  shortestPathEdges,
  sleep,
  snapshot,
  type Step,
  steps,
  stepIndex,
  playSteps,
  stopPlaying,
  setAlgorithmInfo,
  currentGraphAlgo,
  visualizationType,
  generateData,
} from '../useGraphState'

// ============================================
// Algorithm Metadata
// ============================================

export const kruskalsInfo: AlgorithmInfo = {
  name: "Kruskal's Algorithm",
  timeComplexity: 'O(E log E)',
  spaceComplexity: 'O(V)',
  description: "Finds the MST by sorting edges and adding them if they don't form a cycle. Uses Union-Find.",
}

// ============================================
// Algorithm Implementation
// ============================================

export async function runKruskals(): Promise<void> {
  if (isTraversing.value || nodes.value.length === 0) return

  isTraversing.value = true
  isPaused.value = false

  visitedNodes.value = []
  currentNode.value = null
  queue.value = []
  currentEdge.value = null
  targetFound.value = false
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []

  explanation.value = [...algoInfo.value]
  explanation.value.push("Starting Kruskal's Algorithm...")

  const sortedEdges = [...edges.value].sort((a, b) => (a.weight || 0) - (b.weight || 0))
  const parent: Record<number, number> = {}
  nodes.value.forEach((node) => (parent[node.id] = node.id))

  const find = (i: number): number => {
    if (parent[i] === i) return i
    return find(parent[i])
  }

  const union = (i: number, j: number) => {
    const rootI = find(i)
    const rootJ = find(j)
    if (rootI !== rootJ) {
      parent[rootI] = rootJ
      return true
    }
    return false
  }

  for (const edge of sortedEdges) {
    while (isPaused.value) await sleep(100)

    currentEdge.value = { from: edge.from, to: edge.to }
    explanation.value.push(
      `Checking edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} (weight: ${edge.weight}).`,
    )
    await sleep(1000 - speed.value * 9)

    if (find(edge.from) !== find(edge.to)) {
      union(edge.from, edge.to)
      shortestPathEdges.value.push({ from: edge.from, to: edge.to })
      explanation.value.push(
        `Added edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} to MST.`,
      )

      if (!visitedNodes.value.includes(edge.from)) visitedNodes.value.push(edge.from)
      if (!visitedNodes.value.includes(edge.to)) visitedNodes.value.push(edge.to)
    } else {
      explanation.value.push(
        `Edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} forms a cycle. Skipping.`,
      )
    }

    currentEdge.value = null
  }

  isTraversing.value = false
  explanation.value.push("Kruskal's Algorithm completed! Minimum Spanning Tree found.")
}

// ============================================
// Step Generation
// ============================================

export function generateKruskalsSteps(): Step[] {
  if (nodes.value.length === 0) return []

  const stepList: Step[] = []
  const localVisited: number[] = []
  const localMSTEdges: { from: number; to: number }[] = []
  const parent: Record<number, number> = {}
  nodes.value.forEach((node) => (parent[node.id] = node.id))

  const find = (i: number): number => {
    if (parent[i] === i) return i
    return find(parent[i])
  }

  const union = (i: number, j: number) => {
    const rootI = find(i)
    const rootJ = find(j)
    if (rootI !== rootJ) {
      parent[rootI] = rootJ
      return true
    }
    return false
  }

  const sortedEdges = [...edges.value].sort((a, b) => (a.weight || 0) - (b.weight || 0))

  stepList.push(
    snapshot({
      description: 'Initialize: sort all edges by weight.',
    }),
  )

  for (const edge of sortedEdges) {
    stepList.push(
      snapshot({
        currentEdge: { from: edge.from, to: edge.to },
        visitedNodes: [...localVisited],
        shortestPathEdges: [...localMSTEdges],
        description: `Checking edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} (weight: ${edge.weight})`,
      }),
    )

    if (find(edge.from) !== find(edge.to)) {
      union(edge.from, edge.to)
      localMSTEdges.push({ from: edge.from, to: edge.to })
      if (!localVisited.includes(edge.from)) localVisited.push(edge.from)
      if (!localVisited.includes(edge.to)) localVisited.push(edge.to)

      stepList.push(
        snapshot({
          currentEdge: { from: edge.from, to: edge.to },
          visitedNodes: [...localVisited],
          shortestPathEdges: [...localMSTEdges],
          description: `Added edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} to MST (no cycle formed)`,
        }),
      )
    } else {
      stepList.push(
        snapshot({
          currentEdge: { from: edge.from, to: edge.to },
          visitedNodes: [...localVisited],
          shortestPathEdges: [...localMSTEdges],
          description: `Skipped edge ${nodes.value[edge.from]?.label} - ${nodes.value[edge.to]?.label} (forms a cycle)`,
        }),
      )
    }
  }

  stepList.push(
    snapshot({
      currentEdge: null,
      visitedNodes: [...localVisited],
      shortestPathEdges: [...localMSTEdges],
      description: "Kruskal's Algorithm completed. MST found.",
    }),
  )

  return stepList
}

// ============================================
// Prepare Steps
// ============================================

export function prepareKruskalsSteps(autoPlay = false): void {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  explanation.value.push("Prepared Kruskal's steps.")
  steps.value = generateKruskalsSteps()
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

// ============================================
// Initialize
// ============================================

export function initKruskals(): void {
  currentGraphAlgo.value = 'kruskals'
  setAlgorithmInfo(kruskalsInfo)
  visualizationType.value = 'graph'
  generateData()
}

export default {
  key: 'kruskals',
  info: kruskalsInfo,
  run: runKruskals,
  generateSteps: generateKruskalsSteps,
  prepareSteps: prepareKruskalsSteps,
  init: initKruskals,
}
