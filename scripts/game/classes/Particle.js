export class Particle {
  constructor({ position, velocity, radius, color }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = radius;
    this.color = color;
    this.opacity = 1;
  }

  draw({ spaceContext }) {
    spaceContext.save();
    spaceContext.globalAlpha = this.opacity;
    spaceContext.beginPath();
    spaceContext.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    spaceContext.fillStyle = this.color;
    spaceContext.fill();
    spaceContext.closePath();
    spaceContext.restore();
  }

  update({ spaceContext }) {
    this.draw({ spaceContext });
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.opacity -= 0.01;
  }
}
