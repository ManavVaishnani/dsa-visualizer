import { ref } from 'vue'

export interface TreeNode {
  id: number
  x: number
  y: number
  label: string
  value: number
  left: number | null
  right: number | null
  parent: number | null
}

export interface TreeEdge {
  from: number
  to: number
}

export type TreeTraversalType = 'inorder' | 'preorder' | 'postorder'

// Reactive state
export const treeNodes = ref<TreeNode[]>([])
export const treeEdges = ref<TreeEdge[]>([])
export const visitedTreeNodes = ref<number[]>([])
export const currentTreeNode = ref<number | null>(null)
export const currentTreeEdge = ref<{ from: number; to: number } | null>(null)
export const traversalResult = ref<number[]>([])
export const callStack = ref<number[]>([])

export const treeSpeed = ref(50)
export const isTreeTraversing = ref(false)
export const isTreePaused = ref(false)
export const treeExplanation = ref<string[]>([])

export type TreeAlgo = 'inorder' | 'preorder' | 'postorder'
export const currentTreeAlgo = ref<TreeAlgo | null>(null)

export const setTreeInitialInfo = (algo: TreeAlgo) => {
  currentTreeAlgo.value = algo
  const info: Record<TreeAlgo, string[]> = {
    inorder: [
      'ALGO: In-Order Traversal',
      'ORDER: Left → Node → Right (L-N-R)',
      'USE: Prints BST nodes in sorted ascending order.',
      'WHERE: BST validation, sorted data retrieval.',
    ],
    preorder: [
      'ALGO: Pre-Order Traversal',
      'ORDER: Node → Left → Right (N-L-R)',
      'USE: Creates a copy of the tree, prefix expressions.',
      'WHERE: Tree cloning, serialization, expression trees.',
    ],
    postorder: [
      'ALGO: Post-Order Traversal',
      'ORDER: Left → Right → Node (L-R-N)',
      'USE: Deletes tree from leaf to root, postfix expressions.',
      'WHERE: Memory cleanup, expression evaluation, children-first operations.',
    ],
  }
  treeExplanation.value = info[algo]
}

export const treeVisitedCount = ref(0)
export const treeEdgeExploredCount = ref(0)

export interface TreeStep {
  visitedNodes: number[]
  currentNode: number | null
  currentEdge: { from: number; to: number } | null
  callStack: number[]
  traversalResult: number[]
  visitedCount: number
  edgeExploredCount: number
  description?: string
}

export const treeSteps = ref<TreeStep[]>([])
export const treeStepIndex = ref(-1)
export const isTreePlaying = ref(false)
let playTimer: ReturnType<typeof setInterval> | null = null

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Generate a Binary Search Tree
export const generateBinaryTree = () => {
  if (isTreeTraversing.value) return

  const nodeCount = Math.floor(Math.random() * 5) + 7 // 7-11 nodes
  const values = Array.from({ length: nodeCount }, () => Math.floor(Math.random() * 99) + 1)

  // Remove duplicates
  const uniqueValues = [...new Set(values)]

  const width = 800
  const height = 600
  const marginX = 60
  const marginYTop = 80
  const marginYBottom = 60

  const newNodes: TreeNode[] = []
  const newEdges: TreeEdge[] = []
  let nodeId = 0

  const insertNode = (
    value: number,
    parentId: number | null,
    isLeft: boolean,
    level: number,
    xMin: number,
    xMax: number,
  ) => {
    const availableHeight = height - marginYTop - marginYBottom
    const levelHeight = availableHeight / 5 // Max 5 levels

    const id = nodeId++
    const x = (xMin + xMax) / 2
    const y = marginYTop + level * levelHeight

    const node: TreeNode = {
      id,
      x,
      y,
      label: String(value),
      value,
      left: null,
      right: null,
      parent: parentId,
    }
    newNodes.push(node)

    if (parentId !== null) {
      newEdges.push({ from: parentId, to: id })
      if (isLeft) {
        newNodes[parentId].left = id
      } else {
        newNodes[parentId].right = id
      }
    }

    return { id, xMin, xMax }
  }

  // Insert root
  const rootValue = uniqueValues[0]
  insertNode(rootValue, null, false, 0, marginX, width - marginX)

  // Insert remaining values into BST
  for (let i = 1; i < uniqueValues.length && newNodes.length < 15; i++) {
    const value = uniqueValues[i]
    let current = 0
    let level = 0
    let xMin = marginX
    let xMax = width - marginX

    while (true) {
      const currentNode = newNodes[current]
      const mid = (xMin + xMax) / 2

      if (value < currentNode.value) {
        xMax = mid
        if (currentNode.left === null) {
          insertNode(value, current, true, level + 1, xMin, xMax)
          break
        }
        current = currentNode.left
      } else {
        xMin = mid
        if (currentNode.right === null) {
          insertNode(value, current, false, level + 1, xMin, xMax)
          break
        }
        current = currentNode.right
      }
      level++

      // Prevent infinite loops and too deep trees
      if (level > 4) break
    }
  }

  treeNodes.value = newNodes
  treeEdges.value = newEdges

  // Reset traversal state
  resetTreeState()
}

const resetTreeState = () => {
  visitedTreeNodes.value = []
  currentTreeNode.value = null
  currentTreeEdge.value = null
  traversalResult.value = []
  callStack.value = []
  treeVisitedCount.value = 0
  treeEdgeExploredCount.value = 0
}

