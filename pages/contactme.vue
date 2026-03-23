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

useSeoMeta({
  title: "Contact Me — Nick's Coding Website",
  description: 'Get in touch with Nicholas Harding. Find me on LinkedIn and GitHub, or send a message directly.',
  ogTitle: "Contact Me — Nick's Coding Website",
  ogDescription: 'Get in touch with Nicholas Harding via LinkedIn, GitHub, or the contact form.',
  twitterTitle: "Contact Me — Nick's Coding Website",
  twitterDescription: 'Get in touch with Nicholas Harding via LinkedIn, GitHub, or the contact form.',
})

// refs
const canvas = ref(null)
const title = ref(null)
const titleLine = ref(null)
const formLine = ref(null)
const endLine = ref(null)

let renderer = null
let scene = null
let animationId = null
let camera = null

function onWindowResize() {
  if (camera && renderer) {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
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

    gsap.to(title.value, {
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
    gsap.to(formLine.value, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(endLine.value, {
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
      class="absolute w-full px-3 md:px-6 my-2 overflow-y-auto h-4/5"
      style="background-color: rgba(0, 0, 0, 0.8)"
    >
      <h1
        ref="title"
        class="text-white font-exo2 text-3xl md:text-5xl uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        Contact Me
      </h1>
      <hr
        ref="titleLine"
        class="opacity-0 mb-5"
        style="transform: translateY(60px)"
      />
      <div class="grid grid-cols-1 gap-4">
        <div class="justify-self-center max-w-4xl">
          <p
            class="text-white font-ubuntu-mono text-sm md:text-xl tracking-wide uppercase opacity-1 mb-3"
          >
            There are various ways to get in touch with me and I am active on
            these platforms weekly, you can either click on the links below and
            follow them to their respective sites or you can fill the form in
            below and i will get back to you as soon as possible
          </p>
        </div>
        <div class="justify-self-center max-w-4xl">
          <p
            class="text-white font-exo2 text-lg md:text-2xl uppercase opacity-1 mb-0"
          >
            My profiles and channels
          </p>
        </div>
        <div class="justify-self-center">
          <p class="py-2">
            <a
              class="border-solid border-2 py-1 px-4 rounded-md border-white text-white font-exo2 text-sm md:text-lg uppercase opacity-1 mb-3 hover:bg-white hover:text-gray-800"
              href="https://www.linkedin.com/in/nicholas-harding-9b240a1a3/"
              >LinkedIn Profile</a
            >
          </p>
          <p class="py-2">
            <a
              class="border-solid border-2 py-1 px-4 rounded-md border-white text-white font-exo2 text-sm md:text-lg uppercase opacity-1 mb-3 hover:bg-white hover:text-gray-800"
              href="https://github.com/sir306"
              >GitHub</a
            >
          </p>
        </div>
        <hr
          ref="formLine"
          class="opacity-0 mb-5"
          style="transform: translateY(60px)"
        />

        <div class="justify-self-center max-w-4xl">
          <p
            class="text-white font-exo2 text-lg md:text-2xl uppercase opacity-1 mb-0"
          >
            Contact Form
          </p>
        </div>
          <div class="backdrop-blur-md bg-white/10 p-8 rounded-xl border border-white/20 shadow-2xl max-w-4xl mx-auto w-full">
            <h3 class="text-white font-exo2 text-2xl uppercase mb-6 text-center tracking-widest border-b border-white/20 pb-4">
              Send me a message
            </h3>
            <form
              class="flex flex-col gap-6"
              name="contact"
              method="POST"
              action="/contactmesuccess"
              data-netlify="true"
            >
              <input type="hidden" name="form-name" value="contact" />
              
              <div class="group relative">
                <input
                  class="peer w-full bg-transparent border-b-2 border-white/50 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 py-2 px-2 transition-all duration-300"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  required
                />
                <label
                  for="name"
                  class="absolute left-2 -top-3.5 text-cyan-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-cyan-400 font-exo2 uppercase tracking-wide cursor-text"
                >
                  Your Name
                </label>
              </div>

              <div class="group relative">
                <input
                  class="peer w-full bg-transparent border-b-2 border-white/50 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 py-2 px-2 transition-all duration-300"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                />
                <label
                  for="email"
                  class="absolute left-2 -top-3.5 text-cyan-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-cyan-400 font-exo2 uppercase tracking-wide cursor-text"
                >
                  Your Email
                </label>
              </div>

              <div class="group relative">
                <textarea
                  class="peer w-full bg-transparent border-b-2 border-white/50 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 py-2 px-2 transition-all duration-300 min-h-[120px]"
                  name="message"
                  id="message"
                  placeholder="Message"
                  required
                ></textarea>
                <label
                  for="message"
                  class="absolute left-2 -top-3.5 text-cyan-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-cyan-400 font-exo2 uppercase tracking-wide cursor-text"
                >
                  Message
                </label>
              </div>

              <button
                class="self-center mt-4 border-2 border-white text-white font-ubuntu-mono text-xl uppercase px-12 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 active:scale-95"
                type="submit"
              >
                Send Message
              </button>
            </form>
          </div>
        <hr
          ref="endLine"
          class="opacity-0 mb-5 mt-5"
          style="transform: translateY(60px)"
        />
      </div>
    </div>
  </div>
</template>
