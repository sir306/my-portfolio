<script setup>
import { ref, watch, onMounted } from 'vue'
import gsap from 'gsap'

const route = useRoute()
const router = useRouter()

const currentUrl = ref('')

const btnLinks = [
  { id: 'homeBtn', title: 'Home', path: 'index', redirectLink: '/' },
  { id: 'projectBtn', title: 'Projects', path: 'work', redirectLink: '/work' },
  { id: 'aboutBtn', title: 'About', path: 'aboutme', redirectLink: '/aboutme' },
  { id: 'contactBtn', title: 'Contact', path: 'contactme', redirectLink: '/contactme' },
]

onMounted(() => {
  currentUrl.value = route.name
})

watch(() => route.name, (newName) => {
  currentUrl.value = newName
})

function navigate(link) {
  if (currentUrl.value === link.path) return

  // Animate then push
  gsap.to("#navbar", { y: -20, duration: 0.6, ease: "power3.inOut" })
  gsap.to("#navbar", { y: 0, duration: 1.2, ease: "power3.inOut", delay: 0.8 })
  
  gsap.to(".btn-fade", {
    opacity: 0,
    duration: 0.6,
    ease: "power3.inOut",
    onComplete: () => {
      router.push(link.redirectLink)
    }
  })
  // Fade back in happens via mounted or we can trigger it:
  gsap.to(".btn-fade", {
        opacity: 1,
        duration: 1.2,
        ease: "power3.inOut",
        delay: 0.8,
  });
}
</script>

<template>
  <nav
    id="navbar"
    class="absolute flex flex-wrap justify-center md:justify-end w-full text-white px-2 md:px-6 mt-3 mb-0 pb-0"
    style="z-index: 100"
  >
    <div v-for="btnLink in btnLinks" :key="btnLink.id" class="mb-2 md:mb-0">
      <button
        :id="btnLink.id"
        class="btn-fade border-2 rounded-lg px-2 py-1 md:px-4 md:py-2 mx-1 lg:mx-3 font-ubuntu-mono uppercase text-sm md:text-xl transition-all duration-300 hover:scale-105 active:scale-95"
        :class="[
          currentUrl === btnLink.path 
            ? 'bg-white text-gray-900 border-white' 
            : 'bg-black/90 text-white border-white/50 hover:bg-white hover:text-gray-900 hover:border-white'
        ]"
        :disabled="currentUrl === btnLink.path"
        @click="navigate(btnLink)"
      >
        {{ btnLink.title }}
      </button>
    </div>
  </nav>
</template>
