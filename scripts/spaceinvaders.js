import { Player } from "./game/classes/Player";
import { createParticles } from "./game/methods/CreateParticle";
import { Grid } from "./game/classes/Grid";
import { Projectile } from "./game/classes/Projectile";

export function run() {
  // get canvas and 2d context
  const spaceCanvas = document.getElementById("space-canvas");
  const spaceContext = spaceCanvas.getContext("2d");
  // set dimensions of width and height of game
  spaceCanvas.width = innerWidth;
  spaceCanvas.height = innerHeight;

  // get navbar
  const navbar = document.getElementById("navbar");

  //get score point amount element
  const scoreEl = document.getElementById("scoreEl");

  // get the score p element
  const scorePEl = document.getElementById("scorePEl");

  // get pause, gameover and start menu
  const pauseMenu = document.getElementById("pausedMenu");
  const startMenu = document.getElementById("startMenu");
  const gameoverMenu = document.getElementById("gameOverMenu");

  // get paused score element
  const pausedScoreEl = document.getElementById("pausedScoreEl");
  // get the score gameover element
  const scoreGameOverEL = document.getElementById("gameOverScoreEl");

  // create new player
  const player = new Player({ spaceCanvas });
  // create const arrays for projectiles, grids, invaderProjectiles and particles
  const projectiles = [];
  const grids = [];
  const invaderProjectiles = [];
  const particles = [];

  // create key binding
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

  // create frames
  let frames = 0;
  let game = {
    over: false,
    active: false,
    newGame: false,
  };
  let score = 0;

  // function for invaders to shoot
  function invaderShoots(grid) {
    // select an invader
    let selectedInvader =
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)];
    // if selectedInvaders position is greater than 0 then they can shoot otherwise call invaderShoots again till one does
    if (selectedInvader.position.y > 0) {
      selectedInvader.shoot(invaderProjectiles);
    } else {
      invaderShoots(grid);
    }
  }

  // function for spawning invaders
  function spawnInvaders() {
    if (grids.length > 0) {
      // get last grid of invaders
      let lastGridInvaders = grids[grids.length - 1];
      // get top left invader and check to see if below screen - check position undefined first as value may not be assigned
      if (
        lastGridInvaders.invaders.length > 0 &&
        lastGridInvaders.invaders[0].position !== undefined &&
        lastGridInvaders.invaders[0].position.y > 0
      ) {
        grids.push(new Grid());
      }
    } else {
      // no invader grids spawn one
      grids.push(new Grid());
    }
  }

  // reset game
  function resetGame() {
    // splice existing data from arrays
    particles.splice(0, particles.length);
    grids.splice(0, grids.length);
    projectiles.splice(0, projectiles.length);
    invaderProjectiles.splice(0, invaderProjectiles.length);

    // center player and opacity to 1
    player.position.x = spaceCanvas.width / 2 - player.width / 2;
    player.opacity = 1;

    // reset score tag
    scoreEl.innerHTML = 0;
  }

  // animate function
  function animate() {
    // move navbar above screen if game active and move back if not
    if (game.active) {
      navbar.style.visibility = "hidden";
    } else {
      navbar.style.visibility = "visible";
      // game not active return stop animating
      return;
    }

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
      // invader projectile hit player?
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
        //pause animations
        setTimeout(() => {
          game.active = false;
        }, 2000);
        // display menu
        setTimeout(() => {
          gameoverMenu.style.opacity = 1;
        }, 2000);
        // edit game over score
        scoreGameOverEL.innerHTML = "Final Score: " + score;
        // destroy player
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
        // are invaders in view of screen
        if (grid.invaders[grid.invaders.length - 1].position.y > 0) {
          invaderShoots(grid);
        }
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
                // create particle explosion on invader
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
                } else {
                  grids.splice(gridIndex, 1);
                }
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
    spawnInvaders();

    frames++;
  }

  animate();

  // function for pause opacity
  const pauseOpacity = () => (game.active === true ? 1 : 0);
  // function pause game
  const pauseGame = () => (game.active === true ? false : true);

  addEventListener("keydown", ({ key }) => {
    if (game.over && key !== "Enter") return;
    // check if key is enter and the request is a new game
    else if (key === "Enter" && !game.newGame) {
      // set the opacitys for a new game
      scorePEl.style.opacity = 1;
      startMenu.style.opacity = 0;
      // set game settings
      game.newGame = true;
      game.active = true;
      // start animate loop
      animate();
    }
    // check to see if game restart
    else if (key === "Enter" && game.newGame && !game.active && game.over) {
      // hide game over menu
      gameoverMenu.style.opacity = 0;
      // reset score
      score = 0;
      // reset game
      resetGame();

      // set game settings
      game.newGame = true;
      game.active = true;
      game.over = false;
      // start animate loop
      animate();
    }
    // check game not still over and another key pressed
    else if (game.over) return;

    switch (key) {
      case "a":
        keys.a.pressed = true;
        break;
      case "d":
        keys.d.pressed = true;
        break;
      case " ":
        if (!keys.space.pressed) {
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
        }
        keys.space.pressed = true;

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
      case "Escape":
        if (game.newGame && !game.over) {
          pauseMenu.style.opacity = pauseOpacity();
          pausedScoreEl.innerHTML = "Current Score: " + score;
          console.log(pauseGame());
          game.active = pauseGame();
          animate();
        }
        break;
    }
  });
}
