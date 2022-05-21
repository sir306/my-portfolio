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
        Game Projects
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

export default {
  components: {
    Project,
  },
  data() {
    return {
      projectData: [
        {
          title: "First Person Shooter Unreal Engine",
          description:
            "This is my second Unreal Engine project, in this project you can see that it is comprised of C++ and UE Blueprints, this game is a single level prototype with multiple weapons and enemies. The enemies have varying speed, health, and damage amount to give the prototype some variety and depth. All firearms created stem from a base class I created and use line tracing from the crosshairs and the barrel tip and detect to see if there is blocking hits that are different to indicate that there is a possible actor in the way of the barrel and the target destination, the bullet trails are created using textures from the barrel to the end point, followed by an impact to give the illusion of bullet impacts. To keep the project simple and quick to deploy the enemies were given only melee weapons and simple AI tasks and movement to create a quick and fun prototype.",
          youtubeLink: "https://www.youtube.com/embed/FcHFTqIKmGA",
          githubTitle: "View Shooter Project Repo",
          githubLink: "https://github.com/sir306/ShooterProject",
        },
        {
          title: "First Ultimate Unreal Engine Project",
          description:
            "This project was completed by following a Udemy tutorial that I purchased and was able to learn a lot and was introduced to Unreal Engine where I fell in love with game programming and C++. Some of the things learned in this course were: Actors, AI, Animations, Blueprints, C++, Collisions, Game Pause, Game Save, Level Transitioning, Packaging, UMG and so much more. The concept of this game is melee combat system where the player can pick up different weapons and fight spiders and golems, the player can also collect potions and coins.",

          githubTitle: "View First UE Project Repo",
          githubLink: "https://github.com/sir306/UltimateGameTutCleaned",
        },
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
