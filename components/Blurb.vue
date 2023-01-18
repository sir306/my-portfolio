<template>
  <div
    ref="blurb"
    class="text-center md:text-left opacity-0"
    style="transform: translateX(300px) translateY(300px)"
  >
    <div class="flex-wrap px-0 mt-1 mb-2">
      <p class="text-white font-ubuntu-mono uppercase text-md md:text-lg pb-2">
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";
export default {
  props: ["paragraph"],
  mounted() {
    // this gsap is to return to origin i.e., the center of the screen
    gsap.to(this.$refs.blurb, {
      opacity: 1,
      duration: 3,
      x: 1,
      y: 0,
      stagger: 0.4,
      ease: "expo",
    });
  },
};
</script>
