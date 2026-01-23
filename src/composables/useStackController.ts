import { ref } from 'vue'

// Stack state
export const stack = ref<number[]>([])
export const topIndex = ref<number>(-1)
export const highlightedIndex = ref<number>(-1)
export const animatingIndex = ref<number>(-1)
export const animationType = ref<'push' | 'pop' | 'peek' | null>(null)

// Control state
export const maxSize = ref(10)
export const speed = ref(50)
export const isAnimating = ref(false)
export const isPaused = ref(false)
export const explanation = ref<string[]>([])

// Stack info for display
export const currentStackAlgo = ref<{
  name: string
  timeComplexity: string
  spaceComplexity: string
  description: string
} | null>(null)

export function setInitialInfo(): void {
  currentStackAlgo.value = {
    name: 'Stack',
    timeComplexity: 'O(1) for push, pop, peek',
    spaceComplexity: 'O(n)',
    description:
      'A Stack is a linear data structure following LIFO (Last In First Out) principle. Elements are added and removed from the same end called the "top".',
  }
  explanation.value = [
    'Stack Operations:',
    '• Push: Add element to top',
    '• Pop: Remove element from top',
    '• Peek: View top element',
    '',
    'Use the controls above to interact with the stack.',
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
export function clearStack(): void {
  stack.value = []
  topIndex.value = -1
  highlightedIndex.value = -1
  animatingIndex.value = -1
  animationType.value = null
  isAnimating.value = false
  isPaused.value = false
  explanation.value = ['Stack cleared.', '', 'The stack is now empty.']
}

// Generate a random stack with some elements
export function generateRandomStack(): void {
  clearStack()
  const count = Math.floor(Math.random() * (maxSize.value - 2)) + 2 // 2 to maxSize-1 elements
  const randomValues: number[] = []

  for (let i = 0; i < count; i++) {
    randomValues.push(Math.floor(Math.random() * 99) + 1)
  }

  stack.value = randomValues
  topIndex.value = randomValues.length - 1
  explanation.value = [
    'Generated random stack.',
    '',
    `Stack contains ${count} elements.`,
    `Top element: ${randomValues[randomValues.length - 1]}`,
  ]
}

// Push operation
export async function push(value: number): Promise<void> {
  if (isAnimating.value) return

  // Check for overflow
  if (stack.value.length >= maxSize.value) {
    explanation.value = [
      '⚠️ Stack Overflow!',
      '',
      `Cannot push ${value}.`,
      `Stack has reached maximum size of ${maxSize.value}.`,
    ]
    return
  }

  isAnimating.value = true
  animationType.value = 'push'

  explanation.value = [
    `Pushing ${value} onto the stack...`,
    '',
    'Step 1: Check if stack is full',
    `Current size: ${stack.value.length}/${maxSize.value}`,
  ]

  await sleep(200)
  await waitWhilePaused()

  // Add element to stack
  stack.value.push(value)
  topIndex.value = stack.value.length - 1
  animatingIndex.value = topIndex.value

  explanation.value = [
    `Pushing ${value} onto the stack...`,
    '',
    'Step 2: Add element to top',
    `New top index: ${topIndex.value}`,
    `Stack size: ${stack.value.length}`,
  ]

  await sleep(300)
  await waitWhilePaused()

  // Complete animation
  animatingIndex.value = -1
  animationType.value = null
  isAnimating.value = false

  explanation.value = [
    `✓ Pushed ${value} successfully!`,
    '',
    `Top element: ${value}`,
    `Stack size: ${stack.value.length}/${maxSize.value}`,
    '',
    'Time complexity: O(1)',
  ]
}

// Pop operation
export async function pop(): Promise<number | undefined> {
  if (isAnimating.value) return undefined

  // Check for underflow
  if (stack.value.length === 0) {
    explanation.value = [
      '⚠️ Stack Underflow!',
      '',
      'Cannot pop from empty stack.',
      'Add elements using Push first.',
    ]
    return undefined
  }

  isAnimating.value = true
  animationType.value = 'pop'
  animatingIndex.value = topIndex.value

  const poppedValue = stack.value[topIndex.value]

  explanation.value = [
    `Popping ${poppedValue} from the stack...`,
    '',
    'Step 1: Get top element',
    `Top element at index ${topIndex.value}: ${poppedValue}`,
  ]

  await sleep(300)
  await waitWhilePaused()

  explanation.value = [
    `Popping ${poppedValue} from the stack...`,
    '',
    'Step 2: Remove top element',
    'Updating top pointer...',
  ]

  await sleep(200)
  await waitWhilePaused()

  // Remove element
  stack.value.pop()
  topIndex.value = stack.value.length - 1
  animatingIndex.value = -1
  animationType.value = null
  isAnimating.value = false

  const topDisplay = topIndex.value >= 0 ? stack.value[topIndex.value] : 'empty'

  explanation.value = [
    `✓ Popped ${poppedValue} successfully!`,
    '',
    `New top: ${topDisplay}`,
    `Stack size: ${stack.value.length}/${maxSize.value}`,
    '',
    'Time complexity: O(1)',
  ]

  return poppedValue
}

// Peek operation
export async function peek(): Promise<number | undefined> {
  if (isAnimating.value) return undefined

  // Check for empty stack
  if (stack.value.length === 0) {
    explanation.value = [
      '⚠️ Stack is empty!',
      '',
      'Cannot peek at empty stack.',
      'Add elements using Push first.',
    ]
    return undefined
  }

  isAnimating.value = true
  animationType.value = 'peek'
  highlightedIndex.value = topIndex.value

  const topValue = stack.value[topIndex.value]

  explanation.value = [
    `Peeking at top element...`,
    '',
    'Accessing top without removing.',
    `Top element: ${topValue}`,
  ]

  await sleep(500)
  await waitWhilePaused()

  highlightedIndex.value = -1
  animationType.value = null
  isAnimating.value = false

  explanation.value = [
    `✓ Peek: ${topValue}`,
    '',
    `Top element is ${topValue}`,
    'Element remains in stack.',
    `Stack size unchanged: ${stack.value.length}/${maxSize.value}`,
    '',
    'Time complexity: O(1)',
  ]

  return topValue
}

// Check if stack is empty
export function isEmpty(): boolean {
  return stack.value.length === 0
}

// Check if stack is full
export function isFull(): boolean {
  return stack.value.length >= maxSize.value
}

// Get stack size
export function size(): number {
  return stack.value.length
}
