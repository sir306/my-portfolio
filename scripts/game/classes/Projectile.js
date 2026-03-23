export class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 6;
  }

  draw({ spaceContext }) {
    spaceContext.beginPath();
    spaceContext.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    spaceContext.fillStyle = "cyan";
    spaceContext.fill();
    spaceContext.closePath();
  }

  update({ spaceContext }) {
    this.draw({ spaceContext });
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
