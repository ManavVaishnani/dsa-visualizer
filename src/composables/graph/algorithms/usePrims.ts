/**
 * Prim's Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains Prim's algorithm implementation for MST.
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
  selectedStartNode,
  targetFound,
  visitedCount,
  distances,
  predecessors,
  shortestPathEdges,
  sleep,
  buildAdjacencyList,
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

export const primsInfo: AlgorithmInfo = {
  name: "Prim's Algorithm",
  timeComplexity: 'O((V + E) log V)',
  spaceComplexity: 'O(V)',
  description: 'Finds the Minimum Spanning Tree (MST) for a weighted undirected graph.',
}

// ============================================
// Algorithm Implementation
// ============================================

export async function runPrims(start?: number): Promise<void> {
  visitedCount.value = 0

  const startNode = start ?? selectedStartNode.value
  if (startNode === null || isTraversing.value || nodes.value.length === 0) return

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

  nodes.value.forEach((node) => {
    distances.value[node.id] = Infinity
    predecessors.value[node.id] = null
  })
  distances.value[startNode] = 0

  explanation.value = [...algoInfo.value]
  explanation.value.push("Starting Prim's Algorithm...")

  const adjList = buildAdjacencyList()
  const unvisitedSet = new Set(nodes.value.map((n) => n.id))

  while (unvisitedSet.size > 0) {
    while (isPaused.value) await sleep(100)

    let current: number | null = null
    let minDistance = Infinity

    unvisitedSet.forEach((nodeId) => {
      if (distances.value[nodeId] < minDistance) {
        minDistance = distances.value[nodeId]
        current = nodeId
      }
    })

    if (current === null || minDistance === Infinity) {
      explanation.value.push('Remaining nodes are unreachable.')
      break
    }

    currentNode.value = current
    explanation.value.push(
      `Selecting node ${nodes.value[current]?.label} with minimum edge weight ${minDistance === 0 ? '0 (start)' : minDistance}.`,
    )
    await sleep(1000 - speed.value * 9)

    unvisitedSet.delete(current)
    visitedNodes.value.push(current)
    visitedCount.value++

    if (predecessors.value[current] !== null) {
      shortestPathEdges.value.push({ from: predecessors.value[current]!, to: current })
      explanation.value.push(`Added edge ${nodes.value[predecessors.value[current]!]?.label} - ${nodes.value[current]?.label} to MST.`)
    }

    for (const neighborId of adjList[current]) {
      if (!unvisitedSet.has(neighborId)) continue

      const edge = edges.value.find(
        (e) =>
          (e.from === current && e.to === neighborId) ||
          (e.from === neighborId && e.to === current),
      )
      const weight = edge?.weight || 1

      currentEdge.value = { from: current, to: neighborId }
      explanation.value.push(`Checking neighbor ${nodes.value[neighborId]?.label} (edge weight: ${weight}).`)
      await sleep(500 - speed.value * 4)

      if (weight < distances.value[neighborId]) {
        distances.value[neighborId] = weight
        predecessors.value[neighborId] = current
        explanation.value.push(`Updated minimum edge weight for ${nodes.value[neighborId]?.label} to ${weight}.`)
      }
      currentEdge.value = null
    }

    currentNode.value = null
  }

  isTraversing.value = false
  explanation.value.push("Prim's Algorithm completed! Minimum Spanning Tree found.")
}

// ============================================
// Step Generation
// ============================================

export function generatePrimsSteps(start?: number): Step[] {
  const startNode = start ?? selectedStartNode.value
  if (startNode === null || nodes.value.length === 0) return []

  const adjList = buildAdjacencyList()
  const stepList: Step[] = []

  const localDistances: Record<number, number> = {}
  const localPredecessors: Record<number, number | null> = {}
  const localVisited: number[] = []
  const localMSTEdges: { from: number; to: number }[] = []
  const unvisitedSet = new Set(nodes.value.map((n) => n.id))

  nodes.value.forEach((node) => {
    localDistances[node.id] = Infinity
    localPredecessors[node.id] = null
  })
  localDistances[startNode] = 0

  stepList.push(
    snapshot({
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      description: 'Initialize: start node weight = 0, others = ∞',
    }),
  )

  while (unvisitedSet.size > 0) {
    let current: number | null = null
    let minDistance = Infinity

    unvisitedSet.forEach((nodeId) => {
      if (localDistances[nodeId] < minDistance) {
        minDistance = localDistances[nodeId]
        current = nodeId
      }
    })

    if (current === null || minDistance === Infinity) break

    stepList.push(
      snapshot({
        currentNode: current,
        distances: { ...localDistances },
        predecessors: { ...localPredecessors },
        visitedNodes: [...localVisited],
        shortestPathEdges: [...localMSTEdges],
        description: `Pick node ${nodes.value[current]?.label} with smallest edge weight (${minDistance === 0 ? '0' : minDistance})`,
      }),
    )

    unvisitedSet.delete(current)
    localVisited.push(current)

    if (localPredecessors[current] !== null) {
      localMSTEdges.push({ from: localPredecessors[current]!, to: current })
      stepList.push(
        snapshot({
          currentNode: current,
          distances: { ...localDistances },
          predecessors: { ...localPredecessors },
          visitedNodes: [...localVisited],
          shortestPathEdges: [...localMSTEdges],
          description: `Added edge ${nodes.value[localPredecessors[current]!]?.label} - ${nodes.value[current]?.label} to MST`,
        }),
      )
    }

    for (const neighborId of adjList[current]) {
      if (!unvisitedSet.has(neighborId)) continue

      const edge = edges.value.find(
        (e) =>
          (e.from === current && e.to === neighborId) ||
          (e.from === neighborId && e.to === current),
      )
      const weight = edge?.weight || 1

      stepList.push(
        snapshot({
          currentNode: current,
          currentEdge: { from: current, to: neighborId },
          distances: { ...localDistances },
          predecessors: { ...localPredecessors },
          visitedNodes: [...localVisited],
          shortestPathEdges: [...localMSTEdges],
          description: `Checking neighbor ${nodes.value[neighborId]?.label}`,
        }),
      )

      if (weight < localDistances[neighborId]) {
        localDistances[neighborId] = weight
        localPredecessors[neighborId] = current
        stepList.push(
          snapshot({
            currentNode: current,
            currentEdge: { from: current, to: neighborId },
            distances: { ...localDistances },
            predecessors: { ...localPredecessors },
            visitedNodes: [...localVisited],
            shortestPathEdges: [...localMSTEdges],
            description: `Updated weight for ${nodes.value[neighborId]?.label} to ${weight}`,
          }),
        )
      }
    }
    stepList.push(
      snapshot({
        currentNode: null,
        currentEdge: null,
        distances: { ...localDistances },
        predecessors: { ...localPredecessors },
        visitedNodes: [...localVisited],
        shortestPathEdges: [...localMSTEdges],
        description: `Finished processing neighbors of ${nodes.value[current]?.label}`,
      }),
    )
  }

  stepList.push(
    snapshot({
      currentNode: null,
      currentEdge: null,
      visitedNodes: [...localVisited],
      shortestPathEdges: [...localMSTEdges],
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      description: "Prim's Algorithm completed. MST found.",
    }),
  )

  return stepList
}

// ============================================
// Prepare Steps
// ============================================

export function preparePrimsSteps(start?: number, autoPlay = false): void {
  stopPlaying()
  explanation.value = [...algoInfo.value]
  explanation.value.push("Prepared Prim's steps.")
  steps.value = generatePrimsSteps(start)
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

// ============================================
// Initialize
// ============================================

export function initPrims(): void {
  currentGraphAlgo.value = 'prims'
  setAlgorithmInfo(primsInfo)
  visualizationType.value = 'graph'
  generateData()
}

export default {
  key: 'prims',
  info: primsInfo,
  run: runPrims,
  generateSteps: generatePrimsSteps,
  prepareSteps: preparePrimsSteps,
  init: initPrims,
}
