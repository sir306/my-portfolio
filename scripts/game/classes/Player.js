export class Player {
  constructor({ spaceCanvas }) {
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.speed = 7;
    this.rotation = 0;
    this.opacity = 1;
    const image = new Image();
    image.src = "../spaceship.png";
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
  draw({ spaceContext, player }) {
    spaceContext.save();
    spaceContext.globalAlpha = this.opacity;
    spaceContext.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );
    spaceContext.rotate(this.rotation);
    spaceContext.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

    spaceContext.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    spaceContext.restore();
  }
  update({ spaceContext, player }) {
    if (!this.image) return;

    this.draw({
      spaceContext,
      player,
    });
    this.position.x += this.velocity.x;
  }
}
