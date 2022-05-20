<template>
  <div class="bg-black h-screen px-6 py-12">
    <h2
      ref="title"
      class="text-white font-exo2 text-5xl uppercase opacity-0 mb-3"
      style="transform: translateY(30px)"
    >
      My Work
    </h2>
    <div class="flex space-x-5">
      <div
        ref="projects"
        v-for="project in projects"
        class="w-full opacity-0"
        style="transform: translateX(40px)"
      >
        <nuxt-link to="/">
          <img
            :src="project.image.url"
            :alt="project.alt"
            style="height: 70vh"
            class="object-cover"
          />
          <p class="text-white uppercase font-ubuntu-mono text-lg">
            {{ project.title }}
          </p>
        </nuxt-link>
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

export default {
  data() {
    return {
      projects: [
        {
          image: {
            url: gameImg,
          },
          title: "GAME PROJECTS",
          alt: "retro game machine",
        },
        {
          image: {
            url: fullstackImg,
          },
          title: "Fullstack PROJECTS",
          alt: "image of code",
        },
        {
          image: {
            url: mobileImg,
          },
          title: "mobile PROJECTS",
          alt: "image of a mobile",
        },
        {
          image: {
            url: randomImg,
          },
          title: "other PROJECTS",
          alt: "image of hallway",
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
  },
};
</script>
