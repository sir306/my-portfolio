<template>
  <div>
    <canvas ref="canvas"></canvas>
    <div
      id="container-home"
      class="absolute text-white text-center w-full max-w-2xl px-6"
    >
      <h1
        id="nicholas"
        class="font-ubuntu-mono text-2xl uppercase tracking-wide mb-2 opacity-0"
        style="transform: translateY(60px)"
      >
        Nicholas Harding
      </h1>
      <p
        id="introText"
        class="font-exo2 text-4xl opacity-0"
        style="transform: translateY(60px)"
      >
        AN ASPIRING FULLSTACK, GAME & MOBILE DEVELOPER.<br />
        A QUEST TO LEAVE A LEGACY, FOR OTHERS TO FOLLOW.
      </p>

      <a
        id="viewWorkBTN"
        href="#portfolio"
        class="opacity-0 border px-4 py-1 rounded-lg text-2xl font-ubuntu-mono uppercase mt-8 hover:bg-white hover:text-gray-800 inline-block"
        style="cursor: pointer; transform: translateY(60px)"
      >
        View Work
      </a>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";
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
  mounted() {
    // const dat = require("dat.gui");
    // const gui = new dat.GUI();
    const world = {
      plane: {
        width: 400,
        height: 400,
        widthSegments: 50,
        heightSegments: 50,
      },
    };
    // gui.add(world.plane, "width", 1, 1000).onChange(generatePlane);
    // gui.add(world.plane, "height", 1, 1000).onChange(generatePlane);
    // gui.add(world.plane, "widthSegments", 1, 500).onChange(generatePlane);
    // gui.add(world.plane, "heightSegments", 1, 500).onChange(generatePlane);

    function generatePlane() {
      planeMesh.geometry.dispose();
      planeMesh.geometry = new PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments
      );

      // vertice position randomization
      const { array } = planeMesh.geometry.attributes.position;
      const randomValues = [];
      for (let i = 0; i < array.length; i++) {
        if (i % 3 === 0) {
          const x = array[i];
          const y = array[i + 1];
          const z = array[i + 2];

          array[i] = x + (Math.random() - 0.5) * 3;
          array[i + 1] = y + (Math.random() - 0.5) * 3;
          array[i + 2] = (z + Math.random() - 0.5) * 3;
        }

        randomValues.push(Math.random() * Math.PI * 2);
      }

      planeMesh.geometry.attributes.position.randomValues = randomValues;

      planeMesh.geometry.attributes.position.originalPosition =
        planeMesh.geometry.attributes.position.array;

      // color attribute
      const colors = [];
      for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0, 0.19, 0.4);
      }

      planeMesh.geometry.setAttribute(
        "color",
        new BufferAttribute(new Float32Array(colors), 3)
      );
    }

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

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(devicePixelRatio);

    const planeGeometry = new PlaneGeometry(1);
    const planeMaterial = new MeshPhongMaterial({
      side: DoubleSide,
      flatShading: FlatShading,
      vertexColors: true,
    });
    const planeMesh = new Mesh(planeGeometry, planeMaterial);
    scene.add(planeMesh);

    generatePlane();

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1);
    scene.add(light);

    const backLight = new DirectionalLight(0xffffff, 1);
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

    const mouse = {
      x: undefined,
      y: undefined,
    };

    let frame = 0;

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);

      frame += 0.01;
      const { array, originalPosition, randomValues } =
        planeMesh.geometry.attributes.position;
      for (let i = 0; i < array.length; i += 3) {
        // x
        array[i] =
          originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01;

        // y
        array[i + 1] =
          originalPosition[i + 1] +
          Math.sin(frame + randomValues[i + 1]) * 0.01;

        // y
        array[i + 2] =
          originalPosition[i + 2] +
          Math.sin(frame + randomValues[i + 2]) * 0.006;
      }
      planeMesh.geometry.attributes.position.needsUpdate = true;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planeMesh);
      if (intersects.length > 0) {
        const { color } = intersects[0].object.geometry.attributes;

        color.setX(intersects[0].face.a, 0.1);
        color.setY(intersects[0].face.a, 0.5);
        color.setZ(intersects[0].face.a, 1);

        color.setX(intersects[0].face.b, 0.1);
        color.setY(intersects[0].face.b, 0.5);
        color.setZ(intersects[0].face.b, 1);

        color.setX(intersects[0].face.c, 0.1);
        color.setY(intersects[0].face.c, 0.5);
        color.setZ(intersects[0].face.c, 1);

        intersects[0].object.geometry.attributes.color.needsUpdate = true;

        const initialColor = {
          r: 0,
          g: 0.19,
          b: 0.4,
        };
        const hoverColor = {
          r: 0.1,
          g: 0.5,
          b: 1,
        };

        gsap.to(hoverColor, {
          r: initialColor.r,
          g: initialColor.g,
          b: initialColor.b,
          onUpdate: () => {
            color.setX(intersects[0].face.a, hoverColor.r);
            color.setY(intersects[0].face.a, hoverColor.g);
            color.setZ(intersects[0].face.a, hoverColor.b);

            color.setX(intersects[0].face.b, hoverColor.r);
            color.setY(intersects[0].face.b, hoverColor.g);
            color.setZ(intersects[0].face.b, hoverColor.b);

            color.setX(intersects[0].face.c, hoverColor.r);
            color.setY(intersects[0].face.c, hoverColor.g);
            color.setZ(intersects[0].face.c, hoverColor.b);
          },
        });
      }

      stars.rotation.x += 0.0007;
      stars.rotation.y += Math.cos(Math.random() - 0.5) * 0.0006;
    }

    animate();

    addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / innerHeight) * 2 + 1;
    });

    gsap.to("#nicholas", {
      opacity: 1,
      duration: 1.5,
      y: 0,
      ease: "expo",
    });

    gsap.to("#introText", {
      opacity: 1,
      duration: 1.5,
      delay: 0.3,
      y: 0,
      ase: "expo",
    });

    gsap.to("#viewWorkBTN", {
      opacity: 1,
      duration: 1.5,
      delay: 0.6,
      y: 0,
      ase: "expo",
    });

    document
      .querySelector("#viewWorkBTN")
      .addEventListener("click", (event) => {
        event.preventDefault();
        gsap.to("#container-home", {
          opacity: 0,
        });
        gsap.to(camera.position, {
          z: 25,
          ease: "power3.inOut",
          duration: 1.5,
        });
        gsap.to(camera.rotation, {
          x: 1.57,
          ease: "power3.inOut",
          duration: 2,
        });
        gsap.to(camera.position, {
          y: 1000,
          ease: "power3.in",
          duration: 1.2,
          delay: 2,
          onComplete: () => {
            this.$router.push("/work");
          },
        });
        gsap.to("#navbar", {
          y: -20,
          duration: 2,
          ease: "power3.inOut",
        });
        gsap.to("#navbar", {
          y: 0,
          duration: 2,
          ease: "power3.inOut",
          delay: 2,
        });
        gsap.to("#homeBtn", {
          opacity: 0,
          duration: 2,
          ease: "power3.inOut",
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
      });

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });
  },
};
</script>
