<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { run } from "~/scripts/spaceinvaders";
import backgroundMusic from "~/assets/audio/backgroundMusic.wav";
import { cleanupScene } from '~/utils/threeHelper'

useSeoMeta({
  title: "Space Invaders — Nick's Coding Website",
  description: 'Play a browser-based Space Invaders game built with HTML5 Canvas. Use A/D to move, Space to shoot.',
  ogTitle: "Space Invaders — Nick's Coding Website",
  ogDescription: 'Play Space Invaders in your browser — a retro arcade game built with HTML5 Canvas.',
  twitterTitle: "Space Invaders — Nick's Coding Website",
  twitterDescription: 'Play Space Invaders in your browser — a retro arcade game built with HTML5 Canvas.',
})
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
  DirectionalLight,
  BufferGeometry,
  PointsMaterial,
  Float32BufferAttribute,
  Points,
} from "three";

const canvas = ref(null)

// Variables
let renderer = null
let scene = null
let animationId = null
let camera = null
let gameCleanup = null; // Store the cleanup function

function onWindowResize() {
  if (camera && renderer) {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
  }
}

onMounted(() => {
    if(!process.client) return

    
    // Run the game script and store cleanup
    gameCleanup = run();

    // Three.js background setup
    scene = new Scene();
    camera = new PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    renderer = new WebGLRenderer({ canvas: canvas.value, powerPreference: "high-performance" });

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1);
    scene.add(light);

    const backLight = new DirectionalLight(0x11ffff, 1);
    backLight.position.set(0, 0, -1);
    scene.add(backLight);

    const starGeometry = new BufferGeometry();
    const starMaterial = new PointsMaterial({ color: 0x444444 }); // Dimmed stars directly
    const starVertices = [];

    // Further reduced star count for Space Invaders (was 6000)
    for (let i = 0; i < 3000; i++) {
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
      animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);

      frame += 0.01;

      stars.rotation.x -= 0.002;
      stars.rotation.y += (Math.random() - 0.5) * 0.001;
    }
    animate();

    window.addEventListener("resize", onWindowResize);
})

onBeforeUnmount(() => {
    cleanupScene(scene, renderer, animationId)
    window.removeEventListener("resize", onWindowResize);
     
    // Clean up Space Invaders game loop + listeners
    if (gameCleanup) {
        gameCleanup();
    }
});
</script>

<template>
  <div style="position: relative">
    <p id="scorePEl" class="font-ubuntu-mono">
      <span>Score:</span> <span id="scoreEl">0</span>
    </p>
    <div id="gameOverMenu">
      <div>
        <h2>Game Over</h2>
        <hr style="margin-bottom: 1.2em" />
        <p id="gameOverReasonEl">Reason</p>
        <p id="gameOverScoreEl">Final Score: 0</p>
        <p>Press 'Enter' to Restart</p>
        <h2 style="margin-top: 0.8em">The Controls</h2>
        <hr style="margin-bottom: 1.2em" />
        <p>Each Invader is worth 100 points</p>
        <p>Press 'A' and 'D' to move left and right</p>
        <p>Press 'Space' to shoot</p>
        <p>Press 'Esc' to pause</p>
      </div>
    </div>
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
        <!-- <audio id="backgroundMusic" autoplay loop>
          <source :src="backgroundMusic" type="audio/wav" />
        </audio> -->
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
#pausedMenu,
#gameOverMenu {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  width: 100%;
  z-index: 50;
  margin: auto;
}
#startMenu div,
#pausedMenu div,
#gameOverMenu div {
  width: fit-content;
  margin: auto;
  padding: 0.8em 1.8em;
  padding-bottom: 1.2em;
  border: 0.4em solid white;
  border-radius: 15%;
  background-color: #000000c4;
}
#startMenu h2,
#pausedMenu h2,
#gameOverMenu h2 {
  font-size: larger;
  font-weight: 800;
}
#startMenu p,
#pausedMenu p,
#gameOverMenu p {
  font-weight: 500;
}
#startMenu h2,
#startMenu p,
#pausedMenu h2,
#pausedMenu p,
#gameOverMenu h2,
#gameOverMenu p {
  letter-spacing: 0.2em;
  margin: auto;
  color: white;
  text-align: center;
}
#pausedMenu,
#gameOverMenu {
  opacity: 0;
}
</style>
