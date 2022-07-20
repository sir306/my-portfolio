<template>
  <div>
    <canvas ref="canvas" style="display: block"></canvas>
    <div
      id="container"
      class="absolute w-full max-w-6xl px-6 my-2 overflow-y-auto h-4/5"
    >
      <h2
        ref="title"
        class="text-white font-exo2 text-3xl md:text-5xl uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        About Me
      </h2>
      <hr
        ref="titleLine"
        class="opacity-0 mb-5"
        style="transform: translateY(60px)"
      />
      <h4
        ref="employmentStatusTitle"
        class="text-white text-sm md:text-md tracking-wider uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        {{ this.currentEmployment }}
      </h4>
      <h4
        ref="shortTitle"
        class="text-white font-exo2 text-lg md:text-2xl uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        Short and Sweet
      </h4>
      <div v-for="paragraph in shortBlurb">
        <Blurb :paragraph="paragraph.paragraph1" />
        <Blurb :paragraph="paragraph.paragraph2" />
      </div>
      <hr
        ref="breakerLine"
        class="opacity-0 mb-5"
        style="transform: translateY(60px)"
      />
      <h4
        ref="longTitle"
        class="text-white font-exo2 text-lg md:text-2xl uppercase opacity-0 mb-3"
        style="transform: translateY(30px)"
      >
        Want to know more of my story?
      </h4>
      <div v-for="paragraph in longBlurb">
        <Blurb :paragraph="paragraph.paragraph1" />
        <Blurb :paragraph="paragraph.paragraph2" />
        <Blurb :paragraph="paragraph.paragraph3" />
        <Blurb :paragraph="paragraph.paragraph4" />
      </div>
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
import Blurb from "../components/Blurb.vue";

export default {
  components: {
    Blurb,
  },
  data() {
    return {
      shortBlurb: [
        {
          paragraph1:
            "So, to start this off, my name is Nicholas Harding I am thirty years old and live in Christchurch New Zealand. I recently began my coding journey in 2020 and started to learn various coding languages and practices from Whitecliffe College. During my time there I was able to complete two diplomas and currently enrolled into the Bachelor of Information Technology in Software Development, during this time I have spent countless hours in extra study learning more languages and skills through learning mediums such as Udemy and instructive YouTube videos, as coding is a passion that I am driven to grow and develop myself further in.",
          paragraph2:
            "In my coding experience I have taken a real shine to Game Development, Full Stack Development and Mobile Development, these are three areas that I have explored so far during my time of study and are areas that I enjoy the most because I do enjoy all types of programming that I have done so far.",
        },
      ],
      longBlurb: [
        {
          paragraph1:
            "You may be wondering what I was doing prior to 2020 and work I may have been involved in, well to put simply I have been a wide range of careers since 2010 varying from different forms of laboring jobs, different security jobs such a site protection and hospitality security, my last job was in construction as a steel fixer which came to an end when I injured my knee.",
          paragraph2:
            "After the injury I ended up requiring some surgery and committed to rebuilding my knee with lots of physio, once cleared and after some time I decided to go skiing and ended up epically wiping out and bending my knee in every other direction that it was supposed to go (I know Ouch! Eww!) which kind of ended my journey in the world of a physically demanding work i.e., steel fixing, so I was left with a broken leg for some time and had to figure out what I can do to make myself a career in something I’d enjoy doing, be able to provide for my family, and finally something that would stimulate me mentally. Which after evaluating the choices I had was an easy one to figure out as I had always wanted to get into coding.",
          paragraph3:
            "Some obstacles I had to over comer was that I had a big problem of imposter syndrome at the start of my learning journey and being nearly thirty at the time I decided to do this was a big hurdle for me to overcome as most of my peers would be fresh out of school. I didn’t let this deter me and pushed through knowing that my only challenge was me, once I overcame this and learnt that I can do this, I developed a real drive in bettering my knowledge in a variety of different coding languages and life skills that I can offer to employers, fellow developers and clients that will be an asset to them.",
          paragraph4:
            "What keeps me going and pushing is that I really do love learning this stuff and I just can’t get enough, sure there are other factors to this drive like expecting my first child in August has had a big impact in this but in short its easy to learn something you enjoy doing. I hope this wee blurb hasn’t bored you too much but felt anyone who wants to know me and check me out that these are some things you should know and want you to know, so thank you if you took time to read this.",
        },
      ],
      currentEmployment:
        "Employment Status: Currently Seeking Employment or Internship",
    };
  },

  mounted() {
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

    gsap.to(this.$refs.title, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(this.$refs.employmentStatusTitle, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(this.$refs.shortTitle, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(this.$refs.longTitle, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(this.$refs.titleLine, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
    gsap.to(this.$refs.breakerLine, {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: "expo",
    });
  },
};
</script>
