export const GameProjects = [
    {
      title: "Tsunami Evacuation Model Design at University of Canterbury (Internship)",
      description:
        "While this project is technically not a game, it fits this category well due to the technologies used and skills I learned developing this solution. This internship project was for the Civil and Natural Resource Engineering department at University of Canterbury, where I had to take 3D Google Earth images and convert them into a workable model to be used inside Unreal Engine with the goal to provide the researcher the ability to observe simulated human evacuation behavior in virtual reality in real time with a high-fidelity model. The solution I developed was an automated pipeline where the captured Google Earth 3D data can be processed inside of Blender and exported for use as an FBX file inside of Unreal Engine 5, with the goal to observe tsunami evacuations in virtual reality in real time, meaning the completed model had to run at a minimum 90 frames per second (to avoid issues such as motion sickness). Since completing this project, I have continued to develop the script further to produce a cleaner model and handle more errors that could occur on larger data sets and newer requirements of Unreal Engine’s Nanite feature to produce a visually correct model. Currently I am still making further changes to this project on a personal level and to make automated changes inside Unreal Engine and make further model optimizations in Blender, to provide users greater performance with the aim to allow lower end hardware to take advantage of this solution.",
      youtubeLink: "https://www.youtube.com/playlist?list=PLnOWkX48zOuSgW9azekEe4PEHlMdNO_JX",
      githubTitle: "View Google Earth Blender Automation Repo",
      githubLink: "https://github.com/sir306/GoogleEarth_MapImport_CapMerge_TexPack_Automation",
      languages: ["Python"],
    },

    {
      title: "First Person Shooter Unreal Engine",
      description:
        "This is my second Unreal Engine project, in this project you can see that it is comprised of C++ and UE Blueprints, this game is a single level prototype with multiple weapons and enemies. The enemies have varying speed, health, and damage amount to give the prototype some variety and depth. All firearms created stem from a base class I created and use line tracing from the crosshairs and the barrel tip and detect to see if there is blocking hits that are different to indicate that there is a possible actor in the way of the barrel and the target destination, the bullet trails are created using textures from the barrel to the end point, followed by an impact to give the illusion of bullet impacts. To keep the project simple and quick to deploy the enemies were given only melee weapons and simple AI tasks and movement to create a quick and fun prototype.",
      youtubeLink: "https://www.youtube.com/embed/FcHFTqIKmGA",
      githubTitle: "View Shooter Project Repo",
      githubLink: "https://github.com/sir306/ShooterProject",
      languages: ["C++"],
    },
    {
      title: "First Ultimate Unreal Engine Project",
      description:
        "This project was completed by following a Udemy tutorial that I purchased and was able to learn a lot and was introduced to Unreal Engine where I fell in love with game programming and C++. Some of the things learned in this course were: Actors, AI, Animations, Blueprints, C++, Collisions, Game Pause, Game Save, Level Transitioning, Packaging, UMG and so much more. The concept of this game is melee combat system where the player can pick up different weapons and fight spiders and golems, the player can also collect potions and coins.",

      githubTitle: "View First UE Project Repo",
      githubLink: "https://github.com/sir306/UltimateGameTutCleaned",
      languages: ["C++"],
    },
    {
      title: "Speedy Demon Racer",
      description:
        "This project was a school project for the game module, in this project the game engine used was GODOT, where the game is scripted using GD script. The game features two playable levels and a tutorial level, the objective of game is to race around the track avoiding explosive dangers and negative shield power ups, which cause the shield around the race track to fail and start to shrink allowing the lava in. The player is racing against the clock to the next beacon on the track and will loose the game if the clock runs out. From this project I was able to learn some core skills such as animations, collisions, game design and game optimization.",

      githubTitle: "View Speed Demon Racer Repo",
      githubLink:
        "https://github.com/sir306/IT6034_Project_SpeedyDemonRacerGame",
      languages: ["GDScript"],
    },
  ];
