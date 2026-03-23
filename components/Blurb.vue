<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const props = defineProps(['paragraph'])
const blurb = ref(null)

onMounted(() => {
  gsap.to(blurb.value, {
    opacity: 1,
    duration: 3,
    x: 1,
    y: 0,
    stagger: 0.4,
    ease: "expo",
  })
})
</script>

<template>
  <div
    ref="blurb"
    class="text-center md:text-left opacity-0"
    style="
      transform: translateX(300px) translateY(300px);
      background-color: rgba(0, 0, 0, 0.9);
    "
  >
    <div class="flex-wrap px-0 mt-1 mb-2">
      <p class="text-white font-ubuntu-mono uppercase text-md md:text-lg pb-2">
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>
