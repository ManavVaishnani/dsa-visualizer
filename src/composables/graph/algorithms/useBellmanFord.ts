/**
 * Bellman-Ford Algorithm (Single Responsibility Principle)
 *
 * This module ONLY contains the Bellman-Ford algorithm implementation.
 */

import { ref } from 'vue'
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
  selectedTargetNode,
  targetFound,
  visitedCount,
  edgeExploredCount,
  graphType,
  shortestPathEdges,
  distances,
  predecessors,
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

export const bellmanFordInfo: AlgorithmInfo = {
  name: 'Bellman-Ford Algorithm',
  timeComplexity: 'O(V × E)',
  spaceComplexity: 'O(V)',
  description: 'Finds shortest paths from a source node to all other nodes, even with negative edge weights. Can detect negative cycles.',
}

// ============================================
// Negative Cycle Detection State
// ============================================

export const negativeCycleDetected = ref(false)

// ============================================
// Algorithm Implementation
// ============================================

export async function runBellmanFord(start?: number): Promise<void> {
  visitedCount.value = 0
  edgeExploredCount.value = 0

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
  negativeCycleDetected.value = false

  // Initialize distances
  nodes.value.forEach((node) => {
    distances.value[node.id] = Infinity
    predecessors.value[node.id] = null
  })
  distances.value[startNode] = 0

  explanation.value = [...algoInfo.value]
  explanation.value.push('Starting Bellman-Ford Algorithm...')
  explanation.value.push(`Initialized all distances to ∞, source node ${nodes.value[startNode]?.label} distance = 0`)

  const nodeCount = nodes.value.length

  // Relax all edges V-1 times
  for (let i = 0; i < nodeCount - 1; i++) {
    while (isPaused.value) await sleep(100)

    explanation.value.push(`--- Iteration ${i + 1} of ${nodeCount - 1} ---`)
    let updated = false

    for (const edge of edges.value) {
      while (isPaused.value) await sleep(100)

      // For undirected graphs, consider both directions
      const directions = graphType.value === 'undirected'
        ? [{ from: edge.from, to: edge.to }, { from: edge.to, to: edge.from }]
        : [{ from: edge.from, to: edge.to }]

      for (const dir of directions) {
        const { from, to } = dir
        const weight = edge.weight || 1

        if (distances.value[from] === Infinity) continue

        currentEdge.value = { from, to }
        edgeExploredCount.value++
        await sleep(Math.max(50, 300 - speed.value * 2))

        const newDist = distances.value[from] + weight

        if (newDist < distances.value[to]) {
          distances.value[to] = newDist
          predecessors.value[to] = from
          updated = true
          explanation.value.push(
            `Relaxed edge ${nodes.value[from]?.label} → ${nodes.value[to]?.label}: distance updated to ${newDist}`
          )

          // Mark node as visited when its distance is updated
          if (!visitedNodes.value.includes(to)) {
            visitedNodes.value.push(to)
            visitedCount.value++
          }
        }

        currentEdge.value = null
      }
    }

    // Mark start node as visited
    if (!visitedNodes.value.includes(startNode)) {
      visitedNodes.value.push(startNode)
      visitedCount.value++
    }

    if (!updated) {
      explanation.value.push('No updates in this iteration. Algorithm can terminate early.')
      break
    }
  }

  // Check for negative cycles (V-th iteration)
  explanation.value.push('--- Checking for negative cycles ---')
  for (const edge of edges.value) {
    while (isPaused.value) await sleep(100)

    const directions = graphType.value === 'undirected'
      ? [{ from: edge.from, to: edge.to }, { from: edge.to, to: edge.from }]
      : [{ from: edge.from, to: edge.to }]

    for (const dir of directions) {
      const { from, to } = dir
      const weight = edge.weight || 1

      if (distances.value[from] === Infinity) continue

      currentEdge.value = { from, to }
      await sleep(Math.max(50, 200 - speed.value * 2))

      if (distances.value[from] + weight < distances.value[to]) {
        negativeCycleDetected.value = true
        explanation.value.push(`⚠️ NEGATIVE CYCLE DETECTED! Edge ${nodes.value[from]?.label} → ${nodes.value[to]?.label} can still be relaxed.`)
        currentEdge.value = null
        break
      }

      currentEdge.value = null
    }

    if (negativeCycleDetected.value) break
  }

  // Reconstruct shortest path if target is selected and no negative cycle
  if (!negativeCycleDetected.value && selectedTargetNode.value !== null && distances.value[selectedTargetNode.value] !== Infinity) {
    let curr = selectedTargetNode.value
    while (predecessors.value[curr] !== null) {
      const prev = predecessors.value[curr]!
      shortestPathEdges.value.push({ from: prev, to: curr })
      curr = prev
    }
    targetFound.value = true
    explanation.value.push('Shortest path highlighted!')
  }

  isTraversing.value = false
  if (negativeCycleDetected.value) {
    explanation.value.push('Bellman-Ford Algorithm completed. Negative cycle detected - shortest paths may not be valid!')
  } else {
    explanation.value.push('Bellman-Ford Algorithm completed! Shortest paths found.')
  }
}

// ============================================
// Step Generation
// ============================================

