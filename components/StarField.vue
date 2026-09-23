<script setup>
// Full-screen star background for pages without their own scene (the error page).
// CSS stars show straight away; the same 3D starfield as the contact pages fades in on top
// once its first frame is drawn. If WebGL is unavailable, fails to start, or is lost later,
// the CSS stars stay.
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { cleanupScene } from '~/utils/threeHelper'

const canvas = ref(null)
const ready = ref(false)

let renderer = null
let scene = null
let camera = null
let stars = null
let animationId = null
let disposed = false

function animate() {
  animationId = requestAnimationFrame(animate)
  renderer.render(scene, camera)
  ready.value = true
  stars.rotation.x += 0.0007
  stars.rotation.y += Math.cos(Math.random() - 0.5) * 0.0006
}

function onWindowResize() {
  if (camera && renderer) {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
  }
}

// The GPU context can be lost (driver reset, too many contexts): fall back to the CSS
// stars until three.js restores it, then carry on.
function onContextLost() {
  cancelAnimationFrame(animationId)
  animationId = null
  ready.value = false
}

function onContextRestored() {
  if (!disposed && animationId === null) animationId = requestAnimationFrame(animate)
}

onMounted(async () => {
  try {
    // Loaded here rather than up front, so the page shows without waiting for three.js.
    const { Scene, PerspectiveCamera, WebGLRenderer, BufferGeometry, PointsMaterial, Float32BufferAttribute, Points } = await import('three')
    if (disposed) return

    scene = new Scene()
    camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
    camera.position.z = 80
    renderer = new WebGLRenderer({ canvas: canvas.value, powerPreference: 'high-performance' })
    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    canvas.value.addEventListener('webglcontextlost', onContextLost)
    canvas.value.addEventListener('webglcontextrestored', onContextRestored)

    const vertices = []
    for (let i = 0; i < 5000; i++) {
      vertices.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000)
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    stars = new Points(geometry, new PointsMaterial({ color: 0xffffff }))
    scene.add(stars)

    animationId = requestAnimationFrame(animate)
    window.addEventListener('resize', onWindowResize)
  } catch (error) {
    // No WebGL, or it failed to start: the CSS stars are already showing.
    console.warn('StarField: 3D stars unavailable, showing CSS stars instead.', error)
  }
})

onBeforeUnmount(() => {
  disposed = true
  canvas.value?.removeEventListener('webglcontextlost', onContextLost)
  canvas.value?.removeEventListener('webglcontextrestored', onContextRestored)
  window.removeEventListener('resize', onWindowResize)
  cleanupScene(scene, renderer, animationId)
})
</script>

<template>
  <div class="starfield" aria-hidden="true">
    <div class="css-stars" :class="{ faded: ready }"></div>
    <canvas ref="canvas" :class="{ shown: ready }"></canvas>
  </div>
</template>

<style scoped>
.starfield {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #000;
}
.starfield canvas,
.css-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.8s ease;
}
.starfield canvas {
  opacity: 0;
}
.starfield canvas.shown {
  opacity: 1;
}
.css-stars.faded {
  opacity: 0;
}
/* Tiled dots in three tile sizes, so the pattern doesn't visibly repeat. */
.css-stars {
  background-image:
    radial-gradient(1.5px 1.5px at 20px 30px, #fff, transparent),
    radial-gradient(1.5px 1.5px at 140px 70px, #fff, transparent),
    radial-gradient(2px 2px at 90px 190px, #ddd, transparent),
    radial-gradient(1.5px 1.5px at 200px 150px, #fff, transparent),
    radial-gradient(1.5px 1.5px at 230px 120px, #fff, transparent),
    radial-gradient(2px 2px at 60px 260px, #ccc, transparent),
    radial-gradient(2.5px 2.5px at 300px 40px, #fff, transparent),
    radial-gradient(1.5px 1.5px at 280px 300px, #eee, transparent),
    radial-gradient(1.5px 1.5px at 180px 330px, #fff, transparent),
    radial-gradient(2px 2px at 410px 250px, #eee, transparent),
    radial-gradient(1.5px 1.5px at 350px 420px, #fff, transparent),
    radial-gradient(2px 2px at 40px 400px, #ddd, transparent);
  background-size:
    250px 250px, 250px 250px, 250px 250px, 250px 250px,
    330px 330px, 330px 330px, 330px 330px, 330px 330px,
    470px 470px, 470px 470px, 470px 470px, 470px 470px;
}
</style>
