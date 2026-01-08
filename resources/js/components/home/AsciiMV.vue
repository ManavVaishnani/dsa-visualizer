<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const asciiFrame = ref('');
let animationId: number;

interface Point {
    x: number;
    y: number;
    z: number;
}

const points: Point[] = [];
const scale = 1.4;

// Generate high-density points for 'M'
// Left vertical
for (let y = -1.2 * scale; y <= 1.2 * scale; y += 0.04) {
    points.push({ x: -1.0 * scale, y, z: 0 });
}
// Right vertical
for (let y = -1.2 * scale; y <= 1.2 * scale; y += 0.04) {
    points.push({ x: 1.0 * scale, y, z: 0 });
}
// Middle V shape
for (let i = 0; i <= 1.0 * scale; i += 0.04) {
    points.push({ x: -1.0 * scale + i, y: 1.2 * scale - i, z: 0 });
    points.push({ x: 1.0 * scale - i, y: 1.2 * scale - i, z: 0 });
}

// Add 3D thickness (Boldness)
const originalPointsCount = points.length;
for (let z = -0.4; z <= 0.4; z += 0.08) {
    if (Math.abs(z) < 0.01) continue;
    for (let i = 0; i < originalPointsCount; i++) {
        points.push({ ...points[i], z });
    }
}

let A = 0; // Rotation around Y
const B = -0.4; // Fixed tilt

const render = () => {
    const width = 45;
    const height = 18;
    const buffer = Array(width * height).fill(' ');
    const zBuffer = Array(width * height).fill(-Infinity);

    A -= 0.02; // Slow, Right-to-Left

    points.forEach((p) => {
        let x = p.x;
        let y = p.y;
        let z = p.z;

        // Rotate around Y (Spin)
        const nx = x * Math.cos(A) + z * Math.sin(A);
        const nz1 = -x * Math.sin(A) + z * Math.cos(A);
        x = nx;
        z = nz1;

        // Rotate around X (Tilt)
        const ny = y * Math.cos(B) - z * Math.sin(B);
        const nz2 = y * Math.sin(B) + z * Math.cos(B);
        y = ny;
        z = nz2;

        // Projection
        const K1 = 16;
        const K2 = 6;
        const ooz = 1 / (z + K2);

        const xp = Math.floor(width / 2 + K1 * x * ooz * 2.2);
        const yp = Math.floor(height / 2 - K1 * y * ooz);

        if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
            const idx = yp * width + xp;
            if (ooz > zBuffer[idx]) {
                zBuffer[idx] = ooz;
                const chars = ' .:;ilwW@@@';
                const luminance = Math.floor((z + 2) * 2.5);
                buffer[idx] =
                    chars[Math.max(0, Math.min(chars.length - 1, luminance))] ||
                    '@';
            }
        }
    });

    let res = '';
    for (let i = 0; i < height; i++) {
        res += buffer.slice(i * width, (i + 1) * width).join('') + '\n';
    }
    asciiFrame.value = res;
    animationId = requestAnimationFrame(render);
};

onMounted(() => {
    render();
});

onUnmounted(() => {
    cancelAnimationFrame(animationId);
});
</script>

<template>
    <div class="flex h-full w-full items-center justify-center overflow-hidden">
        <pre
            class="font-mono text-[9px] leading-[1.1] font-black whitespace-pre text-black opacity-90 select-none"
            >{{ asciiFrame }}</pre
        >
    </div>
</template>
