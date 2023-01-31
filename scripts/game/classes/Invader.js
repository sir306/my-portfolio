import { InvaderProjectile } from "./InvaderProjectile";
export class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.speed = 7;
    const image = new Image();
    image.src = "../invader.png";
    image.onload = () => {
      this.image = image;
      const scale = 1;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }
  draw({ spaceContext }) {
    spaceContext.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update({ velocity, spaceContext }) {
    if (!this.image) return;

    this.draw({ spaceContext });
    this.position.x += velocity.x;
    this.position.y += velocity.y;
  }
  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
  }
}
