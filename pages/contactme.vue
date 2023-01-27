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
            class="text-white font-exo2 text-lg md:text-2xl uppercase opacity-1 mb-0"
          >
            Contact Form
          </p>
        </div>
        <div class="justify-self-center">
          <!-- form start -->
          <form
            class="grid grid-cols-3 gap-6"
            name="contact"
            method="POST"
            action="/contactmesuccess"
            data-netlify="true"
            style="transform: translateY(60px)"
          >
            <input type="hidden" name="form-name" value="contact" />
            <label
              for="name"
              class="col-span-1 text-white text-sm md:text-lg font-exo2 tracking-wider"
              >Your Name:</label
            >
            <input
              class="col-span-2 p-1 text-black text-sm rounded-sm md:text-lg font-exo2 tracking-wider"
              type="text"
              name="name"
              placeholder="Tell me who you are.."
              required
            />
            <label
              for="email"
              class="col-span-1 text-white text-sm md:text-lg font-exo2 tracking-wider"
              >Your Email:</label
            >
            <input
              class="col-span-2 p-1 text-black rounded-sm text-sm md:text-lg font-exo2 tracking-wider"
              type="email"
              name="email"
              placeholder="Enter your email here.."
              required
            />

            <label
              class="col-span-1 text-white text-sm md:text-lg font-exo2 tracking-wider"
              >Message:</label
            >
            <textarea
              class="col-span-2 p-1 text-black rounded-sm text-sm md:text-lg font-exo2 tracking-wider"
              name="message"
              required
            >
Say hello to me..</textarea
            >

            <button
              class="col-start-2 col-span-1 border-solid border-2 py-1 px-4 rounded-md border-white text-white text-sm md:text-lg font-exo2 tracking-wider hover:bg-white hover:text-gray-800"
              type="submit"
            >
              Send
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

<script>
import gsap from "gsap";
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

export default {
  mounted() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    const renderer = new WebGLRenderer({ canvas: this.$refs.canvas });

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(devicePixelRatio);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1);
    scene.add(light);

    const backLight = new DirectionalLight(0x11ffff, 1);
    backLight.position.set(0, 0, -1);
    scene.add(backLight);

    const starGeometry = new BufferGeometry();
    const starMaterial = new PointsMaterial({ color: 0xffffff });
    const starVertices = [];

    for (let i = 0; i < 10000; i++) {
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
      requestAnimationFrame(animate);
      renderer.render(scene, camera);

      frame += 0.01;

      stars.rotation.x += 0.0007;
      stars.rotation.y += Math.cos(Math.random() - 0.5) * 0.0006;
    }
    animate();

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });

    // GSAP animations to various parts of the page
    gsap.to(this.$refs.title, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    // lines
    gsap.to(this.$refs.titleLine, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(this.$refs.formLine, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(this.$refs.endLine, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
  },
};
</script>
