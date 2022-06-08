<template>
  <div>
    <div class="bg-black opacity-50 h-screen w-screen absolute"></div>
    <Navbar />
    <Nuxt />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
export default {
  components: {
    Navbar,
  },
};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  overflow-y: hidden !important;
}
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
.font-exo2 {
  font-family: "Exo 2", sans-serif;
}
.font-ubuntu-mono {
  font-family: "Ubuntu Mono", monospace;
}
#container-home {
  -webkit-font-smoothing: antialiased;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
#container {
  -webkit-font-smoothing: antialiased;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE 10+ */
}
#container::-webkit-scrollbar {
  width: 0px !important;
}
</style>
