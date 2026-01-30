/**
 * Graph State Management (Single Responsibility Principle)
 *
 * This module ONLY handles state management for graph visualizations.
 * It doesn't contain any algorithm logic - that's handled by individual algorithm files.
 */

import { ref } from 'vue'
import type { AlgorithmInfo } from '@/types/algorithm'

// ============================================
// Type Definitions
// ============================================

export interface Node {
  id: number
  x: number
  y: number
  label: string
}

export interface Edge {
  from: number
  to: number
  weight?: number
}

export type GraphType = 'directed' | 'undirected'
export type VisualizationType = 'graph' | 'tree'
export type GraphAlgo = 'bfs' | 'dfs' | 'dijkstra' | 'astar' | 'prims' | 'kruskals' | 'bellmanford'

export interface Step {
  visitedNodes: number[]
  currentNode: number | null
  queue: number[]
  currentEdge: { from: number; to: number } | null
  dfsCallStack: number[]
  visitedCount: number
  edgeExploredCount: number
  targetFound: boolean
  distances?: Record<number, number>
  predecessors?: Record<number, number | null>
  shortestPathEdges?: { from: number; to: number }[]
  mstEdges?: { from: number; to: number; weight: number }[]
  description?: string
}

// ============================================
// Reactive State
// ============================================

export const nodes = ref<Node[]>([])
export const edges = ref<Edge[]>([])
export const visitedNodes = ref<number[]>([])
export const currentNode = ref<number | null>(null)
export const queue = ref<number[]>([])
export const currentEdge = ref<{ from: number; to: number } | null>(null)

export const speed = ref(50)
export const isTraversing = ref(false)
export const isPaused = ref(false)
export const explanation = ref<string[]>([])
export const shortestPathEdges = ref<{ from: number; to: number }[]>([])

export const currentGraphAlgo = ref<GraphAlgo | null>(null)
export const algoInfo = ref<string[]>([])
export const currentAlgorithmInfo = ref<AlgorithmInfo | null>(null)

export const distances = ref<Record<number, number>>({})
export const predecessors = ref<Record<number, number | null>>({})

export const selectedStartNode = ref<number | null>(null)
export const selectedTargetNode = ref<number | null>(null)
export const targetFound = ref(false)
export const dfsCallStack = ref<number[]>([])
export const visitedCount = ref(0)
export const edgeExploredCount = ref(0)

export const steps = ref<Step[]>([])
export const stepIndex = ref(-1)
export const isPlaying = ref(false)
const playTimer = ref<ReturnType<typeof setInterval> | null>(null)

export const graphType = ref<GraphType>('undirected')
export const visualizationType = ref<VisualizationType>('graph')

// MST-specific state
export const mstEdges = ref<{ from: number; to: number; weight: number }[]>([])

// ============================================
// Utility Functions
// ============================================

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const buildAdjacencyList = (): Record<number, number[]> => {
  const adjList: Record<number, number[]> = {}

  nodes.value.forEach((node) => {
    adjList[node.id] = []
  })

  edges.value.forEach((edge) => {
    adjList[edge.from].push(edge.to)

    if (graphType.value === 'undirected') {
      adjList[edge.to].push(edge.from)
    }
  })

  return adjList
}

export const snapshot = (opts: Partial<Step> = {}): Step => ({
  visitedNodes: [...visitedNodes.value],
  currentNode: currentNode.value,
  queue: [...queue.value],
  currentEdge: currentEdge.value ? { ...currentEdge.value } : null,
  dfsCallStack: [...dfsCallStack.value],
  visitedCount: visitedCount.value,
  edgeExploredCount: edgeExploredCount.value,
  targetFound: targetFound.value,
  distances: { ...distances.value },
  predecessors: { ...predecessors.value },
  shortestPathEdges: [...shortestPathEdges.value],
  ...opts,
})

// ============================================
// State Reset Functions
// ============================================

