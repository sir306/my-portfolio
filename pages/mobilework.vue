<template>
  <div>
    <canvas ref="canvas"></canvas>
    <div
      id="container"
      class="absolute w-full px-3 md:px-6 my-2 overflow-y-auto h-4/5"
    >
      <h1
        ref="title"
        class="text-white font-exo2 text-3xl md:text-5xl uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        Mobile Projects
      </h1>
      <hr
        ref="titleLine"
        class="opacity-0 mb-5"
        style="transform: translateY(60px)"
      />

      <div v-for="project in projectData">
        <Project
          class="mb-3"
          :title="project.title"
          :description="project.description"
          :youtubeLink="project.youtubeLink"
          :githubTitle="project.githubTitle"
          :githubLink="project.githubLink"
          :languages="project.languages"
        />
        <hr
          ref="projectLine"
          class="opacity-0 mb-5"
          style="transform: translateY(60px)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { MobileProjects } from "../data/mobileprojects";
import {
  Raycaster,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  BufferGeometry,
  PointsMaterial,
  Float32BufferAttribute,
  Points,
} from "three";

export default {
  data() {
    return {
      projectData: MobileProjects,
    };
  },
  mounted() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    const renderer = new WebGLRenderer({ canvas: this.$refs.canvas });

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(devicePixelRatio);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1);
    scene.add(light);

    const backLight = new DirectionalLight(0x11ffff, 1);
    backLight.position.set(0, 0, -1);
    scene.add(backLight);

    const starGeometry = new BufferGeometry();
    const starMaterial = new PointsMaterial({ color: 0xffffff });
    const starVertices = [];

    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(starVertices, 3)
    );

    const stars = new Points(starGeometry, starMaterial);
    scene.add(stars);

    let frame = 0;

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);

      frame += 0.01;

      stars.rotation.x += 0.0007;
      stars.rotation.y += Math.cos(Math.random() - 0.5) * 0.0006;
    }
    animate();

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });
  },
};
</script>
