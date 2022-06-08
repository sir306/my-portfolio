<template>
  <div>
    <canvas ref="canvas" style="display: block"></canvas>
    <div
      id="container"
      class="absolute w-full px-3 md:px-6 my-2 overflow-y-auto h-4/5"
    >
      <h1
        ref="title"
        class="text-white font-exo2 text-3xl md:text-5xl uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        Fullstack Projects
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
import gsap from "gsap";
import Project from "@/components/Project";
import {
  PlaneGeometry,
  BufferAttribute,
  Raycaster,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshPhongMaterial,
  Mesh,
  DoubleSide,
  FlatShading,
  DirectionalLight,
  BufferGeometry,
  PointsMaterial,
  Float32BufferAttribute,
  Points,
} from "three";
import OrbitControls from "orbit-controls-es6";

export default {
  components: {
    Project,
  },
  data() {
    return {
      projectData: [
        {
          title: "Sunday Markets",
          description:
            "This is my Level 6 Diploma capstone project, I worked in a team of two to create a fullstack application using the MERN stack and SocketIO. The main components that I worked on was the shopping cart and the instant realtime message chat system were I used SocketIO to achieve this. Another feature I built for the shopping cart was the refresh mechanizm that works on the frontend and the backend, were it removes carts that haven't either been refreshed or updated after 30 minutes and returns stock levels to their previous values. ",
          youtubeLink: "",
          githubTitle: "View Sunday Market Repo",
          githubLink: "https://github.com/sunday-market/sunday-market-app",
        },
        {
          title: "Club Ex",
          description:
            "In this project we developed a fullstack application to create a gym website that could give gym members the abiltiy to access online material to see exercises and provide management a means to add more content.",
          youtubeLink: "",
          githubTitle: "View Club Ex Repo",
          githubLink: "https://github.com/minlopalis/club-ex",
        },
        // {
        //   title: "",
        //   description: "",
        //   youtubeLink: "",
        //   githubTitle: "",
        //   githubLink: "",
        // },
      ],
    };
  },
  mounted() {
    gsap.to(this.$refs.titleLine, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(this.$refs.projectLine, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(this.$refs.title, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    const raycaster = new Raycaster();
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    const renderer = new WebGLRenderer({ canvas: this.$refs.canvas });

    renderer.setSize(outerWidth, outerHeight);
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
      renderer.setSize(outerWidth, outerHeight);
    });
  },
};
</script>
