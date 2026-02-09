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
    'Stack Initialized',
    'Ready for operations (Push, Pop, Peek)',
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
  explanation.value = ['Stack cleared.']
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
    `Size: ${count} elements.`,
    `Top: ${randomValues[randomValues.length - 1]}`,
  ]
}

// Push operation
export async function push(value: number): Promise<void> {
  if (isAnimating.value) return

  // Check for overflow
  if (stack.value.length >= maxSize.value) {
    explanation.value.push(`Operation: Push(${value})`)
    explanation.value.push('⚠️ Stack Overflow! Cannot push.')
    return
  }

  isAnimating.value = true
  animationType.value = 'push'

  explanation.value.push(`Operation: Push(${value})`)
  explanation.value.push(`Checking capacity... (${stack.value.length}/${maxSize.value})`)

  await sleep(200)
  await waitWhilePaused()

  // Add element to stack
  stack.value.push(value)
  topIndex.value = stack.value.length - 1
  animatingIndex.value = topIndex.value

  explanation.value.push('Capacity OK. Incrementing top...')

  await sleep(300)
  await waitWhilePaused()

  // Complete animation
  animatingIndex.value = -1
  animationType.value = null
  isAnimating.value = false

  explanation.value.push(`✓ Pushed ${value} at index ${stack.value.length - 1}`)
}

// Pop operation
export async function pop(): Promise<number | undefined> {
  if (isAnimating.value) return undefined

  // Check for underflow
  if (stack.value.length === 0) {
    explanation.value.push('Operation: Pop()')
    explanation.value.push('⚠️ Stack Underflow! Cannot pop.')
    return undefined
  }

  isAnimating.value = true
  animationType.value = 'pop'
  animatingIndex.value = topIndex.value

  const poppedValue = stack.value[topIndex.value]

  explanation.value.push('Operation: Pop()')
  explanation.value.push(`Top element is ${poppedValue}. Removing...`)

  await sleep(300)
  await waitWhilePaused()

  explanation.value.push('Decrementing top pointer...')

  await sleep(200)
  await waitWhilePaused()

  // Remove element
  stack.value.pop()
  topIndex.value = stack.value.length - 1
  animatingIndex.value = -1
  animationType.value = null
  isAnimating.value = false



  explanation.value.push(`✓ Popped ${poppedValue}. New size: ${stack.value.length}`)

  return poppedValue
}

// Peek operation
export async function peek(): Promise<number | undefined> {
  if (isAnimating.value) return undefined

  // Check for empty stack
  if (stack.value.length === 0) {
    explanation.value.push('Operation: Peek()')
    explanation.value.push('⚠️ Stack is empty!')
    return undefined
  }

  isAnimating.value = true
  animationType.value = 'peek'
  highlightedIndex.value = topIndex.value

  const topValue = stack.value[topIndex.value]

  explanation.value.push('Operation: Peek()')
  explanation.value.push(`Peeking top element: ${topValue}`)

  await sleep(500)
  await waitWhilePaused()

  highlightedIndex.value = -1
  animationType.value = null
  isAnimating.value = false

  explanation.value.push(`✓ Top element is ${topValue}`)

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
