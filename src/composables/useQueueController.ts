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
    'Queue Initialized',
    'Ready for operations (Enqueue, Dequeue, Peek)',
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
  explanation.value = ['Queue cleared.']
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
    `Size: ${count} elements.`,
    `Front: ${randomValues[0]}`,
    `Rear: ${randomValues[randomValues.length - 1]}`,
  ]
}

// Enqueue operation
export async function enqueue(value: number): Promise<void> {
  if (isAnimating.value) return

  // Check for overflow
  if (queue.value.length >= maxSize.value) {
    explanation.value.push(`Operation: Enqueue(${value})`)
    explanation.value.push('⚠️ Queue Overflow! Cannot enqueue.')
    return
  }

  isAnimating.value = true
  animationType.value = 'enqueue'

  explanation.value.push(`Operation: Enqueue(${value})`)
  explanation.value.push(`Checking capacity... (${queue.value.length}/${maxSize.value})`)

  await sleep(200)
  await waitWhilePaused()

  // Add element to queue
  queue.value.push(value)
  if (frontIndex.value === -1) frontIndex.value = 0
  rearIndex.value = queue.value.length - 1
  animatingIndex.value = rearIndex.value

  explanation.value.push('Capacity OK. Adding to rear...')

  await sleep(300)
  await waitWhilePaused()

  // Complete animation
  animatingIndex.value = -1
  animationType.value = null
  isAnimating.value = false

  explanation.value.push(`✓ Enqueued ${value}. New size: ${queue.value.length}`)
}

// Dequeue operation
export async function dequeue(): Promise<number | undefined> {
  if (isAnimating.value) return undefined

  // Check for underflow
  if (queue.value.length === 0) {
    explanation.value.push('Operation: Dequeue()')
    explanation.value.push('⚠️ Queue Underflow! Cannot dequeue.')
    return undefined
  }

  isAnimating.value = true
  animationType.value = 'dequeue'
  animatingIndex.value = 0 // Front is always at index 0 in array visualization

  const dequeuedValue = queue.value[0]

  explanation.value.push('Operation: Dequeue()')
  explanation.value.push(`Front element is ${dequeuedValue}. Removing...`)

  await sleep(300)
  await waitWhilePaused()

  explanation.value.push('Shifting remaining elements...')

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

  explanation.value.push(`✓ Dequeued ${dequeuedValue}. New size: ${queue.value.length}`)

  return dequeuedValue
}

// Peek operation
export async function peek(): Promise<number | undefined> {
  if (isAnimating.value) return undefined

  // Check for empty queue
  if (queue.value.length === 0) {
    explanation.value.push('Operation: Peek()')
    explanation.value.push('⚠️ Queue is empty!')
    return undefined
  }

  isAnimating.value = true
  animationType.value = 'peek'
  highlightedIndex.value = 0 // Front is always 0

  const frontValue = queue.value[0]

  explanation.value.push('Operation: Peek()')
  explanation.value.push(`Peeking front element: ${frontValue}`)

  await sleep(500)
  await waitWhilePaused()

  highlightedIndex.value = -1
  animationType.value = null
  isAnimating.value = false

  explanation.value.push(`✓ Front element is ${frontValue}`)

  return frontValue
}
