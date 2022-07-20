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
  methods: {
    randomNumber: function () {
      let x = Math.random();
      console.log(x);
      console.log(x < 0.5);
      if (this.x > 0.5) {
        return x * 400;
      } else {
        return x * -400;
      }
    },
  },

  mounted() {
    gsap.to(this.$refs.blurb, {
      duration: 0,
      opacity: 0,
      x: this.randomNumber(),
    });
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
