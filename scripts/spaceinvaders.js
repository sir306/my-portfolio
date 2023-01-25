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
      this.speed = 7;
      this.rotation = 0;
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

      spaceContext.save();
      spaceContext.translate(player.position.x + player.width /2, player.position.y + player.height /2);
      spaceContext.rotate(this.rotation);
      spaceContext.translate(-player.position.x - player.width /2, -player.position.y - player.height /2);

      spaceContext.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
    );
      
      spaceContext.restore();
    
    }
    update(){
      if(!this.image) return

      this.draw();
      this.position.x += this.velocity.x
      
    }
  }

  class Projectile{
    constructor({position, velocity}){
      this.position = position;
      this.velocity = velocity;

      this.radius = 3;
    }

    draw(){
      spaceContext.beginPath();
      spaceContext.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      spaceContext.fillStyle = 'red';
      spaceContext.fill();
      spaceContext.closePath();
    }

    update(){
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }

  class Invader {

    constructor() {
      this.velocity = {
        x: 0,
        y: 0,
      };
      this.speed = 7;
      const image = new Image();
      image.src = "./invader.png";
      image.onload = () => {
        this.image = image;
        const scale = 1;
        this.width = image.width * scale;
        this.height = image.height * scale;
        this.position = {
          x: spaceCanvas.width / 2 - this.width / 2,
          y: spaceCanvas.height / 2,
        };
      };
    }
    draw() {
      spaceContext.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
    );   
    }
    update(){
      if(!this.image) return

      this.draw();
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
      
    }
  }

  const player = new Player();
  const projectiles = [];
  const invader = new Invader();
  

  const keys = {
    a:{
      pressed:false
    },
    d:{
      pressed:false
    },
    space:{
      pressed:false
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    spaceContext.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);
    invader.update();
    player.update();
    projectiles.forEach((projectile, index) =>{
      if(projectile.position.y + projectile.radius <= 0){
        setTimeout(()=>{projectiles.splice(index, 1)},0)
      }
      else{
        projectile.update();
      }
    });
    if(keys.a.pressed && player.position.x >= 0){
      player.velocity.x = - player.speed;
      player.rotation = -0.15;
    } else if(keys.d.pressed  && player.position.x + player.width <= spaceCanvas.width){
      player.velocity.x =  player.speed;
      player.rotation = 0.15;
    } else if(keys.space.pressed){
      
    }
    else{
      player.velocity.x = 0
      player.rotation = 0
    }

  }

  animate();

  addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "a":        
        keys.a.pressed = true
        break;
      case "d":  
        keys.d.pressed = true
        break;
      case " ":
        keys.space.pressed = true
        projectiles.push(
        new Projectile({
            position:{
              x:player.position.x + player.width / 2,
              y:player.position.y,
            },
            velocity:{
              x:0,
              y:-10
            }
          })
      )
        break;
    }
  });
  addEventListener("keyup", ({ key }) => {
    switch (key) {
      case "a":        
        keys.a.pressed = false
        break;
      case "d":
        keys.d.pressed = false
        break;
      case " ":
        keys.space.pressed = false
        break;
    }
  });
}
