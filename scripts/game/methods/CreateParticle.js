import { Particle } from "../classes/Particle";
export function createParticles({ object, color, particles }) {
  for (let i = 0; i < 25; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 5,
          y: (Math.random() - 0.5) * 5,
        },
        radius: Math.random() * 4,
        color: color || "#BAA0DE",
      })
    );
  }
}
