<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { cleanupScene } from '~/utils/threeHelper'
import {
  ColorManagement,
  PlaneGeometry,
  BufferAttribute,
  Raycaster,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshPhongMaterial,
  Mesh,
  DoubleSide,
  DirectionalLight,
  BufferGeometry,
  PointsMaterial,
  Float32BufferAttribute,
  Points,
} from "three"

const router = useRouter()
const canvas = ref(null)

// Variables accessed by methods/lifecycle
let camera = null
let renderer = null
let scene = null
let animationId = null

function onWindowResize() {
  if (camera && renderer) {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
  }
}

onMounted(() => {
  if (!process.client) return

  const world = {
      plane: {
        width: 400,
        height: 400,
        widthSegments: 50,
        heightSegments: 50,
      },
  }

  // Disable v0.152+ automatic sRGB color management to match original Three.js v0.140 rendering
  ColorManagement.enabled = false

  // Scene setup
  scene = new Scene()
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
  camera.position.z = 80

  renderer = new WebGLRenderer({ canvas: canvas.value, powerPreference: "high-performance" })
  renderer.outputColorSpace = 'srgb-linear'  // Match v0.140 LinearEncoding — no output gamma correction
  renderer.useLegacyLights = true             // Match v0.140 light intensity (without this, lights are divided by PI)
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // A Plane with fewer vertices is MUCH faster to loop over in JS
  const planeGeometry = new PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  )
  const planeMaterial = new MeshPhongMaterial({
    side: DoubleSide,
    flatShading: true,
    vertexColors: true,
  })
  const planeMesh = new Mesh(planeGeometry, planeMaterial)
  scene.add(planeMesh)

  // ... (vertex randomization unchanged) ...
  const { array } = planeMesh.geometry.attributes.position
  const randomValues = []
  for (let i = 0; i < array.length; i++) {
    if (i % 3 === 0) {
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

      array[i] = x + (Math.random() - 0.5) * 3
      array[i + 1] = y + (Math.random() - 0.5) * 3
      array[i + 2] = (z + Math.random() - 0.5) * 3
    }
    randomValues.push(Math.random() * Math.PI * 2)
  }
  planeMesh.geometry.attributes.position.randomValues = randomValues
  planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array

  // ... (colors setup unchanged) ...
  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
  }
  planeMesh.geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3))

  // Lights
  const light = new DirectionalLight(0xffffff, 1)
  light.position.set(0, 1, 1)
  scene.add(light)

  const backLight = new DirectionalLight(0xffffff, 1)
  backLight.position.set(0, 0, -1)
  scene.add(backLight)

  const starGeometry = new BufferGeometry()
  const starMaterial = new PointsMaterial({ color: 0xffffff })
  const starVertices = []
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000
    const y = (Math.random() - 0.5) * 2000
    const z = (Math.random() - 0.5) * 2000
    starVertices.push(x, y, z)
  }
  starGeometry.setAttribute("position", new Float32BufferAttribute(starVertices, 3))
  const stars = new Points(starGeometry, starMaterial)
  scene.add(stars)

  // Mouse & Raycaster
  const raycaster = new Raycaster()
  const mouse = { x: undefined, y: undefined }

  // Animation Loop
  let frame = 0
  function animate() {
    animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
    frame += 0.01

    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position
    // Looping over fewer vertices now
    for (let i = 0; i < array.length; i += 3) {
      array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01
      array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.01
      array[i + 2] = originalPosition[i + 2] + Math.sin(frame + randomValues[i + 2]) * 0.006
    }
    planeMesh.geometry.attributes.position.needsUpdate = true

    // Optimization: Raycasting check remains, but against fewer faces
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(planeMesh)
    if (intersects.length > 0) {
       const { color } = intersects[0].object.geometry.attributes
       const hoverColor = { r: 0.1, g: 0.5, b: 1 }
       const initialColor = { r: 0, g: 0.19, b: 0.4 }

       // Instant Set
       color.setX(intersects[0].face.a, 0.1)
       color.setY(intersects[0].face.a, 0.5)
       color.setZ(intersects[0].face.a, 1)
       color.setX(intersects[0].face.b, 0.1)
       color.setY(intersects[0].face.b, 0.5)
       color.setZ(intersects[0].face.b, 1)
       color.setX(intersects[0].face.c, 0.1)
       color.setY(intersects[0].face.c, 0.5)
       color.setZ(intersects[0].face.c, 1)
       intersects[0].object.geometry.attributes.color.needsUpdate = true

       // Fade back
       gsap.to(hoverColor, {
          r: initialColor.r,
          g: initialColor.g,
          b: initialColor.b,
          onUpdate: () => {
             color.setX(intersects[0].face.a, hoverColor.r)
             color.setY(intersects[0].face.a, hoverColor.g)
             color.setZ(intersects[0].face.a, hoverColor.b)
             color.setX(intersects[0].face.b, hoverColor.r)
             color.setY(intersects[0].face.b, hoverColor.g)
             color.setZ(intersects[0].face.b, hoverColor.b)
             color.setX(intersects[0].face.c, hoverColor.r)
             color.setY(intersects[0].face.c, hoverColor.g)
             color.setZ(intersects[0].face.c, hoverColor.b)
             intersects[0].object.geometry.attributes.color.needsUpdate = true
          }
       })
    }
    stars.rotation.x += 0.0007
    stars.rotation.y += Math.cos(Math.random() - 0.5) * 0.0006
  }

  animate()

  addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / innerWidth) * 2 - 1
      mouse.y = -(event.clientY / innerHeight) * 2 + 1
  })

  window.addEventListener("resize", onWindowResize)

  // Intro Animations
  gsap.to("#nicholas", { opacity: 1, duration: 1.5, y: 0, ease: "expo" })
  gsap.to("#introText", { opacity: 1, duration: 1.5, delay: 0.3, y: 0, ease: "expo" })
  gsap.to("#viewWorkBTN", { opacity: 1, duration: 1.5, delay: 0.6, y: 0, ease: "expo" })

})

