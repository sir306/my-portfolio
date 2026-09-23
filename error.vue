<script setup>
import { computed, onMounted, ref } from 'vue'
import gsap from 'gsap'

const props = defineProps({ error: Object })
const notFound = computed(() => props.error?.statusCode === 404)

useSeoMeta({
  title: () => (notFound.value ? "Page not found — Nick's Coding Website" : "Something went wrong — Nick's Coding Website"),
  robots: 'noindex',
})

const title = ref(null)
const titleLine = ref(null)

onMounted(() => {
  gsap.to([title.value, titleLine.value], {
    opacity: 1,
    duration: 2,
    y: 0,
    ease: "expo",
  });
})

// Leaving the error page has to clear the error, not just change the URL. Modified or
// non-primary clicks are left to the browser, so "open in new tab" still works.
function goHome(event) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <!-- Lazy: error.vue is part of every page's main bundle, so this keeps the star
         background's code and CSS off the other pages. -->
    <LazyStarField />
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
        {{ notFound ? '404' : error?.statusCode || 'Error' }}
        <span class="sr-only">{{ notFound ? 'Page not found' : 'Something went wrong' }}</span>
      </h1>
      <hr
        ref="titleLine"
        class="opacity-0 mb-5"
        style="transform: translateY(60px)"
      />
      <div class="grid grid-cols-1 gap-4">
        <div class="justify-self-center max-w-4xl">
          <p class="text-white font-exo2 text-lg md:text-2xl uppercase mb-0">
            {{ notFound ? 'Page not found' : 'Something went wrong' }}
          </p>
        </div>
        <div class="justify-self-center max-w-4xl">
          <p class="text-white font-ubuntu-mono text-sm md:text-xl tracking-wide uppercase mb-3">
            {{ notFound ? "The page you're looking for doesn't exist or has moved." : 'Please try again in a moment.' }}
          </p>
        </div>
        <div class="justify-self-center">
          <a
            href="/"
            class="border-solid border-2 py-1 px-4 rounded-md border-white text-white font-exo2 text-sm md:text-lg uppercase hover:bg-white hover:text-gray-800"
            @click="goHome"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
