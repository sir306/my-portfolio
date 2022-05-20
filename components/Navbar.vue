<template>
  <nav
    class="absolute flex flex-row-reverse w-full text-white px-6 mt-3 mb-0 pb-0"
  >
    <div v-for="btnLink in btnLinks">
      <nuxt-link event="" :id="btnLink.id" :to="btnLink.redirectLink">
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
import gsap from "gsap";
export default {
  data() {
    return {
      btnLinks: [
        {
          id: "contactBtn",
          title: "Contact",
          redirectLink: "/contactme",
        },
        {
          id: "aboutBtn",
          title: "About",
          redirectLink: "/aboutme",
        },
        {
          id: "projectBtn",
          title: "Projects",
          redirectLink: "/work",
        },
        {
          id: "homeBtn",
          title: "Home",
          redirectLink: "/",
        },
      ],
    };
  },
  mounted() {
    function fadeNavbar(router, location) {
      gsap.to("#homeBtn", {
        opacity: 0,
        duration: 2,
        ease: "power3.inOut",
        onComplete: () => {
          router.push(location);
        },
      });
      gsap.to("#homeBtn", {
        opacity: 1,
        duration: 2,
        ease: "power3.inOut",
        delay: 2,
      });
      gsap.to("#projectBtn", {
        opacity: 0,
        duration: 2,
        ease: "power3.inOut",
      });
      gsap.to("#projectBtn", {
        opacity: 1,
        duration: 2,
        ease: "power3.inOut",
        delay: 2,
      });
      gsap.to("#aboutBtn", {
        opacity: 0,
        duration: 2,
        ease: "power3.inOut",
      });
      gsap.to("#aboutBtn", {
        opacity: 1,
        duration: 2,
        ease: "power3.inOut",
        delay: 2,
      });
      gsap.to("#contactBtn", {
        opacity: 0,
        duration: 2,
        ease: "power3.inOut",
      });
      gsap.to("#contactBtn", {
        opacity: 1,
        duration: 2,
        ease: "power3.inOut",
        delay: 2,
      });
    }
    // home button
    document.querySelector("#homeBtn").addEventListener("click", (event) => {
      let pageName = this.$router.history.current.name;
      if (pageName !== "index") {
        fadeNavbar(this.$router, "/");
      }
    });

    // projects button
    document.querySelector("#projectBtn").addEventListener("click", (event) => {
      let pageName = this.$router.history.current.name;
      if (pageName !== "work") {
        fadeNavbar(this.$router, "/work");
      }
    });

    // about button
    document.querySelector("#aboutBtn").addEventListener("click", (event) => {
      let pageName = this.$router.history.current.name;
      if (pageName !== "aboutme") {
        fadeNavbar(this.$router, "/aboutme");
      }
    });

    // contact button
    document.querySelector("#contactBtn").addEventListener("click", (event) => {
      let pageName = this.$router.history.current.name;
      if (pageName !== "contactme") {
        fadeNavbar(this.$router, "/contactme");
      }
    });
  },
};
</script>
