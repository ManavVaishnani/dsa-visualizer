import { ref } from 'vue'

// Queue state
export const queue = ref<number[]>([])
export const frontIndex = ref<number>(-1)
export const rearIndex = ref<number>(-1)
export const highlightedIndex = ref<number>(-1)
export const animatingIndex = ref<number>(-1)
export const animationType = ref<'enqueue' | 'dequeue' | 'peek' | null>(null)

// Control state
export const maxSize = ref(10)
export const speed = ref(50)
export const isAnimating = ref(false)
export const isPaused = ref(false)
export const explanation = ref<string[]>([])

// Queue info for display
export const currentQueueAlgo = ref<{
  name: string
  timeComplexity: string
  spaceComplexity: string
  description: string
} | null>(null)

export function setInitialInfo(): void {
  currentQueueAlgo.value = {
    name: 'Queue',
    timeComplexity: 'O(1) for enqueue, dequeue, peek',
    spaceComplexity: 'O(n)',
    description:
      'A Queue is a linear data structure following FIFO (First In First Out) principle. Elements are added at the rear and removed from the front.',
  }
  explanation.value = [
    'Queue Operations:',
    '• Enqueue: Add element to rear',
    '• Dequeue: Remove element from front',
    '• Peek: View front element',
    '',
    'Use the controls above to interact with the queue.',
  ]
}

// Helper function for delays
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 101 - speed.value + ms))

// Wait while paused
async function waitWhilePaused(): Promise<void> {
  while (isPaused.value && isAnimating.value) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

// Clear all states
export function clearQueue(): void {
  queue.value = []
  frontIndex.value = -1
  rearIndex.value = -1
  highlightedIndex.value = -1
  animatingIndex.value = -1
  animationType.value = null
  isAnimating.value = false
  isPaused.value = false
  explanation.value = ['Queue cleared.', '', 'The queue is now empty.']
}

// Generate a random queue
export function generateRandomQueue(): void {
  clearQueue()
  const count = Math.floor(Math.random() * (maxSize.value - 2)) + 2 // 2 to maxSize-1 elements
  const randomValues: number[] = []

  for (let i = 0; i < count; i++) {
    randomValues.push(Math.floor(Math.random() * 99) + 1)
  }

  queue.value = randomValues
  frontIndex.value = 0
  rearIndex.value = randomValues.length - 1
  explanation.value = [
    'Generated random queue.',
    '',
    `Queue contains ${count} elements.`,
    `Front element: ${randomValues[0]}`,
    `Rear element: ${randomValues[randomValues.length - 1]}`,
  ]
}

// Enqueue operation
export async function enqueue(value: number): Promise<void> {
  if (isAnimating.value) return

  // Check for overflow
  if (queue.value.length >= maxSize.value) {
    explanation.value = [
      '⚠️ Queue Overflow!',
      '',
      `Cannot enqueue ${value}.`,
      `Queue has reached maximum size of ${maxSize.value}.`,
    ]
    return
  }

  isAnimating.value = true
  animationType.value = 'enqueue'

  explanation.value = [
    `Enqueueing ${value}...`,
    '',
    'Step 1: Check if queue is full',
    `Current size: ${queue.value.length}/${maxSize.value}`,
  ]

  await sleep(200)
  await waitWhilePaused()

  // Add element to queue
  queue.value.push(value)
  if (frontIndex.value === -1) frontIndex.value = 0
  rearIndex.value = queue.value.length - 1
  animatingIndex.value = rearIndex.value

  explanation.value = [
    `Enqueueing ${value}...`,
    '',
    'Step 2: Add element to rear',
    `New rear index: ${rearIndex.value}`,
  ]

  await sleep(300)
  await waitWhilePaused()

  // Complete animation
  animatingIndex.value = -1
  animationType.value = null
  isAnimating.value = false

  explanation.value = [
    `✓ Enqueued ${value} successfully!`,
    '',
    `Queue size: ${queue.value.length}/${maxSize.value}`,
    '',
    'Time complexity: O(1)',
  ]
}

// Dequeue operation
export async function dequeue(): Promise<number | undefined> {
  if (isAnimating.value) return undefined

  // Check for underflow
  if (queue.value.length === 0) {
    explanation.value = [
      '⚠️ Queue Underflow!',
      '',
      'Cannot dequeue from empty queue.',
      'Add elements using Enqueue first.',
    ]
    return undefined
  }

  isAnimating.value = true
  animationType.value = 'dequeue'
  animatingIndex.value = 0 // Front is always at index 0 in array visualization

  const dequeuedValue = queue.value[0]

  explanation.value = [
    `Dequeueing ${dequeuedValue}...`,
    '',
    'Step 1: Get front element',
    `Front element: ${dequeuedValue}`,
  ]

  await sleep(300)
  await waitWhilePaused()

  explanation.value = [
    `Dequeueing ${dequeuedValue}...`,
    '',
    'Step 2: Remove front element',
    'Shifting remaining elements...',
  ]

  // Animate removal
  await sleep(200)
  await waitWhilePaused()

  // Remove element
  queue.value.shift()

  if (queue.value.length === 0) {
    frontIndex.value = -1
    rearIndex.value = -1
  } else {
    rearIndex.value = queue.value.length - 1
  }

  animatingIndex.value = -1
  animationType.value = null
  isAnimating.value = false

  explanation.value = [
    `✓ Dequeued ${dequeuedValue} successfully!`,
    '',
    `New front: ${queue.value.length > 0 ? queue.value[0] : 'None'}`,
    `Queue size: ${queue.value.length}/${maxSize.value}`,
    '',
    'Time complexity: O(1)',
  ]

  return dequeuedValue
}

// Peek operation
export async function peek(): Promise<number | undefined> {
  if (isAnimating.value) return undefined

  // Check for empty queue
  if (queue.value.length === 0) {
    explanation.value = [
      '⚠️ Queue is empty!',
      '',
      'Cannot peek at empty queue.',
      'Add elements using Enqueue first.',
    ]
    return undefined
  }

  isAnimating.value = true
  animationType.value = 'peek'
  highlightedIndex.value = 0 // Front is always 0

  const frontValue = queue.value[0]

  explanation.value = [
    `Peeking at front element...`,
    '',
    'Accessing front without removing.',
    `Front element: ${frontValue}`,
  ]

  await sleep(500)
  await waitWhilePaused()

  highlightedIndex.value = -1
  animationType.value = null
  isAnimating.value = false

  explanation.value = [
    `✓ Peek: ${frontValue}`,
    '',
    `Front element is ${frontValue}`,
    'Element remains in queue.',
    '',
    'Time complexity: O(1)',
  ]

  return frontValue
}
