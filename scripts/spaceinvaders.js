import { Player } from "./game/classes/Player";
import { createParticles } from "./game/methods/CreateParticle";
import { Grid } from "./game/classes/Grid";
import { Projectile } from "./game/classes/Projectile";

export function run() {
  const spaceCanvas = document.getElementById("space-canvas");
  const spaceContext = spaceCanvas.getContext("2d");

  spaceCanvas.width = innerWidth;
  spaceCanvas.height = innerHeight;
  const scoreEl = document.getElementById("scoreEl");

  const player = new Player({ spaceCanvas });
  const projectiles = [];
  const grids = [];
  const invaderProjectiles = [];
  const particles = [];

  const keys = {
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    space: {
      pressed: false,
    },
  };

  let frames = 0;
  let randomInterval = Math.floor(Math.random() * 500 + 500);
  let game = {
    over: false,
    active: true,
  };
  let score = 0;

  function animate() {
    if (!game.active) return;
    requestAnimationFrame(animate);
    spaceContext.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);

    player.update({ spaceContext, player });

    particles.forEach((particle, i) => {
      if (particle.opacity <= 0) {
        setTimeout(() => {
          particles.splice(i, 1);
        }, 0);
      } else {
        particle.update({ spaceContext });
      }
    });

    invaderProjectiles.forEach((invaderProjectile, index) => {
      if (
        invaderProjectile.position.y + invaderProjectile.height >=
        spaceCanvas.height
      ) {
        setTimeout(() => {
          invaderProjectiles.splice(index, 1);
        }, 0);
      } else {
        invaderProjectile.update({ spaceContext });
      }
      if (
        invaderProjectile.position.y + invaderProjectile.height >=
          player.position.y &&
        invaderProjectile.position.x + invaderProjectile.width >=
          player.position.x &&
        invaderProjectile.position.x <= player.position.x + player.width
      ) {
        // projectile hits player
        setTimeout(() => {
          invaderProjectiles.splice(index, 1);
          player.opacity = 0;
          game.over = true;
        }, 0);
        setTimeout(() => {
          game.active = false;
        }, 2000);

        console.log("player hit");
        createParticles({
          object: player,
          color: "white",
          particles,
        });
      }
    });

    projectiles.forEach((projectile, index) => {
      if (projectile.position.y + projectile.radius <= 0) {
        setTimeout(() => {
          projectiles.splice(index, 1);
        }, 0);
      } else {
        projectile.update({ spaceContext });
      }
    });

    grids.forEach((grid, gridIndex) => {
      grid.update({ spaceCanvas });

      // spawn invader projectiles
      if (frames % 100 === 0 && grid.invaders.length > 0) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
          invaderProjectiles
        );
      }

      for (let i = grid.invaders.length - 1; i >= 0; i--) {
        const invader = grid.invaders[i];
        invader.update({ velocity: grid.velocity, spaceContext });

        // projectiles hit enemy
        projectiles.forEach((projectile, j) => {
          if (
            projectile.position.y - projectile.radius <=
              invader.position.y + invader.height &&
            projectile.position.x + projectile.radius >= invader.position.x &&
            projectile.position.x - projectile.radius <=
              invader.position.x + invader.width &&
            projectile.position.y + projectile.radius >= invader.position.y
          ) {
            setTimeout(() => {
              const invaderFound = grid.invaders.find(
                (invader2) => invader2 === invader
              );
              const projectileFound = projectiles.find(
                (projectile2) => projectile2 === projectile
              );
              // remove invader and projectile
              if (invaderFound && projectileFound) {
                // add score
                score += 100;
                scoreEl.innerHTML = score;
                createParticles({
                  object: invader,
                  particles,
                });

                grid.invaders.splice(i, 1);
                projectiles.splice(j, 1);

                if (grid.invaders.length > 0) {
                  const firstInvader = grid.invaders[0];
                  const lastInvader = grid.invaders[grid.invaders.length - 1];

                  grid.width =
                    lastInvader.position.x -
                    firstInvader.position.x +
                    lastInvader.width;
                  grid.position.x = firstInvader.position.x;
                }
              } else {
                grids.splice(gridIndex, 1);
              }
            }, 0);
          }
        });
      }
    });

    if (keys.a.pressed && player.position.x >= 0) {
      player.velocity.x = -player.speed;
      player.rotation = -0.15;
    } else if (
      keys.d.pressed &&
      player.position.x + player.width <= spaceCanvas.width
    ) {
      player.velocity.x = player.speed;
      player.rotation = 0.15;
    } else if (keys.space.pressed) {
    } else {
      player.velocity.x = 0;
      player.rotation = 0;
    }

    // spawn enemies
    if (frames % randomInterval === 0) {
      grids.push(new Grid());
      randomInterval = Math.floor(Math.random() * 500 + 500);
      frames = 0;
    }

    frames++;
  }

  animate();

  addEventListener("keydown", ({ key }) => {
    if (game.over) return;
    switch (key) {
      case "a":
        keys.a.pressed = true;
        break;
      case "d":
        keys.d.pressed = true;
        break;
      case " ":
        keys.space.pressed = true;
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 2,
              y: player.position.y,
            },
            velocity: {
              x: 0,
              y: -10,
            },
          })
        );
        break;
    }
  });
  addEventListener("keyup", ({ key }) => {
    switch (key) {
      case "a":
        keys.a.pressed = false;
        break;
      case "d":
        keys.d.pressed = false;
        break;
      case " ":
        keys.space.pressed = false;
        break;
    }
  });
}
