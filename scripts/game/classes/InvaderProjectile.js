export class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 3;
    this.height = 10;
  }

  draw({ spaceContext }) {
    spaceContext.fillStyle = "white";
    spaceContext.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ spaceContext }) {
    this.draw({ spaceContext });
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
