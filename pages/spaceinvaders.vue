<template>
  <div style="position: relative">
    <p id="scorePEl" class="font-ubuntu-mono">
      <span>Score:</span> <span id="scoreEl">0</span>
    </p>
    <div id="pausedMenu">
      <div>
        <h2>Game Paused</h2>
        <hr style="margin-bottom: 1.2em" />
        <p id="pausedScoreEl">Current Score: 0</p>
        <p>Press 'Esc' to Resume</p>
      </div>
    </div>
    <div id="startMenu">
      <div>
        <h2>The Controls</h2>
        <hr style="margin-bottom: 1.2em" />
        <p>Destroy as many Invaders as you can!</p>
        <p>Each Invader is worth 100 points</p>
        <p>Press 'A' and 'D' to move left and right</p>
        <p>Press 'Space' to shoot</p>
        <p>Press 'Esc' to pause</p>
        <p>Good luck and enjoy, Press 'Enter' to start!</p>
      </div>
    </div>
    <canvas ref="canvas"></canvas>
    <canvas
      class="space"
      id="space-canvas"
      style="left: 0px; top: 0px; z-index: 10; position: absolute"
    ></canvas>
  </div>
</template>

<script>
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { run } from "../scripts/spaceinvaders";
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
    run();
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

      stars.rotation.x -= 0.002;
      stars.rotation.y += (Math.random() - 0.5) * 0.001;
    }
    animate();

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(outerWidth, outerHeight);
    });
  },

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
};
</script>
<style>
#scorePEl {
  position: fixed;
  z-index: 10;
  color: white;
  left: 2%;
  top: 2%;
  font-size: 14px;
  opacity: 0;
}
#startMenu,
#pausedMenu {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  width: 100%;
  z-index: 50;
  margin: auto;
}
#startMenu div,
#pausedMenu div {
  width: fit-content;
  margin: auto;
  padding: 0.8em 1.8em;
  padding-bottom: 1.2em;
  border: 0.4em solid white;
  border-radius: 15%;
  background-color: #00000080;
}
#startMenu h2,
#pausedMenu h2 {
  font-size: larger;
  font-weight: 800;
}
#startMenu p,
#pausedMenu p {
  font-weight: 500;
}
#startMenu h2,
#startMenu p,
#pausedMenu h2,
#pausedMenu p {
  letter-spacing: 0.2em;
  margin: auto;
  color: white;
  text-align: center;
}
#pausedMenu {
  opacity: 0;
}
</style>
