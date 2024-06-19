/**@type {HTMLCanvasElement} */
window.addEventListener("load",function(){
    let username=null
    function playerInfo(){
       const submit=document.querySelector('#submit')
       const player=document.querySelector('#username')
       submit.disabled=true;
       player.addEventListener('input', () => {
        submit.disabled = player.value.trim() === "";
    });
       submit.addEventListener('click',(e)=>{
        e.preventDefault()
        username=player.value.trim();
        const form=document.querySelector('form')
        document.querySelector('body').removeChild(form)
        animate()
       }
    )
    }
    playerInfo()
    const replay=this.document.querySelector('#restart')
    replay.addEventListener('click',()=>{
        location.reload()
    })
    let isPaused=false;
    const pause=this.document.querySelector('#pause')
    pause.addEventListener('click',()=>{
          isPaused=(isPaused)?false:true;
          if(isPaused){
            pause.innerHTML='RESUME'
          }
          else{
            pause.innerHTML='PAUSE'
            animate()
          }
    })
    const canvas=document.querySelector("#canvas");
    const ctx=canvas.getContext("2d");
    CANVAS_WIDTH=canvas.width=1000;
    CANVAS_HEIGHT=canvas.height=500;
   const zombiesArray=["male/Walk (1).png",
                        "male/Walk (2).png",
                        "male/Walk (3).png",
                        "male/Walk (4).png",
                        "male/Walk (5).png",
                        "male/Walk (6).png",
                        "male/Walk (7).png",
                        "male/Walk (8).png",
                        "male/Walk (9).png",
                        "male/Walk (10).png"               
    ]
    const zombieImages = [];
    const zombies=[]
    const blockImage=new Image()
    blockImage.src="stone.jpg"
    const blocks=[]
    let blockPositions=[CANVAS_WIDTH/2-300,CANVAS_WIDTH/2-200,CANVAS_WIDTH/2+130,CANVAS_WIDTH/2+230]
    let zombieWaveInterval=7000;
    let imagesLoaded = 0;
    const mouse={x:null,y:null};
    let gameFrame = 0;
    let scores=[]
    const playerImage=new Image();
    playerImage.src="flatboy/png/Idle (1).png"
const playerWalkArray=[
"flatboy/png/Walk (1).png",
"flatboy/png/Walk (2).png",
"flatboy/png/Walk (3).png",
"flatboy/png/Walk (4).png",
"flatboy/png/Walk (5).png",
"flatboy/png/Walk (6).png",
"flatboy/png/Walk (7).png",
"flatboy/png/Walk (8).png",
"flatboy/png/Walk (9).png",
"flatboy/png/Walk (10).png",
"flatboy/png/Walk (11).png",
"flatboy/png/Walk (12).png",
"flatboy/png/Walk (13).png",
"flatboy/png/Walk (14).png",
"flatboy/png/Walk (15).png"]
const playerJumpArray=[
      /*  "https://i.ibb.co/QYdHvRL/Jump-1.png",
        "https://i.ibb.co/b7fGzhb/Jump-2.png",
        "https://i.ibb.co/z8R8YPq/Jump-3.png", 
        "https://i.ibb.co/6gVmzQK/Jump-4.png",
        "https://i.ibb.co/dQNPK2c/Jump-5.png",
        "https://i.ibb.co/Kr66Gzg/Jump-6.png",
        "https://i.ibb.co/rZqjGwm/Jump-7.png", 
        "https://i.ibb.co/r3DHrgD/Jump-8.png",
        "https://i.ibb.co/Xxgv0VJ/Jump-9.png",
        "https://i.ibb.co/gShbnyv/Jump-11.png",
        "https://i.ibb.co/BrL8KJs/Jump-10.png",*/
        "flatboy/png/Jump (2).png"
        /*"https://i.ibb.co/NNrQLYf/Jump-13.png",
        "https://i.ibb.co/9ZsJtN5/Jump-14.png",
        "https://i.ibb.co/vPjK2Lc/Jump-15.png",*/
    ]
    const playerWalkImages=[]
    const playerJumpImages=[]
    playerWalkArray.forEach(src => {
        const img = new Image();
        img.src = src;
        playerWalkImages.push(img);
    });
    playerJumpArray.forEach(src => {
        const img = new Image();
        img.src = src;
        playerJumpImages.push(img);
    });
    // Input Handler
        class InputHandler {
            constructor() {
                this.keys = [];
                this.lastWave=0;
                this.waveInterval=60000;
                window.addEventListener('keydown', this.keydownHandler.bind(this));
                window.addEventListener('keyup', this.keyupHandler.bind(this));
            }
    
            keydownHandler(e) {
                if ((e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') &&
                    this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                    if(e.key==='ArrowRight' && this.keys.indexOf('ArrowLeft') === -1){
                        player.gun.angle = 0;
                    }
                    if(e.key==='ArrowLeft'  && this.keys.indexOf('ArrowRight') === -1){
                        player.gun.angle = Math.PI;
                    }
                    console.log(this.keys)
                }
    
           }
            
    
            keyupHandler(e) {
                if (e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') {
                    if(input.keys.indexOf('ArrowRight') > -1 && input.keys.indexOf('ArrowLeft') > -1){
                        if(e.key==='ArrowLeft'){
                            player.gun.angle=0
                        }
                        else if(e.key==='ArrowRight'){
                            player.gun.angle=Math.PI
                        }
                    }
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            }
            update() {
               
                  const currentTime = Date.now();
                  if (currentTime - player.gun.lastShotTime >= player.gun.shotInterval) {
                    player.gun.bullets.push(new Bullet(player.gun.angle));
                    player.gun.lastShotTime = currentTime; 
                  }
              }
        }
    const input=new InputHandler()
    //PLAYER class
    const gravity=1;
    class Player{
        /*constructor(){
            this.width=146/3
            this.height=245/3
            this.x=CANVAS_WIDTH/2-this.width/2
            this.y=CANVAS_HEIGHT-this.height-200
            this.speedx=0;
            this.speedy=0;
            this.health=100;
            this.weight=0.5;
            this.onGround=true;
        }
        draw(){
             ctx.strokeRect(this.x,this.y,this.width,this.height)
             ctx.drawImage(playerImage,0,0,146*2,244*2,this.x,this.y,this.width,this.height)
        }*/
       constructor(){
        this.width=146/3
        this.height=245/3
        this.position={
            x:CANVAS_WIDTH/2-this.width/2,
            y:CANVAS_HEIGHT-this.height-200//CANVAS_HEIGHT-230
        }
        this.velocity={
            x:0,
            y:0
        }
        this.gun   
        this.frameW = 0;     
        this.frameI=0;  
        this.left=true;   
        this.health=500;
        this.score=0;                                                                                                                                                                                                                                                  
    }
    
    update(input, blocks) {
        if(gameFrame%2===0){
        this.handleInput(input);
        this.handlePhysics(blocks);
        this.handleCollision()
        }
        this.gun.update()
        this.draw();
    }
    handleCollision(){
        blocks.forEach(block=>{
            if(!block.destroyed){
            if(this.position.x +10< block.x + block.width &&
                this.position.x + this.width -10> block.x &&
                this.position.y < block.y + block.height &&
                this.position.y + this.height > block.y){
                     this.resolveXCollision(block)
                }
            }
        })
        zombies.forEach(zombie => {
            if( zombie.x + zombie.marginx < this.position.x + this.width-10 &&
                zombie.x + zombie.marginx + zombie.width > this.position.x+10 &&
                zombie.y+10< this.position.y + this.height &&
                zombie.y + zombie.height > this.position.y &&
               !(this.velocity.y!==0 && this.velocity.x!==0)
            ){
                 this.health-=1
            }
            else if( zombie.x + zombie.marginx < this.position.x + this.width &&
                zombie.x + zombie.marginx + zombie.width > this.position.x &&
                zombie.y+10< this.position.y + this.height &&
                zombie.y+zombie.height > this.position.y &&
               (this.velocity.y!==0 && this.velocity.x!==0)
            ){
                 this.health-=1
            }
        })
    }
    resolveXCollision(block) {
        let overlapX = (this.position.x+10 + (this.width-20 )/ 2) - (block.x + block.width / 2);
        let halfWidths = ((this.width-20)/ 2) + (block.width / 2);
        this.velocity.x = 0;
        if (Math.abs(overlapX) < halfWidths) {
            let offsetX = halfWidths - Math.abs(overlapX);
    
            if (overlapX > 0) {
                this.position.x = block.x + block.width-10;
            } else {
                this.position.x = block.x - (this.width-20)-10;
            }
            
        }
    }
    handleInput(input) {
        if (input.keys.includes('ArrowRight') && input.keys.includes('ArrowLeft')) {
            this.velocity.x = 0;
          } else if (input.keys.includes('ArrowRight')) {
            this.velocity.x = 3;
          } else if (input.keys.includes('ArrowLeft')) {
            this.velocity.x = -3;
          } else {
            this.velocity.x = 0;
          }
        if (input.keys.includes('ArrowUp') && this.onGround) {
            this.velocity.y = -18;
        }
    }
    
    handlePhysics(blocks) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // Apply gravity
        if (!this.onGround) {
            this.velocity.y += gravity;
        }
        // Collision detection with blocks
        this.onGround = false;
        for (let block of blocks) {
            if ( !block.destroyed && this.position.y + this.height <= block.y &&
                this.position.y + this.height + this.velocity.y >= block.y &&
                this.position.x +10+ this.width-20> block.x &&
                this.position.x +10< block.x + block.width) {
                this.velocity.y = 0;
                this.onGround = true;
                this.position.y = block.y - this.height;
            }
        }
        // Boundary conditions
        if (this.position.y + this.height >= CANVAS_HEIGHT) {
            this.position.y = CANVAS_HEIGHT - this.height;
            this.velocity.y = 0;
            this.onGround = true;
        }
    
        if (this.position.x < 0) {
            this.position.x = 0;
        }
        if (this.position.x + this.width > CANVAS_WIDTH) {
            this.position.x = CANVAS_WIDTH - this.width;
        }
      }
        draw(){
            ctx.beginPath()
            ctx.strokeStyle='white'
            if(player.health<125){
                ctx.fillStyle='red'
            }
            else if(player.health<300){
                ctx.fillStyle='yellow'
            }
            else{
                ctx.fillStyle='green'
            }
            ctx.strokeRect(this.position.x+10,this.position.y-10,this.width-20,5)
            ctx.fillRect(this.position.x+10,this.position.y-10,((this.width-20)/500)*this.health,5)
            ctx.closePath()
            ctx.strokeStyle = "rgba(255, 255, 255,0)";
            if(player.velocity.x===0){
                if(this.left){
                    ctx.strokeRect(this.position.x+10,this.position.y,this.width-20,this.height)
                    ctx.drawImage(playerImage,0,0,146*2,244*2,this.position.x,this.position.y,this.width,this.height)
                }
                else{
                    ctx.save();
                    ctx.scale(-1,1);
                    ctx.strokeRect(-this.position.x+10-this.width,this.position.y,this.width-20,this.height)
                    ctx.drawImage(playerImage,0,0,146*2,244*2,-this.position.x-this.width,this.position.y,this.width,this.height) 
                    ctx.restore()
                }
            this.frameW=0;
            this.frameI=0;
            }
            else if(player.velocity.y===0 && player.onGround){
                if(this.frameW>=playerWalkImages.length){
                    this.frameW=0
                }
                if(player.velocity.x<0){
                ctx.save();
                ctx.scale(-1,1);
                ctx.strokeRect(-this.position.x+10-this.width,this.position.y,this.width-20,this.height)
                ctx.drawImage(playerWalkImages[this.frameW],0,0,146*2,244*2,-this.position.x-this.width,this.position.y,this.width,this.height);
                ctx.restore()
                this.left=false;
                }
                else if(player,this.velocity.x>0){
                    ctx.strokeRect(this.position.x+10,this.position.y,this.width-20,this.height)
                ctx.drawImage(playerWalkImages[this.frameW],0,0,146*2,244*2,this.position.x,this.position.y,this.width,this.height)
                this.left=true;
                }
                this.frameW++
            }
            else {
                if(this.frameI>=playerJumpImages.length){
                    this.frameI=0
                }
                if(player.velocity.x<0){
                ctx.save();
                ctx.scale(-1,1);
                ctx.strokeRect(-this.position.x-this.width,this.position.y,this.width,this.height);
                ctx.drawImage(playerJumpImages[this.frameI],0,0,146*2,244*2,-this.position.x-this.width,this.position.y,this.width,this.height);
                ctx.restore()
                this.left=false;
                }
                else{
                ctx.strokeRect(this.position.x,this.position.y,this.width,this.height);
                ctx.drawImage(playerJumpImages[this.frameI],0,0,146*2,244*2,this.position.x,this.position.y,this.width,this.height)
                this.left=true;
                }
                this.frameI++
            }
            this.gun.draw()
            this.gun.shoot()
        }
    
    }
    const player=new Player()
    // Gun 
    class Gun{ 
       constructor(player){ 
            this.player=player; 
            this.width=30; 
            this.height=10; 
            this.angle=0; 
            this.hinge={ 
                        x:player.position.x + player.width/2, 
                        y:player.position.y + player.height*0.75 }; 
            this.free={ 
                        x:this.hinge.x+this.width, 
                        y:this.hinge.y }; 
            this.dragging=false; 
            this.prevDirection = "left";
            this.bullets=[];
            this.lastShotTime = 0; 
            this.shotInterval = 1000;
    } 
        update(){ 
        
            this.hinge.x=player.position.x + player.width/2; 
            this.hinge.y=player.position.y + player.height*0.75;
            if(this.dragging){ 
            const angle=Math.atan2(mouse.y-this.hinge.y,mouse.x-this.hinge.x); 
            if(player.left && (angle < (Math.PI/2)) && (angle > (-Math.PI/2)) ){
                player.gun.angle=angle
            }
            if(!player.left && ((angle > (Math.PI/2)) || (angle < (-Math.PI/2)))){
                player.gun.angle=angle
            }
            } 
            this.free.x=this.hinge.x+Math.cos(this.angle)*this.width; 
            this.free.y=this.hinge.y+Math.sin(this.angle)*this.width; 
        } 
        shoot(){
            if(this.bullets.length>0){
            this.bullets.forEach(bullet=>{
                if(bullet.frame % 3 ===0){
                bullet.update()
                bullet.draw()
                }
                bullet.frame++
                if (
                    bullet.x < 0 ||
                    bullet.x > canvas.width ||
                    bullet.y < 0 ||
                    bullet.y > canvas.height
                  ) {
                    // Remove the bullet from the array
                    this.bullets.splice(this.bullets.indexOf(bullet), 1);
                  }
            })
        }
    }
        draw() {
            ctx.save(); ctx.strokeStyle = 'blue'; 
            ctx.lineWidth = 10; ctx.beginPath(); 
            ctx.moveTo(this.hinge.x, this.hinge.y); 
            ctx.lineTo(this.free.x, this.free.y); 
            ctx.stroke(); ctx.closePath(); 
            ctx.restore();
         } 
        stopDragging(){ this.dragging=false; } 
        startDragging(){ this.dragging=true; } 
    } 
    player.gun=new Gun(player) ;
    class Bullet {
        constructor(angle) {
          this.x = player.gun.free.x;
          this.y = player.gun.free.y;
          this.vx = Math.cos(angle) * 20;
          this.vy = Math.sin(angle) * 20; 
          this.gravity = 1; 
          this.radius = 5;
          this.frame=0;
        }
      
        update() {
          
          this.vy += this.gravity;
          this.x += this.vx;
          this.y += this.vy;
        }
        draw(){
            ctx.beginPath();
            ctx.globalAlpha = 1.0;
            ctx.fillStyle='red';
            ctx.strokeStyle='red'
            ctx.arc(this.x,this.y,this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke()
            ctx.closePath();
            ctx.fillStyle='rgba(255,255,255,0)';
        }
      }
      canvas.addEventListener('mousedown',(e)=>{ 
        mouse.x=e.offsetX ;
        mouse.y=e.offsetY ;
        player.gun.startDragging()  }) 
    
    canvas.addEventListener('mousemove', (event) => { 
        mouse.x = event.offsetX; mouse.y = event.offsetY; });
    
    canvas.addEventListener('mouseup', () => {  
        player.gun.stopDragging();
        if(!isPaused){
        input.update()
        }
     });
    zombiesArray.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === zombiesArray.length) {
                animate(); 
            }
        };
        zombieImages.push(img);
    });
    // Zombie class
    class Zombie {
        constructor(x,speed,direction) {
            this.x = x;
            this.y = CANVAS_HEIGHT-173/2+1;
            this.direction=direction;
            this.speed=speed;
            this.frame = 0;
            this.width=90.333/2;
            this.height= 173/2
            this.marginx=(direction==="left")? 23.33/2 : 30/2
            this.targetX=player.position.x
            this.distance=this.targetX-this.x
            this.stop=false;
            this.directionChanged=false;
            this.stoppedByBlock = null;
            this.dead=false;
            this.moved=false;
        }
        update() {
            this.moved=false;
            this.speed=0.15
            if(this.stop){
                this.speed=0
            }
            this.targetX=player.position.x
            this.distance=this.targetX-this.x-this.marginx
            let previousDirection = this.direction;
            if(this.distance>1){
                this.x+=this.speed
                this.direction="left"
            }
            else if(this.distance<-1){
                this.x-=this.speed
                this.direction="right"
            }
            if(this.direction!== previousDirection){
                this.directionChanged = true;
                this.marginx=(this.direction==="left")? 23.33/2 : 30/2
            } else {
                this.directionChanged = false;
                this.marginx=(this.direction==="left")? 23.33/2 : 30/2
            }
            if(gameFrame%10===0){
            this.frame = (this.frame + 1) % zombieImages.length;
            }
        }
        die(){
            player.gun.bullets.forEach(bullet=>{
                let closestX= Math.max(this.x+this.marginx,Math.min(bullet.x,this.x+this.marginx+this.width))
                let closestY=Math.max(this.y+10,Math.min(bullet.y,this.y+this.height))
                let dx=closestX-bullet.x
                let dy=closestY-bullet.y
                let distance=Math.sqrt(dx*dx + dy*dy)
                if(distance <=bullet.radius){
                    this.dead=true
                    zombies.splice(zombies.indexOf(this), 1);
                    player.gun.bullets.splice(player.gun.bullets.indexOf(bullet), 1);
                    player.score+=10;
                }
            })
        }
        draw() {
            ctx.strokeStyle = "rgba(255, 255, 255,0)";
            if(this.direction==="right"){
                ctx.save();
                ctx.scale(-1,1);
                ctx.strokeRect(-this.x-(30/2)-(90.33/2), this.y+10, 90.33/2, 173/2-10);
                ctx.drawImage(zombieImages[this.frame], -this.x-143.3/2, this.y, 143.3/2, 173/2);
                ctx.restore()
            }
            else{
                ctx.strokeRect(this.x+23.33/2, this.y+10, 90.33/2, 173/2-10);
                ctx.drawImage(zombieImages[this.frame], this.x, this.y, 143.3/2, 173/2);
            }
        }
    }
    
    class Block{
        constructor(i,n) {
            this.n=n;
            if(this.n===4){
                this.width = 100
                this.height =200
            }
            else{
                this.width = 70
                this.height =70
            }
            this.health = (this.height+this.width)*10;
            if(this.n===4){
               this.x=CANVAS_WIDTH/2-50
            }
            else{
            this.x = blockPositions[this.n]
            }
            this.y = CANVAS_HEIGHT - this.height;
            this.destroyed=false
            this.stoppedZombies=[]
            this.zombie=null;
          }
          draw(){
            ctx.drawImage(blockImage,this.x,this.y,this.width,this.height)
          }
          checkCollision(){
            const collidingZombies = zombies.filter((zombie) => {
                return ( zombie.x + zombie.marginx < this.x + this.width &&
                    zombie.x + zombie.marginx + zombie.width > this.x &&
                    zombie.y < this.y + this.height &&
                    zombie.y + zombie.height > this.y
                );
              });
              if(collidingZombies.length>0){
              { collidingZombies.forEach(zombie=>{
                if(collidingZombies.length>1){
                    this.zombie=null;
                    this.stoppedZombies=[]
                }
                if (this.health <= 1) {
                    // Player is destroyed
                    this.destroyed = true;
                    zombie.stop = false;
                    this.zombie = null;
                    this.stoppedZombies=[]
                    zombies.forEach(zomb => {
                        if ((zombie.direction === 'left' && zomb.x < zombie.x) ||
                            (zombie.direction === 'right' && zomb.x > zombie.x) ||
                            collidingZombies.length>1) {
                            zomb.stop = false;
                        }
                    });
                } 

             else if ((zombie.direction==='right' && this.x < zombie.x ) ||
                (zombie.direction==='left' && this.x > zombie.x)){
            if(this.stoppedZombies.length>0){
                this.stoppedZombies.forEach(z=>{
                    z.stop=false;
                })
            }
            this.stoppedZombies=[]
            this.health -= 2;
            zombie.stop = true;
            this.zombie=zombie
            this.stoppedZombies.push(zombie)
            for (let i = 0; i < zombies.length; i++) {
                for (let j = i+1 ; j < zombies.length; j++) {
                    const dx=zombies[i].x-zombies[j].x
                    if(Math.abs(dx) <=52 && (zombies[i].direction===zombie.direction) &&(zombies[j].direction===zombie.direction)){
                        if((zombie.direction==='right') && dx>0 ){
                            zombies[i].stop=true;
                            this.stoppedZombies.push(zombies[i])
                        }
                        else if((zombie.direction==='left') && dx>0 ){
                            zombies[j].stop=true;
                            this.stoppedZombies.push(zombies[j])
                        }
                    }
                }
            }
        }
     })}
    }

        if(this.zombie !== null && this.zombie.dead){
            zombies.forEach(zomb => {
                if ((this.zombie.direction === 'left' && zomb.x < this.zombie.x) ||
                    (this.zombie.direction === 'right' && zomb.x > this.zombie.x)) {
                        zomb.stop = false;
                    }
        }
    )
    this.zombie=null;
    }
        player.gun.bullets.forEach(bullet=>{
            let closestX= Math.max(this.x,Math.min(bullet.x,this.x+this.width))
            let closestY=Math.max(this.y,Math.min(bullet.y,this.y+this.height))
            let dx=closestX-bullet.x
            let dy=closestY-bullet.y
            let distance=Math.sqrt(dx*dx + dy*dy)
            if(distance <=bullet.radius){
                player.gun.bullets.splice(player.gun.bullets.indexOf(bullet), 1);

            }
        })
     }
        }
    
    for(let i=0;i<5;i++){
    
    blocks.push(new Block(i,i))
    }
    function zombieWave(){
        const currentTime=Date.now()
        if(((currentTime-input.lastWave)>input.waveInterval) && zombies.length < 6){
        const minDistance=50;
        const directions = ["left", "right"];
        for(let direction of directions){
        let x=direction==="left"?-143.4/2:CANVAS_WIDTH;
        for(let i=0;i<4;i++){
        let dx=minDistance*i*(direction === "left" ? -1 : 1);
        let speed=Math.random()*0.3
        speed=(speed>0.15)?speed-0.1:speed;
        zombies.push((new Zombie(x+dx,speed,direction)))
        }
        input.lastWave=currentTime;
      }
    }
    }
    function checkCollision(zombie1,zombie2){
        const dx=zombie1.x-zombie2.x
        return Math.abs(dx) <50
}
function ZombieCollisions() {
  for (let i = 0; i < zombies.length; i++) {
    for (let j = i + 1; j < zombies.length; j++) {
      if (checkCollision(zombies[i], zombies[j]) && (!zombies[i].moved || !zombies[j].moved)) {
        const dx = zombies[i].x - zombies[j].x;
        const overlap = 50- Math.abs(dx)
        const moveX = overlap/2
        zombies[i].x += moveX;
        zombies[j].x -= moveX;
        zombies[i].moved =true;
        zombies[j].moved=true;
      }
    }
  }
}
    
    zombieWave()
    console.log(input)
    function animate() {
        if(document.querySelector('form')){
            return
        }
        if(isPaused){
            return
          }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(player.health<=0){
            blocks.forEach(block=>{
                if(!block.destroyed){
                block.draw()
                }
            })
            zombies.forEach(zombie=>{
                zombie.draw();
            })
            player.draw()
            ctx.fillStyle = 'red';
            ctx.font = 'bold 80px Creepster'; // increase font size and add bold style
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText("GAMEOVER!!", canvas.width / 2, canvas.height / 2);
            setTimeout(gameOver,300)
      
            return;
          }
          isCollision=false;
          blocks.forEach(block=>{
            if(!block.destroyed){
            block.draw()
            isCollision=true;
            }
        })
        zombies.forEach(zombie=>{
            zombie.update();
            zombie.die()
            zombie.draw();
        })
        zombies.forEach(z=>{
            z.stop=false;
        })
        blocks.forEach(block=>{
            if(!block.destroyed){
            block.checkCollision()
    }})
        player.update(input,blocks)
        gameFrame++;
        zombieWave()
        if(isCollision){
            ZombieCollisions()
            }else{
            
                for (let i = 0; i < zombies.length; i++) {
                    for (let j = i + 1; j < zombies.length; j++) {
                        if (checkCollision(zombies[i], zombies[j]) && (!zombies[i].moved || !zombies[j].moved)) {
                            // Calculate the overlap distance
                            let overlapX = (zombies[i].x + zombies[i].width / 2) - (zombies[j].x + zombies[j].width / 2);
                           
                            
                            // Adjust the positions to resolve the collision
                        
                                if (overlapX > 0) {
                                    zombies[i].x += 0.2;
                                    zombies[j].x -= 0.2;
                                } else {
                                    zombies[i].x -= 0.2;
                                    zombies[j].x += 0.2;
                                }
    
                        
                            zombies[i].moved = true;
                            zombies[j].moved = true;
                        }
                    }
                }
            
            
            }
        requestAnimationFrame(animate);
    }
    function gameOver() {
        getScores()
        const over = document.createElement('div')
        over.classList.add("gameover")
        const restart=document.createElement("button")
        restart.classList.add("restart")
        restart.innerHTML="PLAY AGAIN"
        restart.addEventListener("click",()=>{
            location.reload()
        })
        over.id = 'gameover'
        document.body.appendChild(over)
        let s=document.createElement("h1")
        over.appendChild(s)
        s.innerText=`Your Score ${player.score}`
        s.style.color='#ff0000'
        if(scores.length>0){
           scores.forEach((score,i)=>{
            
                let p=document.createElement("p")
                p.innerText=`${i+1}. ${score[0]}: SCORE-${score[1]}`
                over.appendChild(p)
            })}
        over.appendChild(restart)
    }
    function getScores(){
        if(localStorage.getItem('Scores')){
            scores = JSON.parse(localStorage.getItem('Scores'))
            scores.push([username, player.score]);
            scores.sort((a, b) => b[1] - a[1]);
            scores.splice(5) 
            localStorage.setItem('Scores', JSON.stringify(scores)) 
        }
        else{
            scores=[[username,player.score]]
            localStorage.setItem('Scores', JSON.stringify(scores)) 
        }
    }
    }
    )
