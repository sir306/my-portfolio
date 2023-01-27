<template>
  <div>
    <canvas ref="canvas"></canvas>
    <div id="container" class="absolute w-full px-6 my-2">
      <h2
        ref="title"
        class="text-white font-exo2 text-5xl uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        My Work
      </h2>
      <div class="flex space-x-3 justify-evenly overflow-hidden">
        <div
          ref="projects"
          v-for="project in projects"
          v-if="hasData(project.data)"
          class="w-full opacity-0 overflow-hidden"
          style="transform: translateX(40px); width: 100%"
        >
          <nuxt-link :to="project.redirectLink">
            <img
              :src="project.image.url"
              :alt="project.alt"
              style="height: 60vh; width: 100%"
              class="object-cover"
            />
            <p
              class="text-white uppercase font-ubuntu-mono text-lg lg:text-5xl sm:font-thin"
            >
              {{ project.title }}
            </p>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";
import gameImg from "~/assets/gamedev.jpg";
import fullstackImg from "~/assets/fullstack-projects.jpg";
import mobileImg from "~/assets/mobile-projects.jpg";
import randomImg from "~/assets/random-projects.jpg";
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
import { FullStackProjects } from "../data/fullstackprojects";
import { GameProjects } from "../data/gameprojects";
import { MobileProjects } from "../data/mobileprojects";
import { OtherProjects } from "../data/otherprojects";

export default {
  methods: {
    hasData(data) {
      if (data.length === 0) {
        return false;
      } else {
        return true;
      }
    },
  },

  data() {
    return {
      projects: [
        {
          image: {
            url: gameImg,
          },
          title: "GAME PROJECTS",
          alt: "retro game machine",
          redirectLink: "/gamework",
          data: GameProjects,
        },
        {
          image: {
            url: fullstackImg,
          },
          title: "FULLSTACK PROJECTS",
          alt: "image of code",
          redirectLink: "/fullstackwork",
          data: FullStackProjects,
        },
        {
          image: {
            url: mobileImg,
          },
          title: "MOBILE PROJECTS",
          alt: "image of a mobile",
          redirectLink: "/mobilework",
          data: MobileProjects,
        },
        {
          image: {
            url: randomImg,
          },
          title: "OTHER PROJECTS",
          alt: "image of hallway",
          redirectLink: "/otherwork",
          data: OtherProjects,
        },
      ],
    };
  },
  mounted() {
    gsap.to(this.$refs.title, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });

    gsap.to(this.$refs.projects, {
      opacity: 1,
      duration: 2,
      stagger: 0.4,
      x: 0,
      ease: "expo",
      delay: 0.2,
    });
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
  },
};
</script>
