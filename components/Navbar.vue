<template>
  <nav
    class="absolute flex flex-row-reverse w-full text-white px-6 mt-3 mb-0 pb-0"
  >
    <div v-for="btnLink in btnLinks">
      <nuxt-link :to="btnLink.redirectLink">
        <button
          class="border rounded px-3 py-1 mx-1 md:mx-2 lg:mx-3 font-ubuntu-mono uppercase hover:bg-white hover:text-gray-800 md:text-xl"
        >
          {{ btnLink.title }}
        </button>
      </nuxt-link>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      btnLinks: [
        {
          title: "Contact",
          redirectLink: "/contactme",
        },
        {
          title: "About",
          redirectLink: "/aboutme",
        },
        {
          title: "Projects",
          redirectLink: "/work",
        },
        {
          title: "Home",
          redirectLink: "/",
        },
      ],
    };
  },
};
</script>
