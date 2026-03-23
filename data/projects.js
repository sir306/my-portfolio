import heroImg from "~/assets/hero-crowd-simulation.png";
import heatmapImg from "~/assets/2d-heatmap-density.png";
import crowdImg from "~/assets/crowd-hallway-diverse.png";

export const Projects = [
  {
    title: "Project Mobius",
    description:
      "What started as my master's thesis became over two years of deep work — Project Mobius is a crowd simulation playback and analysis platform built in Unreal Engine 5.5. It handles 5,000+ pedestrian agents running through the MASS Entity framework, and grew to 118K+ lines of C++ across 8 runtime modules. I built an HDF5 data pipeline that turned out 6.69x faster than JSON for our use case, GPU-driven density heatmaps for real-time crowd analysis, ImPlot-based analytics dashboards, Niagara particle rendering, and full VR/XR support. It also imports geometry from multiple formats and runs CI/CD through GitHub Actions. This project taught me more about software architecture, build systems, and performance engineering than anything else I have worked on.",
    youtubeLink: "",
    githubTitle: "View Project Mobius Repo",
    githubLink: "https://github.com/sir306/ProjectMobius",
    languages: [
      "C++",
      "UE5.5",
      "MASS ECS",
      "Niagara",
      "HDF5",
      "ASSIMP",
      "OpenCV",
      "ImGui/ImPlot",
      "OpenXR",
      "CMake",
      "Python",
    ],
    isGameLink: false,
    images: [
      { src: heroImg, alt: "Project Mobius — crowd simulation building overview" },
      { src: heatmapImg, alt: "Project Mobius — 2D density heatmap visualization" },
      { src: crowdImg, alt: "Project Mobius — diverse crowd agents in hallway" },
    ],
    extraLinks: [
      {
        title: "Read Research Thesis",
        href: "https://ir.canterbury.ac.nz/items/0816750d-de14-4fce-82f1-9a42bf4b68ae",
      },
    ],
  },
  {
    title: "Google Earth Map Import & Texture Automation",
    description:
      "Getting 3D city data out of Google Earth and into Blender is a tedious, manual process — so I automated it. This Python pipeline takes RenderDoc captures of Google Earth 3D models and runs them through a 7-phase workflow: validation, discovery, import/merge, cleanup, texture packing, finalization, and collection management. It handles spatial partitioning to keep meshes organized, calculates texel density, and generates texture atlases. What used to take hours of repetitive clicking now runs end to end with minimal intervention.",
    youtubeLink: "",
    githubTitle: "View Automation Repo",
    githubLink:
      "https://github.com/sir306/GoogleEarth_MapImport_CapMerge_TexPack_Automation",
    languages: ["Python", "Blender API", "BMesh", "RenderDoc"],
    isGameLink: false,
  },
  {
    title: "Space Invaders",
    description:
      "A classic arcade game built with JavaScript and HTML5 Canvas — defend the earth from the alien invasion! Features particle effects, score tracking, and increasing difficulty. Give it a go below.",
    youtubeLink: "",
    githubTitle: "Play Game",
    githubLink: "/spaceinvaders",
    languages: ["JavaScript", "HTML5 Canvas"],
    isGameLink: true,
  },
];