export const resetGraphState = (): void => {
  visitedNodes.value = []
  currentNode.value = null
  queue.value = []
  currentEdge.value = null
  selectedStartNode.value = null
  selectedTargetNode.value = null
  targetFound.value = false
  dfsCallStack.value = []
  visitedCount.value = 0
  edgeExploredCount.value = 0
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []
  mstEdges.value = []
}

export const resetGraph = (): void => {
  if (isTraversing.value) return

  visitedNodes.value = []
  currentNode.value = null
  queue.value = []
  currentEdge.value = null
  targetFound.value = false
  dfsCallStack.value = []
  visitedCount.value = 0
  edgeExploredCount.value = 0
  distances.value = {}
  predecessors.value = {}
  shortestPathEdges.value = []
  mstEdges.value = []
}

// ============================================
// Step-by-Step Playback
// ============================================

const applyStep = (index: number): void => {
  const s = steps.value[index]
  if (!s) return

  visitedNodes.value = [...s.visitedNodes]
  currentNode.value = s.currentNode
  queue.value = [...s.queue]
  currentEdge.value = s.currentEdge ? { ...s.currentEdge } : null
  dfsCallStack.value = [...s.dfsCallStack]
  visitedCount.value = s.visitedCount
  edgeExploredCount.value = s.edgeExploredCount
  targetFound.value = s.targetFound
  distances.value = s.distances ? { ...s.distances } : {}
  predecessors.value = s.predecessors ? { ...s.predecessors } : {}
  shortestPathEdges.value = s.shortestPathEdges ? [...s.shortestPathEdges] : []

  if (s.description) {
    explanation.value.push(s.description)
  }
  stepIndex.value = index
}

export const nextStep = (): void => {
  if (stepIndex.value < steps.value.length - 1) {
    applyStep(stepIndex.value + 1)
  }
}

export const previousStep = (): void => {
  if (stepIndex.value > 0) {
    applyStep(stepIndex.value - 1)
  }
}

export const gotoStep = (index: number): void => {
  if (index >= 0 && index < steps.value.length) applyStep(index)
}

export const playSteps = (): void => {
  if (isPlaying.value || steps.value.length === 0) return
  isPlaying.value = true
  const delay = Math.max(50, 1000 - speed.value * 9)
  playTimer.value = setInterval(() => {
    if (stepIndex.value < steps.value.length - 1) nextStep()
    else stopPlaying()
  }, delay)
}

export const stopPlaying = (): void => {
  if (playTimer.value) clearInterval(playTimer.value)
  playTimer.value = null
  isPlaying.value = false
}

export const resetSteps = (): void => {
  stopPlaying()
  steps.value = []
  stepIndex.value = -1
  if (currentGraphAlgo.value) {
    explanation.value = [...algoInfo.value]
  } else {
    explanation.value = []
  }
  resetGraph()
}

// ============================================
// Algorithm Info Setting
// ============================================

export const setAlgorithmInfo = (info: AlgorithmInfo): void => {
  currentAlgorithmInfo.value = info
  algoInfo.value = [
    `ALGO: ${info.name}`,
    info.description,
    `TIME: ${info.timeComplexity}`,
    `SPACE: ${info.spaceComplexity}`,
  ]
  explanation.value = [...algoInfo.value]
}

export const appendExplanation = (line: string): void => {
  explanation.value.push(line)
}

// ============================================
// Wait while paused
// ============================================

export async function waitWhilePaused(): Promise<void> {
  while (isPaused.value && isTraversing.value) {
    await sleep(100)
  }
}

// ============================================
// Graph/Tree Generation
// ============================================

