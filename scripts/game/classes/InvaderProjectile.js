export class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 4;
    this.height = 12;
  }

  draw({ spaceContext }) {
    spaceContext.fillStyle = "lime";
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
