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
import Blurb from "~/components/Blurb.vue";

useSeoMeta({
  title: "About Me — Nick's Coding Website",
  description: 'Nicholas Harding — from steel fixing to software engineering. C++ and Unreal Engine developer, MHITech graduate from the University of Canterbury, currently a Research Assistant working on VR and simulation.',
  ogTitle: "About Me — Nick's Coding Website",
  ogDescription: 'From steel fixing to software engineering — the story of a C++ and Unreal Engine developer.',
  twitterTitle: "About Me — Nick's Coding Website",
  twitterDescription: 'From steel fixing to software engineering — the story of a C++ and Unreal Engine developer.',
})

const canvas = ref(null)
const title = ref(null)
const employmentStatusTitle = ref(null)
const shortTitle = ref(null)
const longTitle = ref(null)
const titleLine = ref(null)
const breakerLine = ref(null)

const shortBlurb = [
  {
    paragraph1:
      "Hey, I’m Nicholas Harding — based in Christchurch, New Zealand. I started coding in 2020, completed two diplomas at Whitecliffe College, a Bachelor of IT in Software Development, and a Master of Human Interface Technology at the University of Canterbury (graduated with Merit). My thesis project, Project Mobius, is a large-scale crowd simulation platform built in Unreal Engine 5.5 — and the most rewarding thing I have built so far.",
    paragraph2:
      "These days I work primarily in C++ and Unreal Engine — building real-time simulations, VR experiences, and 3D environments. My current role involves VR development, environment building, data pipelines, and Python automation. I also integrate external hardware into Unreal Engine applications — recently connecting a treadmill sensor to drive locomotion speed in a VR simulation. I enjoy the kind of problems where you have to think carefully about performance and architecture to make something work well under real constraints.",
  },
]
const longBlurb = [
  {
    paragraph1:
      "Before I got into software, I spent about a decade doing all sorts of work — laboring, security, construction. I was steel fixing when I injured my knee pretty badly, and after surgery and a long recovery I tried to get back into it. Ended up going skiing and wiping out spectacularly, which bent my knee in every direction it was not supposed to go. That was pretty much the end of physically demanding work for me, so I had to figure out what was next.",
    paragraph2:
      "I had always been curious about coding, so I enrolled at Whitecliffe College and just went for it. Early on I struggled with imposter syndrome — I was nearly thirty, most of my peers were fresh out of school, and I felt like I was starting way behind. But once I pushed past that and realized the only person holding me back was me, things clicked. I found Unreal Engine and C++ during my studies and that was it — I was hooked. I spent countless hours outside of class learning through Udemy, reading documentation, and just building things to see what would break.",
    paragraph3:
      "My master’s at the University of Canterbury is where everything came together. Project Mobius started as a thesis project and grew into something much bigger — 118,000+ lines of C++ across 8 runtime modules, with an HDF5 data pipeline, GPU-driven heatmaps, VR support, and a lot of hard lessons about build systems and CI/CD. It was the kind of project where every week I was solving a problem I had never encountered before, and I loved every minute of it.",
    paragraph4:
      "Right now I work at the University of Canterbury as a Research Assistant, helping PhD and graduate students with their research and capstone projects — mostly in VR and Unreal Engine. It is a great role because I get to stay close to the kind of work I am passionate about while also learning from the research happening around me. I am always looking for the next challenge and the next opportunity to build something meaningful.",
  },
]
const currentEmployment = "Employment Status: Research Assistant at the University of Canterbury"

let renderer = null
let scene = null
let animationId = null
let camera = null

function onWindowResize() {
    if(camera && renderer) {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    }
}

onMounted(() => {
    if(!process.client) return
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

    // Reduced star count for performance
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

    // ... (GSAP animations)
    gsap.to(title.value, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(employmentStatusTitle.value, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(shortTitle.value, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(longTitle.value, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(titleLine.value, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(breakerLine.value, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
});

onBeforeUnmount(() => {
    cleanupScene(scene, renderer, animationId)
    window.removeEventListener("resize", onWindowResize);
});
</script>

<template>
  <div>
    <canvas ref="canvas"></canvas>
    <div
      id="container"
      class="absolute w-full max-w-6xl px-6 my-2 overflow-y-auto h-4/5"
    >
      <h2
        ref="title"
        class="text-white font-exo2 text-3xl md:text-5xl uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        About Me
      </h2>
      <hr
        ref="titleLine"
        class="opacity-0 mb-5"
        style="transform: translateY(60px)"
      />
      <h4
        ref="employmentStatusTitle"
        class="text-white text-sm md:text-md tracking-wider uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        {{ currentEmployment }}
      </h4>
      <h4
        ref="shortTitle"
        class="text-white font-exo2 text-lg md:text-2xl uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        Short and Sweet
      </h4>
      <div v-for="paragraph in shortBlurb" :key="paragraph.paragraph1">
        <Blurb :paragraph="paragraph.paragraph1" />
        <Blurb :paragraph="paragraph.paragraph2" />
      </div>
      <div class="mt-2 mb-4 text-center md:text-left">
        <a
          href="https://ir.canterbury.ac.nz/items/0816750d-de14-4fce-82f1-9a42bf4b68ae"
          class="border-2 px-6 py-2 rounded-full bg-black/90 hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105 active:scale-95 font-ubuntu-mono uppercase text-lg inline-flex items-center justify-center border-white text-white"
        >
          Read My Research Thesis
        </a>
      </div>
      <hr
        ref="breakerLine"
        class="opacity-0 mb-5"
        style="transform: translateY(60px)"
      />
      <h4
        ref="longTitle"
        class="text-white font-exo2 text-lg md:text-2xl uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        Want to know more of my story?
      </h4>
      <div v-for="paragraph in longBlurb" :key="paragraph.paragraph1">
        <Blurb :paragraph="paragraph.paragraph1" />
        <Blurb :paragraph="paragraph.paragraph2" />
        <Blurb :paragraph="paragraph.paragraph3" />
        <Blurb :paragraph="paragraph.paragraph4" />
      </div>
    </div>
  </div>
</template>
