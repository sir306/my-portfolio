<template>
  <nav
    id="navbar"
    class="absolute flex flex-row-reverse w-full text-white px-6 mt-3 mb-0 pb-0"
    style="z-index: 100"
  >
    <div v-for="btnLink in btnLinks">
      <nuxt-link event="" :id="btnLink.id" :to="btnLink.redirectLink">
        <button
          v-if="currentUrl === btnLink.path"
          :id="btnLink.path"
          class="shadow-2xl shadow-white border-2 rounded px-3 py-1 mx-1 md:mx-2 lg:mx-3 font-ubuntu-mono uppercase bg-white text-gray-800 md:text-xl btn-fade"
          disabled
        >
          {{ btnLink.title }}
        </button>
        <button
          v-else="currentUrl !== btnLink.path"
          :id="btnLink.path"
          class="shadow-2xl shadow-white border-2 rounded px-3 py-1 mx-1 md:mx-2 lg:mx-3 font-ubuntu-mono uppercase hover:bg-white hover:text-gray-800 md:text-xl btn-fade"
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
          path: "contactme",
          redirectLink: "/contactme",
        },
        {
          id: "aboutBtn",
          title: "About",
          path: "aboutme",
          redirectLink: "/aboutme",
        },
        {
          id: "projectBtn",
          title: "Projects",
          path: "work",
          redirectLink: "/work",
        },
        {
          id: "homeBtn",
          title: "Home",
          path: "index",
          redirectLink: "/",
        },
      ],
      currentUrl: "",
    };
  },
  created() {
    this.currentUrl = this.$route.name;
  },
  mounted() {
    function fadeNavbar(router, location) {
      gsap.to("#navbar", {
        y: -20,
        duration: 0.6,
        ease: "power3.inOut",
      });
      gsap.to("#navbar", {
        y: 0,
        duration: 1.2,
        ease: "power3.inOut",
        delay: 0.8,
      });
      gsap.to(".btn-fade", {
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          router.push(location);
        },
      });
      gsap.to(".btn-fade", {
        opacity: 1,
        duration: 1.2,
        ease: "power3.inOut",
        delay: 0.8,
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

    // set the navlink to an activated style if current page
    document.querySelectorAll(".btn-fade").forEach((btn) => {
      if (btn.id === this.$route.name) {
        btn.className += "bg-white";
      }
    });
  },
  watch: {
    $route(to, from) {
      this.currentUrl = this.$route.name;
    },
  },
};
</script>
