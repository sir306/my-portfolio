<script setup>
import { nextTick, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import gsap from 'gsap'
import { cleanupScene } from '~/utils/threeHelper'
import { validateContact } from '~/utils/contactValidation'
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
const formEl = ref(null)

const errors = reactive({})
const sending = ref(false)

async function showErrors(found) {
  for (const key of Object.keys(errors)) delete errors[key]
  Object.assign(errors, found)
  const invalid = ['name', 'email', 'message'].filter((field) => found[field])
  // The alert is announced even when focus can't move (e.g. Enter pressed in the field).
  if (invalid.length > 0 && !found.form) errors.form = "Your message wasn't sent. Please fix the highlighted fields."
  // Let the messages render first, so screen readers read the reason with the field.
  await nextTick()
  if (invalid.length > 0) formEl.value.elements.namedItem(invalid[0]).focus()
}

function clearError(field) {
  delete errors[field]
  delete errors.form
}

// Checked here for instant feedback. netlify/edge-functions/contact-guard.js applies
// the same rules on the server, where bots can't skip them.
async function onSubmit(event) {
  event.preventDefault()
  if (sending.value) return

  const data = new FormData(formEl.value)
  const found = validateContact(Object.fromEntries(data))
  await showErrors(found)
  if (Object.keys(found).length > 0) return

  sending.value = true
  let response
  try {
    response = await fetch(formEl.value.getAttribute('action'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams(data).toString(),
    })
  } catch {
    sending.value = false
    return showErrors({ form: "Your message couldn't be sent because the site couldn't be reached. Check your connection and try again." })
  }

  if (response.ok) {
    // The message is in. Stay in the sending state so another click can't duplicate it,
    // and never report a routing hiccup as a failed send.
    try {
      await navigateTo('/contactmesuccess')
    } catch {
      location.assign('/contactmesuccess/')
    }
    return
  }

  sending.value = false
  const reply = await response.json().catch(() => null)
  showErrors(reply?.errors ?? {
    form: `Sorry, your message couldn't be sent (the server replied with error ${response.status}). Please try again in a few minutes, or message me on LinkedIn.`,
  })
}

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
    // The script is running, so show our own messages instead of the browser's bubbles.
    formEl.value.noValidate = true
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
            class="text-white font-ubuntu-mono text-sm md:text-xl tracking-wide uppercase mb-3"
          >
            There are various ways to get in touch with me and I am active on
            these platforms weekly, you can either click on the links below and
            follow them to their respective sites or you can fill the form in
            below and i will get back to you as soon as possible
          </p>
        </div>
        <div class="justify-self-center max-w-4xl">
          <p
            class="text-white font-exo2 text-lg md:text-2xl uppercase mb-0"
          >
            My profiles and channels
          </p>
        </div>
        <div class="justify-self-center">
          <p class="py-2">
            <a
              class="border-solid border-2 py-1 px-4 rounded-md border-white text-white font-exo2 text-sm md:text-lg uppercase mb-3 hover:bg-white hover:text-gray-800"
              href="https://www.linkedin.com/in/nicholas-harding-9b240a1a3/"
              >LinkedIn Profile</a
            >
          </p>
          <p class="py-2">
            <a
              class="border-solid border-2 py-1 px-4 rounded-md border-white text-white font-exo2 text-sm md:text-lg uppercase mb-3 hover:bg-white hover:text-gray-800"
              href="https://github.com/sir306"
              >GitHub</a
            >
          </p>
          <p class="py-2">
            <a
              class="border-solid border-2 py-1 px-4 rounded-md border-white text-white font-exo2 text-sm md:text-lg uppercase mb-3 hover:bg-white hover:text-gray-800"
              href="https://www.youtube.com/channel/UCGYiCTWIWc5LFNIbw02PizA"
              >YouTube Channel</a
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
            class="text-white font-exo2 text-lg md:text-2xl uppercase mb-0"
          >
            Contact Form
          </p>
        </div>
          <div class="backdrop-blur-md bg-white/10 p-8 rounded-xl border border-white/20 shadow-2xl max-w-4xl mx-auto w-full">
            <h3 class="text-white font-exo2 text-2xl uppercase mb-6 text-center tracking-widest border-b border-white/20 pb-4">
              Send me a message
            </h3>
            <form
              ref="formEl"
              class="flex flex-col gap-6"
              name="contact"
              method="POST"
              action="/contactmesuccess/"
              data-netlify="true"
              netlify-honeypot="bot-field"
              @submit="onSubmit"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p class="hidden">
                <label>Don't fill this out if you're human: <input name="bot-field" autocomplete="off" /></label>
              </p>

              <div class="group relative">
                <input
                  class="peer w-full bg-transparent border-b-2 text-white placeholder-transparent focus:outline-hidden py-2 px-2 transition-all duration-300"
                  :class="errors.name ? 'border-red-400' : 'border-white/50 focus:border-cyan-400'"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  required
                  :aria-invalid="errors.name ? 'true' : undefined"
                  :aria-describedby="errors.name ? 'name-error' : undefined"
                  @input="clearError('name')"
                />
                <label
                  for="name"
                  class="absolute left-2 -top-3.5 text-cyan-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-cyan-400 font-exo2 uppercase tracking-wide cursor-text"
                >
                  Your Name
                </label>
                <p v-if="errors.name" id="name-error" class="mt-2 text-red-400 text-sm font-ubuntu-mono">{{ errors.name }}</p>
              </div>

              <div class="group relative">
                <input
                  class="peer w-full bg-transparent border-b-2 text-white placeholder-transparent focus:outline-hidden py-2 px-2 transition-all duration-300"
                  :class="errors.email ? 'border-red-400' : 'border-white/50 focus:border-cyan-400'"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  :aria-invalid="errors.email ? 'true' : undefined"
                  :aria-describedby="errors.email ? 'email-error' : undefined"
                  @input="clearError('email')"
                />
                <label
                  for="email"
                  class="absolute left-2 -top-3.5 text-cyan-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-cyan-400 font-exo2 uppercase tracking-wide cursor-text"
                >
                  Your Email
                </label>
                <p v-if="errors.email" id="email-error" class="mt-2 text-red-400 text-sm font-ubuntu-mono">{{ errors.email }}</p>
              </div>

              <div class="group relative">
                <textarea
                  class="peer w-full bg-transparent border-b-2 text-white placeholder-transparent focus:outline-hidden py-2 px-2 transition-all duration-300 min-h-[120px]"
                  :class="errors.message ? 'border-red-400' : 'border-white/50 focus:border-cyan-400'"
                  name="message"
                  id="message"
                  placeholder="Message"
                  required
                  :aria-invalid="errors.message ? 'true' : undefined"
                  :aria-describedby="errors.message ? 'message-error' : undefined"
                  @input="clearError('message')"
                ></textarea>
                <label
                  for="message"
                  class="absolute left-2 -top-3.5 text-cyan-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-cyan-400 font-exo2 uppercase tracking-wide cursor-text"
                >
                  Message
                </label>
                <p v-if="errors.message" id="message-error" class="mt-2 text-red-400 text-sm font-ubuntu-mono">{{ errors.message }}</p>
              </div>

              <p v-if="errors.form" role="alert" class="text-red-400 font-ubuntu-mono text-center">{{ errors.form }}</p>

              <button
                class="self-center mt-4 border-2 border-white text-white font-ubuntu-mono text-xl uppercase px-12 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 aria-disabled:opacity-50 aria-disabled:cursor-wait"
                type="submit"
                :aria-disabled="sending ? 'true' : undefined"
              >
                {{ sending ? 'Sending...' : 'Send Message' }}
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