export function generateBellmanFordSteps(start?: number): Step[] {
  const startNode = start ?? selectedStartNode.value
  if (startNode === null || nodes.value.length === 0) return []

  const stepList: Step[] = []
  const localDistances: Record<number, number> = {}
  const localPredecessors: Record<number, number | null> = {}
  const localVisited: number[] = []

  // Initialize distances
  nodes.value.forEach((node) => {
    localDistances[node.id] = Infinity
    localPredecessors[node.id] = null
  })
  localDistances[startNode] = 0

  stepList.push(
    snapshot({
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      description: 'Initialize: source = 0, others = ∞',
    })
  )

  const nodeCount = nodes.value.length
  let hasNegativeCycle = false

  // Relax all edges V-1 times
  for (let i = 0; i < nodeCount - 1; i++) {
    stepList.push(
      snapshot({
        distances: { ...localDistances },
        predecessors: { ...localPredecessors },
        visitedNodes: [...localVisited],
        description: `Iteration ${i + 1} of ${nodeCount - 1}`,
      })
    )

    for (const edge of edges.value) {
      const directions = graphType.value === 'undirected'
        ? [{ from: edge.from, to: edge.to }, { from: edge.to, to: edge.from }]
        : [{ from: edge.from, to: edge.to }]

      for (const dir of directions) {
        const { from, to } = dir
        const weight = edge.weight || 1

        if (localDistances[from] === Infinity) continue

        stepList.push(
          snapshot({
            currentEdge: { from, to },
            distances: { ...localDistances },
            predecessors: { ...localPredecessors },
            visitedNodes: [...localVisited],
            description: `Checking edge ${nodes.value[from]?.label} → ${nodes.value[to]?.label} (weight: ${weight})`,
          })
        )

        const newDist = localDistances[from] + weight

        if (newDist < localDistances[to]) {
          localDistances[to] = newDist
          localPredecessors[to] = from

          if (!localVisited.includes(to)) {
            localVisited.push(to)
          }

          stepList.push(
            snapshot({
              currentEdge: { from, to },
              distances: { ...localDistances },
              predecessors: { ...localPredecessors },
              visitedNodes: [...localVisited],
              description: `Relaxed: ${nodes.value[to]?.label} distance updated to ${newDist}`,
            })
          )
        }
      }
    }

    if (!localVisited.includes(startNode)) {
      localVisited.push(startNode)
    }
  }

  // Check for negative cycles
  stepList.push(
    snapshot({
      currentEdge: null,
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      visitedNodes: [...localVisited],
      description: 'Checking for negative cycles...',
    })
  )

  for (const edge of edges.value) {
    const directions = graphType.value === 'undirected'
      ? [{ from: edge.from, to: edge.to }, { from: edge.to, to: edge.from }]
      : [{ from: edge.from, to: edge.to }]

    for (const dir of directions) {
      const { from, to } = dir
      const weight = edge.weight || 1

      if (localDistances[from] === Infinity) continue

      if (localDistances[from] + weight < localDistances[to]) {
        hasNegativeCycle = true
        stepList.push(
          snapshot({
            currentEdge: { from, to },
            distances: { ...localDistances },
            predecessors: { ...localPredecessors },
            visitedNodes: [...localVisited],
            description: `⚠️ NEGATIVE CYCLE: Edge ${nodes.value[from]?.label} → ${nodes.value[to]?.label} can still be relaxed!`,
          })
        )
        break
      }
    }

    if (hasNegativeCycle) break
  }

  // Final step with shortest path
  const finalShortestPath: { from: number; to: number }[] = []
  if (!hasNegativeCycle && selectedTargetNode.value !== null && localVisited.includes(selectedTargetNode.value)) {
    let curr = selectedTargetNode.value
    while (localPredecessors[curr] !== null) {
      const prev = localPredecessors[curr]!
      finalShortestPath.push({ from: prev, to: curr })
      curr = prev
    }
  }

  stepList.push(
    snapshot({
      currentNode: null,
      currentEdge: null,
      visitedNodes: [...localVisited],
      shortestPathEdges: finalShortestPath,
      distances: { ...localDistances },
      predecessors: { ...localPredecessors },
      targetFound: !hasNegativeCycle && selectedTargetNode.value !== null && localVisited.includes(selectedTargetNode.value),
      description: hasNegativeCycle
        ? 'Bellman-Ford completed. Negative cycle detected!'
        : 'Bellman-Ford completed. Shortest paths found.',
    })
  )

  return stepList
}

// ============================================
// Prepare Steps
// ============================================

export function prepareBellmanFordSteps(start?: number, autoPlay = false): void {
  stopPlaying()
  negativeCycleDetected.value = false
  explanation.value = [...algoInfo.value]
  explanation.value.push('Prepared Bellman-Ford steps.')
  steps.value = generateBellmanFordSteps(start)
  stepIndex.value = -1
  if (autoPlay) playSteps()
}

// ============================================
// Initialize
// ============================================

export function initBellmanFord(): void {
  currentGraphAlgo.value = 'bellmanford'
  setAlgorithmInfo(bellmanFordInfo)
  visualizationType.value = 'graph'
  generateData()
}

export default {
  key: 'bellmanford',
  info: bellmanFordInfo,
  run: runBellmanFord,
  generateSteps: generateBellmanFordSteps,
  prepareSteps: prepareBellmanFordSteps,
  init: initBellmanFord,
}
