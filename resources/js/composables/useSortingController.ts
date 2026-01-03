import { ref } from 'vue'

export const bars = ref<number[]>([])
export const active = ref<number[]>([])
export const swapping = ref<number[]>([])
export const sorted = ref<number[]>([])

export const barCount = ref(30)
export const speed = ref(50)

export const isSorting = ref(false)
export const isPaused = ref(false)

const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

export const generateBars = () => {
    if (isSorting.value) return

    bars.value = Array.from(
        { length: barCount.value },
        () => Math.floor(Math.random() * 90) + 10
    )

    active.value = []
    swapping.value = []
    sorted.value = []
}

export const bubbleSort = async () => {
    if (isSorting.value) return

    isSorting.value = true
    isPaused.value = false

    const arr = bars.value

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            while (isPaused.value) {
                await sleep(100)
            }

            active.value = [j, j + 1]
            await sleep(101 - speed.value)

            if (arr[j] > arr[j + 1]) {
                swapping.value = [j, j + 1]
                await sleep(101 - speed.value)

                ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }

            swapping.value = []
        }

        sorted.value.push(arr.length - i - 1)
    }

    active.value = []
    isSorting.value = false
}

export const selectionSort = async () => {
    if (isSorting.value) return

    isSorting.value = true
    isPaused.value = false

    const arr = bars.value

    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i

        // Find the minimum element in the unsorted portion
        for (let j = i + 1; j < arr.length; j++) {
            while (isPaused.value) {
                await sleep(100)
            }

            // Show comparison
            active.value = [i, j]
            await sleep(101 - speed.value)

            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }

            active.value = []
        }

        // Swap if minimum is not at current position
        if (minIndex !== i) {
            while (isPaused.value) {
                await sleep(100)
            }

            swapping.value = [i, minIndex]
            await sleep(101 - speed.value)

            ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
            swapping.value = []
        }

        // Mark current position as sorted
        sorted.value.push(i)
    }

    // Mark last element as sorted
    sorted.value.push(arr.length - 1)

    active.value = []
    isSorting.value = false
}
