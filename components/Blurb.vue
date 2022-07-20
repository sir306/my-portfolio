<template>
  <div class="text-center md:text-left">
    <div class="flex-wrap px-0 mt-1 mb-2">
      <p
        ref="blurb"
        class="text-white font-ubuntu-mono uppercase text-md md:text-lg pb-2"
      >
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";
export default {
  props: ["paragraph"],

  // this method is generate a random number and to offset the blurbs - currently it seems to always align
  // to one side as they all use the same ref so i am looking at changing the ref to another referance point
  methods: {
    randomNumber: function () {
      let x = Math.random();
      if (this.x > 0.5) {
        return x * 400;
      } else {
        return x * -400;
      }
    },
  },

  // this gsap is to offset the x position and y position
  mounted() {
    gsap.to(this.$refs.blurb, {
      duration: 0,
      opacity: 0,
      x: this.randomNumber(),
      y: this.randomNumber(),
    });
    // this gsap is to return to origin i.e., the center of the screen
    gsap.to(this.$refs.blurb, {
      opacity: 1,
      duration: 3,
      x: 0,
      y: 0,
      ease: "expo",
    });
  },
};
</script>
