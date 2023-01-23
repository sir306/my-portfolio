<template>
  <canvas id="space-canvas"></canvas>
</template>

<script>
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import spaceshipImg from "~/assets/spaceship.png";

export default {
  mounted() {
    const spaceCanvas = document.getElementById("space-canvas");
    const spaceContext = spaceCanvas.getContext("2d");

    spaceCanvas.width = innerWidth;
    spaceCanvas.height = innerHeight;

    class Player {
      constructor() {
        this.velocity = {
          x: 0,
          y: 0,
        };
        const image = new Image();
        image.src = spaceshipImg;

        this.image = image;
        const scale = 0.15;
        this.width = image.width * scale;
        this.height = image.height * scale;
        this.position = {
          x: spaceCanvas.width / 2 - this.width / 2,
          y: spaceCanvas.height - this.height - 50,
        };
      }

      draw() {
        // spaceContext.fillStyle = "red";
        // spaceContext.fillRect(
        //   this.position.x,
        //   this.position.y,
        //   this.width,
        //   this.height
        // );
        if (this.image) {
          spaceContext.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
          );
        }
      }
    }

    const player = new Player();

    player.draw();

    function animate() {
      requestAnimationFrame(animate);
      spaceContext.fillStlye = "black";
      spaceContext.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height);
      player.draw();
    }

    animate();

    addEventListener("keydown", () => {
      console.log("keydown");
    });

    // let scene, camera, renderer;

    // scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xddddddd);

    // camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 1, 5000);
    // let hlight = new THREE.AmbientLight(0x404040, 100);
    // scene.add(hlight);

    // var directionalLight = new THREE.DirectionalLight(0xffffff, 100);
    // directionalLight.position.set(0, 1, 0);
    // directionalLight.castShadow = true;
    // scene.add(directionalLight);

    // renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setSize(innerWidth, innerHeight);
    // document.body.appendChild(renderer.domElement);

    // const loader = new GLTFLoader();
    // loader.load(
    //   "./GLTF_EMBEDDED/Intergalactic_Spaceships_Version_2.gltf",
    //   function (gltf) {
    //     const content = gltf.scene || gltf.scenes[0];

    //     scene.add(content),
    //       (xhr) => {
    //         console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    //       },
    //       (error) => {
    //         console.log(error);
    //       };
    //   }
    // );

    // window.addEventListener("resize", onWindowResize, false);
    // function onWindowResize() {
    //   camera.aspect = window.innerWidth / window.innerHeight;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(window.innerWidth, window.innerHeight);
    //   render();
    // }
    // function render() {
    //   renderer.render(scene, camera);
    // }
    // render();
  },
};
</script>
