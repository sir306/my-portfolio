<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { cleanupScene } from '~/utils/threeHelper'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  BufferGeometry,
  PointsMaterial,
  Float32BufferAttribute,
  Points,
} from "three";
import { Projects } from "~/data/projects";
import Project from "~/components/Project.vue";

useSeoMeta({
  title: "My Work — Nick's Coding Website",
  description: 'Projects by Nicholas Harding — crowd simulation platforms, VR experiences, Unreal Engine tools, mobile apps, and browser-based games.',
  ogTitle: "My Work — Nick's Coding Website",
  ogDescription: 'Crowd simulation, VR, Unreal Engine, and more — project portfolio.',
  twitterTitle: "My Work — Nick's Coding Website",
  twitterDescription: 'Crowd simulation, VR, Unreal Engine, and more — project portfolio.',
})

const canvas = ref(null)
const title = ref(null)
const projectsRef = ref([])

const projects = Projects

let renderer = null;
let scene = null;
let animationId = null;
let camera = null;

function onWindowResize() {
  if (camera && renderer) {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
  }
}

onMounted(() => {
    if(!process.client) return

    gsap.to(title.value, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });

    if(projectsRef.value) {
         gsap.to(projectsRef.value, {
            opacity: 1,
            duration: 2,
            stagger: 0.4,
            x: 0,
            ease: "expo",
            delay: 0.2,
        });
    }

    scene = new Scene();
    camera = new PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    renderer = new WebGLRenderer({ canvas: canvas.value, powerPreference: "high-performance" });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1);
    scene.add(light);

    const backLight = new DirectionalLight(0x11ffff, 1);
    backLight.position.set(0, 0, -1);
    scene.add(backLight);

    const starGeometry = new BufferGeometry();
    const starMaterial = new PointsMaterial({ color: 0xffffff });
    const starVertices = [];

    // Reduced star count for performance (was 10000)
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(starVertices, 3)
    );

    const stars = new Points(starGeometry, starMaterial);
    scene.add(stars);

    let frame = 0;

    function animate() {
      animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);

      frame += 0.01;

      stars.rotation.x += 0.0007;
      stars.rotation.y += Math.cos(Math.random() - 0.5) * 0.0006;
    }
    animate();

    window.addEventListener("resize", onWindowResize);
})

onBeforeUnmount(() => {
    cleanupScene(scene, renderer, animationId)
    window.removeEventListener("resize", onWindowResize);
});
</script>

<template>
  <div>
    <canvas ref="canvas"></canvas>
    <div id="container" class="absolute w-full max-w-6xl px-6 my-2 overflow-y-auto h-4/5">
      <h2
        ref="title"
        class="text-white font-exo2 text-3xl md:text-5xl uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        My Work
      </h2>
      <hr
        class="opacity-0 mb-5"
        style="transform: translateY(60px)"
      />
      <div class="pb-32">
        <div
          v-for="project in projects"
          :key="project.title"
          ref="projectsRef"
          class="opacity-0"
          style="transform: translateX(40px);"
        >
          <Project
            class="mb-3"
            :title="project.title"
            :description="project.description"
            :youtubeLink="project.youtubeLink"
            :githubTitle="project.githubTitle"
            :githubLink="project.githubLink"
            :languages="project.languages"
            :isGameLink="project.isGameLink"
            :extraLinks="project.extraLinks"
            :images="project.images"
          />
          <hr class="opacity-0 mb-5" style="transform: translateY(60px)" />
        </div>
      </div>
    </div>
  </div>
</template>