const applyTreeStep = (index: number) => {
  const s = treeSteps.value[index]
  if (!s) return

  visitedTreeNodes.value = [...s.visitedNodes]
  currentTreeNode.value = s.currentNode
  currentTreeEdge.value = s.currentEdge ? { ...s.currentEdge } : null
  callStack.value = [...s.callStack]
  traversalResult.value = [...s.traversalResult]
  treeVisitedCount.value = s.visitedCount
  treeEdgeExploredCount.value = s.edgeExploredCount
  if (s.description) {
    treeExplanation.value.push(s.description)
  }
  treeStepIndex.value = index
}

export const nextTreeStep = () => {
  if (treeStepIndex.value < treeSteps.value.length - 1) {
    applyTreeStep(treeStepIndex.value + 1)
  }
}

export const previousTreeStep = () => {
  if (treeStepIndex.value > 0) {
    applyTreeStep(treeStepIndex.value - 1)
  }
}

export const gotoTreeStep = (index: number) => {
  if (index >= 0 && index < treeSteps.value.length) applyTreeStep(index)
}

export const playTreeSteps = () => {
  if (isTreePlaying.value || treeSteps.value.length === 0) return
  isTreePlaying.value = true
  const delay = Math.max(50, 1000 - treeSpeed.value * 9)
  playTimer = setInterval(() => {
    if (treeStepIndex.value < treeSteps.value.length - 1) nextTreeStep()
    else stopTreePlaying()
  }, delay)
}

export const stopTreePlaying = () => {
  if (playTimer) clearInterval(playTimer)
  playTimer = null
  isTreePlaying.value = false
}

export const resetTreeSteps = () => {
  stopTreePlaying()
  treeSteps.value = []
  treeStepIndex.value = -1
  if (currentTreeAlgo.value) {
    setTreeInitialInfo(currentTreeAlgo.value)
  } else {
    treeExplanation.value = []
  }
  resetTree()
}

// In-Order Traversal: Left -> Node -> Right
export const runInOrderTraversal = async () => {
  if (isTreeTraversing.value || treeNodes.value.length === 0) return

  isTreeTraversing.value = true
  isTreePaused.value = false
  resetTreeState()
  treeExplanation.value = ['Starting In-Order Traversal (Left → Node → Right)...']

  const inOrder = async (nodeId: number | null) => {
    if (nodeId === null) return

    while (isTreePaused.value) await sleep(100)

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
    while (isTreePaused.value) await sleep(100)
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

  currentTreeNode.value = null
  currentTreeEdge.value = null
  callStack.value = []
  isTreeTraversing.value = false
  treeExplanation.value.push(
    `In-Order Traversal Complete! Result: [${traversalResult.value.join(', ')}]`,
  )
}

// Pre-Order Traversal: Node -> Left -> Right
export const runPreOrderTraversal = async () => {
  if (isTreeTraversing.value || treeNodes.value.length === 0) return

  isTreeTraversing.value = true
  isTreePaused.value = false
  resetTreeState()
  treeExplanation.value = ['Starting Pre-Order Traversal (Node → Left → Right)...']

  const preOrder = async (nodeId: number | null) => {
    if (nodeId === null) return

    while (isTreePaused.value) await sleep(100)

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
    while (isTreePaused.value) await sleep(100)
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

  currentTreeNode.value = null
  currentTreeEdge.value = null
  callStack.value = []
  isTreeTraversing.value = false
  treeExplanation.value.push(
    `Pre-Order Traversal Complete! Result: [${traversalResult.value.join(', ')}]`,
  )
}

// Post-Order Traversal: Left -> Right -> Node
export const runPostOrderTraversal = async () => {
  if (isTreeTraversing.value || treeNodes.value.length === 0) return

  isTreeTraversing.value = true
  isTreePaused.value = false
  resetTreeState()
  treeExplanation.value = ['Starting Post-Order Traversal (Left → Right → Node)...']

  const postOrder = async (nodeId: number | null) => {
    if (nodeId === null) return

    while (isTreePaused.value) await sleep(100)

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
    while (isTreePaused.value) await sleep(100)
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
    while (isTreePaused.value) await sleep(100)
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

  currentTreeNode.value = null
  currentTreeEdge.value = null
  callStack.value = []
  isTreeTraversing.value = false
  treeExplanation.value.push(
    `Post-Order Traversal Complete! Result: [${traversalResult.value.join(', ')}]`,
  )
}

// Generate steps for step-by-step mode
export const generateInOrderSteps = (): TreeStep[] => {
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

export const generatePreOrderSteps = (): TreeStep[] => {
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

export const generatePostOrderSteps = (): TreeStep[] => {
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

export const prepareInOrderSteps = (autoPlay = false) => {
  stopTreePlaying()
  treeSteps.value = generateInOrderSteps()
  treeStepIndex.value = -1
  if (autoPlay) playTreeSteps()
}

export const preparePreOrderSteps = (autoPlay = false) => {
  stopTreePlaying()
  treeSteps.value = generatePreOrderSteps()
  treeStepIndex.value = -1
  if (autoPlay) playTreeSteps()
}

export const preparePostOrderSteps = (autoPlay = false) => {
  stopTreePlaying()
  treeSteps.value = generatePostOrderSteps()
  treeStepIndex.value = -1
  if (autoPlay) playTreeSteps()
}

export const resetTree = () => {
  if (isTreeTraversing.value) return

  visitedTreeNodes.value = []
  currentTreeNode.value = null
  currentTreeEdge.value = null
  traversalResult.value = []
  callStack.value = []
  treeVisitedCount.value = 0
  treeEdgeExploredCount.value = 0
}

export const pauseTreeTraversal = () => {
  isTreePaused.value = !isTreePaused.value
}
