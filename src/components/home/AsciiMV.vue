<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const asciiFrame = ref('')
let animationId: number

interface Point {
  x: number
  y: number
  z: number
  nx: number
  ny: number
  nz: number
}

const points: Point[] = []
// Dimensions
const height_m = 2
const width_bar = 0.5
const thickness = 0.5
const spread = 1.3 // Gap from center to vertical bars

const addSlab = (
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  rz: number = 0,
  dx: number = 0,
  dy: number = 0,
) => {
  const res = 0.12
  for (let x = x0; x <= x1; x += res) {
    for (let y = y0; y <= y1; y += res) {
      for (let z = z0; z <= z1; z += res) {
        // Determine normal (local)
        let nx = 0,
          ny = 0,
          nz = 0
        if (z >= z1 - res / 2) nz = 1
        else if (z <= z0 + res / 2) nz = -1
        else if (x >= x1 - res / 2) nx = 1
        else if (x <= x0 + res / 2) nx = -1
        else if (y >= y1 - res / 2) ny = 1
        else if (y <= y0 + res / 2) ny = -1
        else continue // Internal point, skip for efficiency

        // Apply rotation then translation
        let px = x,
          py = y
        const pz = z
        let tnx = nx
        let tny = ny
        const tnz = nz

        if (rz !== 0) {
          const cos = Math.cos(rz)
          const sin = Math.sin(rz)
          px = x * cos - y * sin
          py = x * sin + y * cos
          tnx = nx * cos - ny * sin
          tny = nx * sin + ny * cos
        }

        points.push({
          x: px + dx,
          y: py + dy,
          z: pz,
          nx: tnx,
          ny: tny,
          nz: tnz,
        })
      }
    }
  }
}

// Left Vertical Bar
addSlab(-spread - width_bar, -height_m, -thickness, -spread, height_m, thickness)

// Right Vertical Bar
addSlab(spread, -height_m, -thickness, spread + width_bar, height_m, thickness)

// Diagonals
// We create a vertical slab and rotate it
const diagHeight = 2.0 // Lengthened to reach bottom center
const diagWidth = 0.35
const angle = Math.PI / 4.2 // Angle for the V shape

// Left Diagonal (connects Top-Left to Bottom-Center) needs to be \
// Positive rotation makes Top move Left, Bottom move Right
addSlab(
  -diagWidth / 2,
  -diagHeight / 2,
  -thickness,
  diagWidth / 2,
  diagHeight / 2,
  thickness,
  angle, // Positive rotation for \
  -spread / 2 - 0.1, // Shift left
  0.5, // Shift up significantly so it starts from top
)

// Right Diagonal (connects Top-Right to Bottom-Center) needs to be /
// Negative rotation makes Top move Right, Bottom move Left
addSlab(
  -diagWidth / 2,
  -diagHeight / 2,
  -thickness,
  diagWidth / 2,
  diagHeight / 2,
  thickness,
  -angle, // Negative rotation for /
  spread / 2 + 0.1, // Shift right
  0.5, // Shift up significantly so it starts from top
)

let A = 0
const B = 0.5 // Tilt for 3D

const render = () => {
  const width = 54
  const height = 24
  const buffer = Array(width * height).fill(' ')
  const zBuffer = Array(width * height).fill(-Infinity)

  A -= 0.03

  const cosA = Math.cos(A)
  const sinA = Math.sin(A)
  const cosB = Math.cos(B)
  const sinB = Math.sin(B)

  // Light source
  const light = [Math.sin(A * 0.5), 0.5, -1]
  const mag = Math.sqrt(light[0] ** 2 + light[1] ** 2 + light[2] ** 2)
  light[0] /= mag
  light[1] /= mag
  light[2] /= mag

  points.forEach((p) => {
    // Rotation
    const x = p.x * cosA + p.z * sinA
    let z = -p.x * sinA + p.z * cosA
    const y = p.y * cosB - z * sinB
    z = p.y * sinB + z * cosB

    const nx = p.nx * cosA + p.nz * sinA
    let nz = -p.nx * sinA + p.nz * cosA
    const ny = p.ny * cosB - nz * sinB
    nz = p.ny * sinB + nz * cosB

    // Projection
    const K1 = 34
    const K2 = 12
    const ooz = 1 / (z + K2)

    const xp = Math.floor(width / 2 + K1 * x * ooz * 2.2)
    const yp = Math.floor(height / 2 - K1 * y * ooz)

    if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
      const idx = yp * width + xp
      if (ooz > zBuffer[idx]) {
        zBuffer[idx] = ooz

        // Shading
        let brightness = nx * light[0] + ny * light[1] + nz * light[2]
        // Ambient boost
        brightness = brightness * 0.7 + 0.3

        const chars = ' .:-=+*#%@'
        const charIdx = Math.max(0, Math.min(chars.length - 1, Math.floor((brightness + 1) * 4.5)))
        buffer[idx] = chars[charIdx]
      }
    }
  })

  let res = ''
  for (let i = 0; i < height; i++) {
    res += buffer.slice(i * width, (i + 1) * width).join('') + '\n'
  }
  asciiFrame.value = res
  animationId = requestAnimationFrame(render)
}

onMounted(() => {
  render()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <div class="flex h-full w-full items-center justify-center overflow-hidden">
    <pre
      class="pointer-events-none font-mono text-[8px] leading-none font-black whitespace-pre text-black opacity-90 select-none"
      >{{ asciiFrame }}</pre
    >
  </div>
</template>