export const generateTree = (): void => {
  if (isTraversing.value) return

  const maxDepth = Math.floor(Math.random() * 2) + 3 // Depth 3 or 4
  const width = 800
  const height = 600
  const marginX = 80
  const marginYTop = 120
  const marginYBottom = 120

  // Calculate vertical space ensuring padding at top and bottom
  const availableHeight = height - marginYTop - marginYBottom
  const levelHeight = availableHeight / Math.max(1, maxDepth)

  const newNodes: Node[] = []
  const newEdges: Edge[] = []
  let nodeId = 0

  const createNode = (level: number, xPos: number, labelSuffix: string = '') => {
    const id = nodeId++
    return {
      id,
      x: xPos,
      y: marginYTop + level * levelHeight,
      label: String.fromCharCode(65 + id) + labelSuffix,
    }
  }

  // Root node
  const root = createNode(0, width / 2)
  newNodes.push(root)

  interface TreeNodeInfo {
    node: Node
    level: number
    xRange: [number, number]
  }

  const nodeQueue: TreeNodeInfo[] = [{ node: root, level: 0, xRange: [marginX, width - marginX] }]

  while (nodeQueue.length > 0 && newNodes.length < 15) {
    const { node, level, xRange } = nodeQueue.shift()!
    if (level >= maxDepth) continue

    // Randomly decide children
    const leftExists = node.id === 0 ? true : Math.random() > 0.3
    const rightExists = Math.random() > 0.3

    const mid = (xRange[0] + xRange[1]) / 2

    if (leftExists) {
      const leftChild = createNode(level + 1, (xRange[0] + mid) / 2)
      newNodes.push(leftChild)
      newEdges.push({ from: node.id, to: leftChild.id, weight: Math.floor(Math.random() * 9) + 1 })
      nodeQueue.push({ node: leftChild, level: level + 1, xRange: [xRange[0], mid] })
    }

    if (rightExists) {
      const rightChild = createNode(level + 1, (mid + xRange[1]) / 2)
      newNodes.push(rightChild)
      newEdges.push({ from: node.id, to: rightChild.id, weight: Math.floor(Math.random() * 9) + 1 })
      nodeQueue.push({ node: rightChild, level: level + 1, xRange: [mid, xRange[1]] })
    }
  }

  nodes.value = newNodes
  edges.value = newEdges

  // Reset traversal state
  resetGraphState()
}

export const generateGraph = (): void => {
  if (isTraversing.value) return

  const nodeCount = Math.floor(Math.random() * 4) + 6 // 6–9 nodes
  const width = 800
  const height = 600
  const marginX = 80
  const marginTop = 120
  const marginBottom = 120

  // 1️⃣ Generate random nodes with minimum distance
  const newNodes: Node[] = []
  const minNodeDistance = 100 // Minimum distance between nodes

  for (let i = 0; i < nodeCount; i++) {
    let x, y, tooClose
    let attempts = 0
    do {
      tooClose = false
      x = Math.random() * (width - marginX * 2) + marginX
      y = Math.random() * (height - marginTop - marginBottom) + marginTop

      for (const node of newNodes) {
        const dx = x - node.x
        const dy = y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < minNodeDistance) {
          tooClose = true
          break
        }
      }
      attempts++
    } while (tooClose && attempts < 100)

    newNodes.push({
      id: i,
      x,
      y,
      label: String.fromCharCode(65 + i),
    })
  }
  nodes.value = newNodes

  const newEdges: Edge[] = []

  // Helper to avoid duplicate edges
  const edgeExists = (a: number, b: number) =>
    newEdges.some((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a))

  // 2️⃣ Create a spanning tree (ensures connectivity)
  for (let i = 1; i < nodeCount; i++) {
    const parent = Math.floor(Math.random() * i)
    newEdges.push({ from: parent, to: i, weight: Math.floor(Math.random() * 9) + 1 })
  }

  // 3️⃣ Add extra random edges
  const extraEdges = Math.floor(Math.random() * nodeCount)

  for (let i = 0; i < extraEdges; i++) {
    const from = Math.floor(Math.random() * nodeCount)
    const to = Math.floor(Math.random() * nodeCount)

    if (from !== to && !edgeExists(from, to)) {
      newEdges.push({ from, to, weight: Math.floor(Math.random() * 9) + 1 })
    }
  }

  edges.value = newEdges

  // 4️⃣ Reset traversal state
  resetGraphState()
}

export const generateData = (): void => {
  if (visualizationType.value === 'tree') {
    generateTree()
  } else {
    generateGraph()
  }
}

// ============================================
// Pause Traversal
// ============================================

export const pauseTraversal = (): void => {
  isPaused.value = !isPaused.value
}
