export function run() {
  const spaceCanvas = document.getElementById(
    "space-canvas"
  );

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
      image.src = "./spaceship.png";
      image.onload = () => {
        this.image = image;
        const scale = 0.15;
        this.width = image.width * scale;
        this.height = image.height * scale;
        this.position = {
          x: spaceCanvas.width / 2 - this.width / 2,
          y: spaceCanvas.height - this.height - 50,
        };
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
    spaceContext.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);
    player.draw();
  }
  animate();
  addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "a":
        console.log("left");
        break;
      case "d":
        console.log("right");
        break;
    }
  });
}