onBeforeUnmount(() => {
  cleanupScene(scene, renderer, animationId)
  window.removeEventListener("resize", onWindowResize)
})

function onViewWork(event) {
    if(!camera) return
    event.preventDefault();
    gsap.to("#container-home", { opacity: 0 });
    gsap.to(camera.position, {
        z: 25,
        ease: "power3.inOut",
        duration: 1.5,
    });
    gsap.to(camera.rotation, {
        x: 1.57,
        ease: "power3.inOut",
        duration: 2,
    });
    gsap.to(camera.position, {
        y: 1000,
        ease: "power3.in",
        duration: 1.2,
        delay: 2,
        onComplete: () => {
        router.push("/work");
        },
    });

    // Navbar animations (Global selectors - might crash if Navbar not mounted)
    gsap.to("#navbar", { y: -20, duration: 2, ease: "power3.inOut" });
    gsap.to("#navbar", { y: 0, duration: 2, ease: "power3.inOut", delay: 2 });

    ["#homeBtn", "#projectBtn", "#aboutBtn", "#contactBtn"].forEach(btn => {
        gsap.to(btn, { opacity: 0, duration: 2, ease: "power3.inOut" });
        gsap.to(btn, { opacity: 1, duration: 2, ease: "power3.inOut", delay: 2 });
    })
}
</script>

<template>
  <div>
    <canvas ref="canvas"></canvas>
    <div
      id="container-home"
      class="absolute text-white text-center w-full max-w-5xl px-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <h1
        id="nicholas"
        class="font-ubuntu-mono text-2xl uppercase tracking-wide mb-2 opacity-0"
        style="transform: translateY(60px)"
      >
        Nicholas Harding
      </h1>
      <p
        id="introText"
        class="font-exo2 text-4xl opacity-0"
        style="transform: translateY(60px)"
      >
        A C++ AND UNREAL ENGINE DEVELOPER<br />
        BUILDING LARGE-SCALE SIMULATION PLATFORMS.<br />
        A QUEST TO LEAVE A LEGACY, FOR OTHERS TO FOLLOW.
      </p>

      <a
        id="viewWorkBTN"
        @click="onViewWork"
        class="opacity-0 border px-4 py-1 rounded-lg text-2xl font-ubuntu-mono uppercase mt-8 hover:bg-white hover:text-gray-800 inline-block"
        style="cursor: pointer; transform: translateY(60px)"
      >
        View Work
      </a>
    </div>
  </div>
</template>
