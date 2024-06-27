/**@type {HTMLCanvasElement} */
window.addEventListener("load",function(){
let username=null
const inventoryImage = new Image();
inventoryImage.src = "Screenshot 2024-06-19 022632.png";  // Ensure the path is correct

let currentItem = null;
let draggingItem = null;
let offsetX = 0;
let offsetY = 0;
const inventoryBounds = [
    { x: 12, y: 8, width: 52, height: 46, item: 'block',n:0 },
    { x: 12, y: 60, width: 52, height: 46, item: 'mine',n:0}, 
    { x: 12, y: 113, width:52, height: 46, item: 'trap' } 
];


inventoryImage.onload = () => {
    drawInventory();
};
function removePrepListeners() {
    canvas.removeEventListener('mousedown', handleInventoryMouseDown)
    canvas.removeEventListener('mousemove', handleInventoryMouseMove);
    canvas.removeEventListener('mouseup', handleInventoryMouseUp);
}


function drawInventory() {
    ctx.drawImage(inventoryImage,0,0,128,548,0,0,64,274); 
    if(inventoryBounds[0].n>=7){
        ctx.fillStyle='rgba(0,0,0,0.7)'
        ctx.fillRect(12,1,52,46)
        ctx.fillStyle='rgba(255,255,255,0)'
    } // Draw the inventory on the canvas
    if(inventoryBounds[1].n>=4){
        ctx.fillStyle='rgba(0,0,0,0.7)'
        ctx.fillRect(12,53,52,46)
        ctx.fillStyle='rgba(255,255,255,0)'
    } 
    ctx.fillStyle='rgba(0,0,0,0.7)'
    ctx.fillRect(12,106,52,46)
    ctx.fillStyle='rgba(255,255,255,0)'
}
    function playerInfo(){
       const submit=document.querySelector('#submit')
       const player=document.querySelector('#username')
       const start=document.querySelector('#start')
       start.addEventListener('click',()=>{
        removePrepListeners()
        eventlistener()
        document.querySelector(".controls").removeChild(start)
        scheduleNextpowerup()
        animate()
       })
       submit.disabled=true;
       player.addEventListener('input', () => {
        submit.disabled = player.value.trim() === "";
    });
       submit.addEventListener('click',(e)=>{
        e.preventDefault()
        username=player.value.trim();
        const form=document.querySelector('form')
        document.querySelector('body').removeChild(form)
        canvas.addEventListener('mousedown', handleInventoryMouseDown);
        canvas.addEventListener('mousemove', handleInventoryMouseMove);
        canvas.addEventListener('mouseup', handleInventoryMouseUp);
        pushBlock(CANVAS_WIDTH/2-50,CANVAS_HEIGHT-200,4)
        blocks.forEach(block=>{
            block.draw()
        })
       }
    )
    }
    function handleInventoryMouseDown(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
    
        for (const bound of inventoryBounds) {
            if (x >= bound.x && x <= bound.x + bound.width && y >= bound.y && y <= bound.y + bound.height) {
                currentItem = bound.item;
                draggingItem = { ...bound };
                offsetX = x - bound.x;
                offsetY = y - bound.y;
                break;
            }
        }
    }
    function handleInventoryMouseMove(event) {
        if (draggingItem) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
    
            draggingItem.x = x - offsetX;
            draggingItem.y = y - offsetY;
    
            // Redraw the canvas to show the dragged item
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            blocks.forEach(block=>{
                block.draw()
            })
            mines.forEach(mine=>{
                mine.draw()
            })
            drawInventory();
            drawDraggedItem();
        }
    }
    
    function handleInventoryMouseUp(event) {
        if (draggingItem) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            let colliding=false;
            let valid=false
            if(currentItem==='block' && draggingItem.n<7){
                blocks.forEach(block=>{
                        if (isColliding(block.x, block.y, block.width, block.height, draggingItem.x, draggingItem.y, 70, 70)) {
                             colliding=true; 
                            }
                })
                if(((isOnTopOfBlock(blocks,draggingItem.x, draggingItem.y, 70, 70))|| isOnGround( draggingItem.y,70))){
                     valid=true;
                }
                if(!colliding && valid){
                    if(draggingItem.n===4){
                        draggingItem.n++;
                        inventoryBounds[0].n++
                    }
                pushBlock(draggingItem.x,draggingItem.y,draggingItem.n)
                inventoryBounds[0].n++
                }
            }
            if(currentItem==='mine' && draggingItem.n<4){
                blocks.forEach(block=>{
                    if (isColliding(block.x, block.y, block.width, block.height, draggingItem.x, draggingItem.y,draggingItem.width/2,draggingItem.height/2)) {
                         colliding=true; 
                        }
                    })
                    if(((isOnTopOfBlock(blocks,draggingItem.x+10, draggingItem.y, draggingItem.width/2-20,draggingItem.height/2))|| isOnGround( draggingItem.y+2,draggingItem.height/2))){
                            valid=true;
                    }
                    if(!colliding && valid){
                    pushMine(draggingItem.x, draggingItem.y, draggingItem.width/2, draggingItem.height/2)
                    inventoryBounds[1].n++
                    }
            }
            draggingItem = null;
            currentItem = null;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            blocks.forEach(block=>{
                block.draw()
            })
            mines.forEach(mine=>{
                mine.draw()
            })
            drawInventory();
            drawDraggedItem();
        }
    } 
    function isColliding(x1, y1, width1, height1, x2, y2, width2, height2) {
        return !(
            x1 + width1 < x2 || 
            x1 > x2 + width2 || 
            y1 + height1 < y2 ||
            y1 > y2 + height2-10 
        );
    }   
    function isOnTopOfBlock(blocks, newX, newY, newWidth, newHeight) {
        for (let block of blocks) {
            if (
                newX < block.x + block.width &&
                newX + newWidth > block.x &&
                newY + newHeight >block.y-10 &&
                newY + newHeight <block.y+10
            ) {
                console.log(draggingItem.y,block.y)
                draggingItem.y=block.y-newHeight;
                console.log(draggingItem.y,block.y)
                return true;
            }
        }
        return false;
    }
    
    function isOnGround(newY, newHeight ) {
        if(newY + newHeight >= CANVAS_HEIGHT-10 && newY + newHeight <= CANVAS_HEIGHT+10 ){
           draggingItem.y=CANVAS_HEIGHT-newHeight;
           return true;
        }
        return false;
    }
    function drawDraggedItem() {
        if (draggingItem) {
            if(currentItem==='block' && draggingItem.n<7){
            ctx.drawImage(blockImage,draggingItem.x, draggingItem.y, 70,70);
            }
            if(currentItem==='mine' && draggingItem.n<4){
            ctx.drawImage(mineImage,0,0,82,82,draggingItem.x, draggingItem.y, draggingItem.width/2, draggingItem.height/2);
            ctx.strokeStyle='white'
            ctx.strokeRect(draggingItem.x+10, draggingItem.y, draggingItem.width/2-10, draggingItem.height/2);
            }
        }
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
    const mineImage=new Image()
    mineImage.src="Mine.png"
    const trapImage=new Image()
    trapImage.src="Trap.png"
    const blocks=[]
    let zombieWaveInterval=7000;
    let imagesLoaded = 0;
    const mouse={x:null,y:null};
    let gameFrame = 0;
    let scores=[]
    const playerImage=new Image();
    const powerups=new Image()
    /*new*/const jetpackImage=new Image();
    jetpackImage.src="Design.png"
    powerups.src="My first design 9.png"
    playerImage.src="flatboy/png/Idle (1).png"
    const pumpkins=[]
    const pumpkinIdleImage=new Image()
    pumpkinIdleImage.src="jackfree/png/Idle (1).png"
    const pumpkinWalkArray=[
"jackfree/png/Walk (1).png",
"jackfree/png/Walk (2).png",
"jackfree/png/Walk (3).png",
"jackfree/png/Walk (4).png",
"jackfree/png/Walk (5).png",
"jackfree/png/Walk (6).png",
"jackfree/png/Walk (7).png",
"jackfree/png/Walk (8).png",
"jackfree/png/Walk (9).png",
"jackfree/png/Walk (10).png" ]
const pumpkinWalkImages=[]
pumpkinWalkArray.forEach(src => {
    const img = new Image();
    img.src = src;
    pumpkinWalkImages.push(img);
});
    const pumpkinJumpArray=[
        "https://i.ibb.co/xmbsWwX/Jump-1.png" ,
        "https://i.ibb.co/6m8dvDS/Jump-2.png" ,
        "https://i.ibb.co/84BH893/Jump-3.png" ,
        "https://i.ibb.co/cXRVFXy/Jump-4.png" ,
        "https://i.ibb.co/yYSvpk2/Jump-5.png" ,
        "https://i.ibb.co/ZRjMpPQ/Jump-6.png" ,
        "https://i.ibb.co/3vYBztF/Jump-7.png" ,
        "https://i.ibb.co/pxscrxc/Jump-8.png" ,
        "https://i.ibb.co/093X1cY/Jump-9.png" ,
        "https://i.ibb.co/smy1nzj/Jump-10.png"
    ]
    const pumpkinJumpImages=[]
    pumpkinJumpArray.forEach(src => {
        const img = new Image();
        img.src = src;
        pumpkinJumpImages.push(img);
    });
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
    const bombs=[]
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
 const explosionImage=new Image()
 explosionImage.src="My first design 17.png" 
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
                console.log(e)
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
                else if (e.key === " ") {
                    if (player.weapon === 'gun') {
                      player.weapon = 'bomb';
                    } else {
                      player.weapon = 'gun';
                    }
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
                    console.log(this.keys)
                }
            }
            update() {
                  if(player.weapon==='gun'){
                  const currentTime = Date.now();
                  if (currentTime - player.gun.lastShotTime >= player.gun.shotInterval) {
                    player.gun.bullets.push(new Bullet(player.gun.free.x,player.gun.free.y,player.gun.angle,25));
                    player.gun.recoilRemaining = player.gun.recoilDuration;
                    player.gun.recoilOffset.x = Math.cos(player.gun.angle) * player.gun.recoilStrength;
                    player.gun.recoilOffset.y = Math.sin(player.gun.angle) * player.gun.recoilStrength;
                    player.gun.lastShotTime = currentTime; 
                  }
              }
              else{
                const currentTime = Date.now();
                if (currentTime - player.Bomb.lastShotTime >= player.Bomb.shotInterval) {
                  bombs.push(new Bomb());
                  player.Bomb.lastShotTime = currentTime; 
                }
              }
            }
        }
    const input=new InputHandler()
    const mines=[]
    // MINE
    class Mine{
        constructor(x,y,w,h){
            this.x=x;
            this.width=w;
            this.height=h
            this.y=y;
            this.exploded=false
            this.explosionStartTime=0;
            this.explosionDuration =200;
            this.actived=false;
            this.dead=null;
            this.groundedBlock=null;
            this.checkGroundedBlock()
        }
        update(){
            const currentTime = Date.now();
            if (this.actived) {
                if (currentTime - this.explosionStartTime >= this.explosionDuration) {
                    mines.splice(mines.indexOf(this), 1);
                }
            }
                if (this.groundedBlock && this.groundedBlock.destroyed) {
                    mines.splice(mines.indexOf(this))
                }
                if (this.groundedBlock && !this.groundedBlock.destroyed) {
                    this.y=this.groundedBlock.y-this.height
                }
                this.checkGroundedBlock()
                
        }
        checkGroundedBlock() {
            for (let block of blocks) {
                if (!block.destroyed &&
                    this.y + this.height <= block.y &&
                    this.y + this.height + 5 >= block.y && 
                    this.x-10+ this.width > block.x &&
                    this.x +10< block.x + block.width) {
                    this.groundedBlock = block;
                    break;
                }
            }
        }
        draw(){
            ctx.drawImage(mineImage,0,0,82,82,this.x, this.y, this.width,this.height);
            if (this.actived) {
                ctx.drawImage(explosionImage, this.x+this.width/2-5,this.y-30,100,100);
                ctx.drawImage(explosionImage, this.x+this.width/2-45,this.y-30,100,100);
            }
        }
    }
    function pushMine(xa,ya,wa,ha){
        mines.push(new Mine(xa,ya,wa,ha))
    }
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
        this.speeds={
            x:3,
            y:18
        }
        this.gun   
        this.frameW = 0;     
        this.frameI=0;  
        this.left=true;   
        this.health=500;
        this.score=0;  
        this.fast={
            isFast:false,
            startTime:0,
            duration:2000,

        }   
        this.immunity={
            isImmune:false,
            startTime:0,
            duration:2000,
        }
        this.auraRadius=20;
        this.auraSpeed=0.1;    
        this.weapon='gun'; 
        this.Bomb={
           lastShotTime : 0,
            shotInterval:1000
        }  
        this.placedItems = [];
        this.jetpack = {
            isActive: false,
            isDeactivated:false,
            thrust: -0.5
        };                                                                                                                                                                                                                                  
    }
    
    update(input, blocks) {
        if(gameFrame%2===0){
        this.handleInput(input);
        this.handlePhysics(blocks);
        this.handleCollision()
        }
        if(this.weapon==='gun'){
        this.gun.update()
        }
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
               !(this.velocity.y!==0 && this.velocity.x!==0) &&
               !(this.immunity.isImmune)
            ){
                 this.health-=5
            }
            else if( zombie.x + zombie.marginx < this.position.x + this.width &&
                zombie.x + zombie.marginx + zombie.width > this.position.x &&
                zombie.y+10< this.position.y + this.height &&
                zombie.y+zombie.height > this.position.y &&
               (this.velocity.y!==0 && this.velocity.x!==0) &&
               !(this.immunity.isImmune)
            ){
                 this.health-=5
            }
        })
        pumpkins.forEach(pumpkin=>{
            if( pumpkin.position.x + 10 < this.position.x + this.width-10 &&
                pumpkin.position.x + 10 + pumpkin.width -30> this.position.x+10 &&
                pumpkin.position.y+4< this.position.y + this.height &&
                pumpkin.position.y+4 +pumpkin.height > this.position.y  &&
               !(this.immunity.isImmune)
            ){
                // this.health-=0.5
            }
        })
        if(Powers.length){
            Powers.forEach(power=>{
                if(power.x + power.marginx < this.position.x + this.width-10 &&
                    power.x + power.marginx + power.width > this.position.x+10 &&
                    power.y+10< this.position.y + this.height &&
                    power.y + power.height > this.position.y
                ){
                    if(power.power==='revive'){
                        this.health=500;
                    }
                    if(power.power==='immunity'){
                        this.immunity.isImmune=true;
                        setTimeout(()=>{
                            this.immunity.isImmune=false;
                        },5000)
                    }
                    if(power.power==='fast'){
                        this.fast.isFast=true;
                        this.speeds.x=5;
                        this.speeds.y=20;
                        setTimeout(()=>{
                            this.fast.isFast=false;
                            this.speeds.x=3;
                            this.speeds.y=18;
                        },5000)
                    }
                    if(power.power==='jetpack'){
                        this.jetpack.isActive=true;
                        this.velocity.y=0;
                        setTimeout(()=>{
                            this.jetpack.isActive=false;
                            this.jetpack.isDeactivated=true;
                            this.onGround=false;
                            this.velocity.y=0
                        },3000)
                    }
                    if(power.power==='score'){
                        this.score+=10;
                    }
                    Powers.splice(Powers.indexOf(power),1)
                }
            })
        }
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
          } else if (input.keys.includes('ArrowRight') && !this.jetpack.isDeactivated) {
            this.velocity.x = this.speeds.x;
          } else if (input.keys.includes('ArrowLeft')&&!this.jetpack.isDeactivated) {
            this.velocity.x = -this.speeds.x;
          } else {
            this.velocity.x = 0;
          }
        if (input.keys.includes('ArrowUp') && this.onGround &&!this.jetpack.isActive) {
            this.velocity.y = -this.speeds.y;
        }
        blocks.forEach(block=>{
            if(!block.destroyed && block.y<player.position.y && block.x<player.position.x+player.width-10 && block.x+block.width>player.position.x+10){
                if(input.keys.indexOf('ArrowUp')>-1){
                    input.keys.splice(input.keys.indexOf('ArrowUp'), 1);
                    this.velocity.y=0;
            }
            }
        })
    }
    
    handlePhysics(blocks) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // Apply gravity
        if (!this.onGround && !this.jetpack.isActive) {
            this.velocity.y += gravity;
        }
        if(this.jetpack.isActive){
        this.velocity.y += this.jetpack.thrust;
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
                if(this.jetpack.isDeactivated){
                    this.jetpack.isDeactivated=false;
                }
                this.position.y = block.y - this.height;
            }
        }
        // Boundary conditions
        if (this.position.y + this.height >= CANVAS_HEIGHT && !this.jetpack.isActive) {
            this.position.y = CANVAS_HEIGHT - this.height;
            this.velocity.y = 0;
            this.onGround = true;
            if(this.jetpack.isDeactivated){
                this.jetpack.isDeactivated=false;
            }
        }
    
        if (this.position.x < 0) {
            this.position.x = 0;
        }
        if(this.position.y<0 ){
            this.position.y=0;
        }
        if (this.position.x + this.width > CANVAS_WIDTH) {
            this.position.x = CANVAS_WIDTH - this.width;
        }
      }
        draw(){
            if(this.jetpack.isActive){
                ctx.drawImage(jetpackImage,0,0,436,480,this.position.x+this.width/2-54.5/2,this.position.y+this.height/2,54.5,60)
            }
            if(this.fast.isFast || this.immunity.isImmune){
                ctx.save();
            if(this.fast.isFast){
                ctx.shadowColor = 'rgba(246, 189, 96,0.7)';
            }
            else{
             ctx.shadowColor = 'rgba(0, 255, 0, 0.7)'; 
            }// green glow color
             ctx.shadowBlur = 20; // blur radius
             ctx.shadowOffsetX = 0; // horizontal offset of the shadow
             ctx.shadowOffsetY = 0; 
            }
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
            if(player.velocity.x===0 ||this.jetpack.isActive){
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
            else if((player.velocity.y===0 && player.onGround)){
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
            if(this.fast.isFast || this.immunity.isImmune){
                ctx.restore()
            }
            if(this.weapon==='gun'){
            this.gun.draw()
            this.gun.shoot()
            }

                bombs.forEach(bomb=>{
                    bomb.update()
                    bomb.draw()
                })
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
            this.recoilStrength = 7.5;
            this.recoilDuration = 15; 
            this.recoilRemaining = 0;
            this.recoilOffset = { x: 0, y: 0 };
    } 
    eventlistener(){
        canvas.addEventListener('mousedown',(e)=>{ 
            if(player.weapon==='gun'){
            mouse.x=e.offsetX ;
            mouse.y=e.offsetY ;
            player.gun.startDragging() }
            else if(player.onGround){
                if(!isPaused){
                    input.update()
            }
        }
        }) 
        
        canvas.addEventListener('mousemove', (event) => { 
            if(player.weapon==='gun'){
            mouse.x = event.offsetX; mouse.y = event.offsetY; }
            return
        });
        
        canvas.addEventListener('mouseup', () => { 
            if(player.weapon==='gun'){ 
            player.gun.stopDragging();
            if(!isPaused){
            input.update()
            }
        }
        });
    }
        update(){ 
            
            this.hinge.x=player.position.x + player.width/2; 
            this.hinge.y=player.position.y + player.height*0.75;
            if (this.recoilRemaining > 0) {
                this.hinge.x -= this.recoilOffset.x;
                this.hinge.y -= this.recoilOffset.y;
                this.recoilRemaining--;
            }
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
        constructor(x,y,angle,speed) {
          this.x = x
          this.y = y
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed; 
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
        }
      }
      
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
    const bombImage=new Image()
    bombImage.src="My first design 16.png"
    class Bomb {
        constructor() {
            this.height = 40;
            this.width = 40; 
            this.x = player.position.x + player.width / 2 - this.width / 2;
            this.y = player.position.y + player.height - this.height;
            this.exploded = false;
            this.explodeTime = 3000; 
            this.explosionDuration = 1000; 
            this.time = Date.now();
            this.radius =75;
            this.explosionStartTime = 0;
            this.groundedBlock=null;
            this.checkGroundedBlock()
        }
    
        update() {
            const currentTime = Date.now();
            if (currentTime - this.time >= this.explodeTime && !this.exploded) {
                this.exploded = true;
                this.explosionStartTime = currentTime; 
                this.explode()
            }
    
            if (this.exploded) {
                if (currentTime - this.explosionStartTime >= this.explosionDuration) {
                    bombs.splice(bombs.indexOf(this), 1);
                }
            }
            else {
                if (this.groundedBlock && this.groundedBlock.destroyed) {
                    this.y += 5;
                }
                if(this.y+this.height>=CANVAS_HEIGHT){
                    this.y=CANVAS_HEIGHT-this.height
                    this.groundedBlock=null;
                }
        }
        if (this.groundedBlock && !this.groundedBlock.destroyed) {
            this.y=this.groundedBlock.y-this.height
        }
        this.checkGroundedBlock()
        }
    
        explode() {
            const deadZombies = zombies.filter(zombie => {
                return Math.abs(zombie.x + zombie.marginx - (this.x + 5 + (this.width - 10) / 2)) <= this.radius;
            });
            deadZombies.forEach(zombie => {
                zombies.splice(zombies.indexOf(zombie), 1);
            });
    
            const destroyBlocks = blocks.filter(block => {
                return (Math.abs(block.x - (this.x + 5 + (this.width - 10) / 2)) <= this.radius ||
                        Math.abs(block.y - (this.y + 15 + (this.height - 15) / 2)) <= this.radius);
            });
            destroyBlocks.forEach(block => {
                block.health -= 50;
            });
    
            if (pumpkins.length>0 && Math.abs(pumpkins[0].position.x + 10 - (this.x + 5 + (this.width - 10) / 2)) <= this.radius &&
                Math.abs(pumpkins[0].position.y - (this.y + 15 + (this.height - 15) / 2)) <= this.radius) {
                pumpkins.pop();
                blocks.forEach(block=>{
                    block.jumped=false;
                })
                if(pumpkins.length===0){
                setTimeout(()=>{pumpkins.push(new Pumpkin())},2000)
                }
            }
        }
        checkGroundedBlock() {
            for (let block of blocks) {
                if (!block.destroyed &&
                    this.y + this.height <= block.y &&
                    this.y + this.height + 5 >= block.y && 
                    this.x-5+ this.width > block.x &&
                    this.x +5< block.x + block.width) {
                    this.groundedBlock = block;
                    break;
                }
            }
        }
    
        draw() {
            ctx.drawImage(bombImage, this.x, this.y + 8, this.width, this.height);
        
            if (this.exploded && Date.now() - this.explosionStartTime < this.explosionDuration) {
                ctx.drawImage(explosionImage, this.x+this.width/2-10 ,this.y-30,100,100);
                ctx.drawImage(explosionImage, this.x+this.width/2-90 ,this.y-30,100,100);
            }
        }
    }
    class Pumpkin {
        constructor() {
          this.width = 579 / 10;
          this.height = 763 / 10;
          this.direction = (Math.random()>0.5)?'left':'right';
          this.position = {
            x: (this.direction==='left')?0:CANVAS_WIDTH-this.width,
            y: CANVAS_HEIGHT - this.height
          };
          this.frame = 0;
          this.speed = {
            x: 0.4,
            y: 0
          };
          this.gravity = 1;
          this.targetX = 0;
          this.distance = 0;
          this.onGround = true;
          this.jumpCooldown = 10; 
          this.jumpTimer = this.jumpCooldown;
          this.collided = false;
          this.jumped = false;
          this.onBlock = false;
          this.idle=false;
          this.block=null;
        }
        update() {
            let previousPosition=this.position.x
            if (!this.onGround &&!this.onBlock){
              this.position.y += this.speed.y;
              this.speed.y += this.gravity;
            }
            
            this.targetX = player.position.x;
            this.distance = this.targetX - this.position.x;
          
            let previousDirection = this.direction;
            if (this.distance >1) {
              this.position.x += this.speed.x
              this.direction = "left"
              this.idle=false;
            }
            else if (this.distance <-1) {
              this.position.x -= this.speed.x
              this.direction = "right"
              this.idle=false;
            }
            if (this.direction!== previousDirection) {
              this.directionChanged = true;
            } else {
              this.directionChanged = false;
            }
            if (gameFrame % 10 === 0) {
              this.frame = (this.frame + 1) % zombieImages.length;
            }
            blocks.forEach(block => {
              if (!block.destroyed) {
                let overlapX = (this.position.x+10 + (this.width-30) / 2) - (block.x+1+(block.width-2)/ 2);
                let halfWidths = ((this.width-30)/ 2) + ((block.width-2)/ 2);
                if (Math.abs(overlapX) <= halfWidths &&!block.jumped && block.y<this.position.y+this.height) {
                  if( this.block && this.block.x!== block.x){
                    blocks.forEach(b=>{
                        b.jumped=false;
                    })
                  }
                  if(this.block && this.block.y===block.y && this.block.x!=block.x){}
                  else if (overlapX > 20 && this.direction==='right') {
                        this.position.x = block.x + block.width-10;
                    } else if((overlapX <-20&& this.direction==='left')) {
                        this.position.x = block.x- (this.width-30)-10;
                    }
                  this.block=block;
                  this.onBlock=false;
                  block.jumped = true;
                  this.speed.y = -Math.sqrt(2*((CANVAS_HEIGHT-block.y)-(CANVAS_HEIGHT-(this.position.y+this.height))));
                  this.onGround = false;
                }
          
                else if (!block.destroyed && this.position.y + this.height <= block.y &&
                    this.position.y + this.height + this.speed.y >= block.y &&
                    this.position.x+10+ this.width-30> block.x+1 &&
                    this.position.x+10< block.x + block.width -1&& this.block===block) {
                  this.onBlock = true;
                  this.onGround = false;
                  this.speed.y = 0;
                } else{
                  this.onBlock = false;
                }
              } 
            });
                if((this.block && this.block.y<player.position.y && this.block.x-10<player.position.x+player.width-10 && this.block.x+this.block.width+10>player.position.x+10 && Math.abs(player.position.y+player.height-this.position.y-4-this.height)<=10)){
                this.position.y=player.position.y+player.height-this.height
                this.speed.y=0
                this.position.x=previousPosition
                if (this.distance >1) {
                    this.position.x += this.speed.x
                    this.direction = "left"
                    this.idle=false;
                  }
                  else if (this.distance <-1) {
                    this.position.x -= this.speed.x
                    this.direction = "right"
                    this.idle=false;
                  }
                  if(Math.abs(this.distance)<=5){
                    this.position.x=player.position.x
                    }
              }
            if(blocks.every(block=>block.destroyed===true)){
                this.onBlock=false;
            }
            if (this.onGround || this.onBlock) {
                this.speed.y = 0;
              }
            if(this.onGround){
            this.position.y = CANVAS_HEIGHT - this.height;
            }
            if (this.position.y + this.height > CANVAS_HEIGHT) {
              this.position.y = CANVAS_HEIGHT - this.height;
              this.speed.y = 0;
              if(this.block){
              blocks.forEach(block=>{
                block.jumped=false;
              })
            }
              this.onGround = true;
              this.onBlock = false;
            }
            if(this.idle){
               this.drawIdle()
            }
            else
            {
                this.drawWalk()
            }
            this.die()
          }
        drawIdle(){
            if(this.direction==='left'){
            //ctx.strokeStyle='white';
            ctx.strokeRect(this.position.x+10, this.position.y+4, this.width-30, this.height)
            ctx.drawImage(pumpkinIdleImage, this.position.x, this.position.y+4, this.width, this.height);
            }
            else{
                ctx.save()
                ctx.scale(-1,1)
                ctx.drawImage(pumpkinIdleImage, -this.position.x-this.width, this.position.y+4, this.width, this.height);  
                ctx.restore()
            }
            this.frame=0;
        }
        drawWalk() {
            if(this.direction==='left'){
            //ctx.strokeStyle='white';
            ctx.strokeRect(this.position.x+10, this.position.y+4, this.width-30, this.height)
            ctx.drawImage(pumpkinWalkImages[this.frame], this.position.x, this.position.y+4, this.width, this.height);
            }
            else{
                ctx.save()
                ctx.scale(-1,1)
                ctx.drawImage(pumpkinWalkImages[this.frame], -this.position.x-this.width, this.position.y+4, this.width, this.height);
                ctx.restore()
            }
        }
        drawJump(){
            //ctx.strokeStyle='white';
            ctx.strokeRect(this.position.x+15, this.position.y, this.width-30, this.height)
            ctx.drawImage(pumpkinJumpImages[5], this.position.x, this.position.y, this.width, this.height);
        }
        die(){
            player.gun.bullets.forEach(bullet=>{
                let closestX= Math.max(this.position.x+10,Math.min(bullet.x,this.position.x-20+this.width))
                let closestY=Math.max(this.position.y+4,Math.min(bullet.y,this.position.y+4+this.height))
                let dx=closestX-bullet.x
                let dy=closestY-bullet.y
                let distance=Math.sqrt(dx*dx + dy*dy)
                if(distance <=bullet.radius){
                    pumpkins.pop()
                    blocks.forEach(block=>{
                        block.jumped=false;
                    })
                    if(pumpkins.length===0){
                        setTimeout(()=>{pumpkins.push(new Pumpkin())},2000)
                        }
                    player.gun.bullets.splice(player.gun.bullets.indexOf(bullet), 1);
                    player.score+=30;
                }
            })
            mines.forEach(mine=>{
                if(!mine.actived &&
                    (mine.x + mine.width - 30 >= this.position.x + 10 && mine.x + 15 <= this.position.x - 20 + this.width) &&
                    Math.abs((mine.y + mine.height) - (this.position.y + 4 + this.height)) <= 10){
                    mine.actived=true;
                    pumpkins.pop()
                    blocks.forEach(block=>{
                        block.jumped=false;
                    })
                    if(pumpkins.length===0){
                        setTimeout(()=>{pumpkins.push(new Pumpkin())},2000)
                        }
                    mine.explosionStartTime=Date.now()
                }
            })
        }
    }
    pumpkins.push(new Pumpkin())
    // Zombie class
    class Zombie {
        constructor(x,speed,direction) {
            this.x = x;
            this.y = CANVAS_HEIGHT-173/2+1;
            this.direction=direction;
            this.speed=0.3;
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
            mines.forEach(mine=>{
                if(!mine.actived && !(mine.x+ mine.width-30< this.x+this.marginx || mine.x+15 >this.x+this.marginx+this.width)&&(Math.abs((mine.y+mine.height)-(this.y+this.height))<=3)){
                    mine.actived=true;
                    zombies.splice(zombies.indexOf(this), 1);
                    mine.dead=this
                    mine.explosionStartTime=Date.now()
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
        constructor(n,x,y) {
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
            this.x = x
            }
            this.y = y;
            this.destroyed=false
            this.stoppedZombies=[]
            this.zombie=null;
            this.jumped=false;
            this.hasGun = (this.n===4);
            this.lastShotTime1 = 0;
            this.lastShotTime2 = 0;
            this.shotInterval = 10000;
            if(this.hasGun){
            this.gun1Position = { x: this.x, y: this.y+5 }; 
            this.gun2Position = { x: this.x + this.width, y: this.y+5}
            }
          }
          update() {
            if (this.hasGun) {
                this.shoot();
            }
        }
    
        shoot() {
            const currentTime = Date.now();
    
            if (currentTime - this.lastShotTime1 > this.shotInterval) {
                this.shootBullet(this.gun1Position);
                this.lastShotTime1 = currentTime;
            }
    
            if (currentTime - this.lastShotTime2 > this.shotInterval) { // Slight delay for the second gun
                this.shootBullet(this.gun2Position);
                this.lastShotTime2 = currentTime;
            }
        }
    
        shootBullet(gunPosition) {
            const bulletDirection = (this.x=== gunPosition.x) ?  Math.PI :0;
            let bullet =null
            if(bulletDirection===0){
                bullet = new Bullet(gunPosition.x+30, gunPosition.y,bulletDirection,10);
            }
            else{
                bullet = new Bullet(gunPosition.x-30, gunPosition.y,bulletDirection,10);
            }
            player.gun.bullets.push(bullet);
        }

          draw(){
            ctx.drawImage(blockImage,this.x,this.y,this.width,this.height)
            if(this.hasGun){
                ctx.save(); ctx.strokeStyle = 'green'; 
                ctx.lineWidth = 10;
                 ctx.beginPath(); 
                ctx.moveTo(this.gun1Position.x, this.gun1Position.y); 
                ctx.lineTo(this.gun1Position.x-30, this.gun1Position.y); 
                ctx.moveTo(this.gun2Position.x, this.gun2Position.y); 
                ctx.lineTo(this.gun2Position.x+30, this.gun2Position.y); 
                ctx.stroke(); ctx.closePath(); 
                ctx.restore();
            }
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
     isOnTopOfBlock(block) {
        for (let otherBlock of blocks) {
            if(!otherBlock.destroyed){
            if (
                block !== otherBlock &&
                block.x < otherBlock.x + otherBlock.width &&
                block.x + block.width > otherBlock.x &&
                block.y + block.height === otherBlock.y
            ) {
                return true;
            }
        }
    }
        
        return false;
    }
    isOnGround(block) {
        if(block.y + block.height >= CANVAS_HEIGHT){
            block.y >= CANVAS_HEIGHT- block.height 
            return true;
        }
    }
    isSupported(block) {
        return block.isOnGround(block) || block.isOnTopOfBlock(block);
    }
    applyGravity(block) {
        if (!block.isSupported(block)) {
            block.y += gravity;
            if (block.x < player.position.x + player.width-10 &&
                block.x + block.width > player.position.x+10 &&
                block.y < player.position.y + player.height &&
                block.y + block.height > player.position.y) {
                    player.health=0;
            }
        }
    }
    
 }
        function pushBlock(x,y,n){
            blocks.push(new Block(n,x,y))
        }
    const minPower=5000
    const maxPower=5000
    class PowerUps{
            constructor(){
                this.x=Math.random()*(CANVAS_WIDTH-1)+1;
                this.y=0;
                this.speed=3;
                this.frame1=Math.floor(Math.random()*3)
                this.frame2=Math.floor(Math.random()*2)
                this.width=30;
                this.height=30;
                this.startTime=Date.now();
                this.duration=5000;
                switch(this.frame1+this.frame2){
                      case 0:this.power='fast';
                             this.marginx=11.4/2
                                        break;
                      case 1:if(this.frame1){
                             this.power= 'revive';
                             this.marginx=11.4/4
                             break;
                             }
                             if(this.frame2){
                                this.power='immunity';
                                this.marginx=11.4/2
                                break;
                             }
                                         break;
                      case 2:this.power='score';
                            this.marginx=11.4/4
                                         break;
                }
                if(this.frame1===2){
                    this.power='jetpack'
                    this.marginx=0;
                }
                console.log(this.power)
            }
            update(){
                if(Date.now()-this.startTime>this.duration){
                 return false;
                }
                else{
                    this.y+=this.speed
                    if(this.y>=CANVAS_HEIGHT-this.height){
                        this.y=CANVAS_HEIGHT-this.height;
                    }
                    blocks.forEach(block=>{
                        if(!block.destroyed &&
                        this.x + this.marginx < block.x + block.width&&
                        this.x + this.marginx + this.width > block.x &&
                        this.y+this.height>= block.y &&
                        this.y + this.height <= block.y+5
                        ){
                            this.y=block.y-this.height
                        }
                    })
                }
                return true;
            }
            draw(){
               // ctx.strokeStyle='rgb(255,255,255)'
               if(this.frame1===2){
                ctx.drawImage(jetpackImage,0,0,436,480,this.x,this.y,30,30)
               }
               else{
                ctx.strokeRect(this.x+this.marginx,this.y,this.width-11.5/2,this.height)
                ctx.drawImage(powerups,this.frame1*50,this.frame2*50,50,50,this.x,this.y,this.width,this.height)
               }
            }
    }
    let Powers=[]
    function powerup(){
         Powers.push(new PowerUps())
         scheduleNextpowerup()
    }
    function scheduleNextpowerup(){
        const nextInterval = Math.random() * (maxPower - minPower) +minPower;
        setTimeout(powerup, nextInterval);
    }
    function drawPower(){
        for(let i=0;i<Powers.length;i++){
            if(!Powers[i].update()){
                Powers.splice(i,1)
            }
            else{
                Powers[i].draw();
            }
        }
    }
    function eventlistener(){
        canvas.addEventListener('mousedown',(e)=>{ 
            if(player.weapon==='gun'){
            mouse.x=e.offsetX ;
            mouse.y=e.offsetY ;
            player.gun.startDragging() }
            else if(player.onGround){
                if(!isPaused){
                    input.update()
            }
        }
        }) 
        
        canvas.addEventListener('mousemove', (event) => { 
            if(player.weapon==='gun'){
            mouse.x = event.offsetX; mouse.y = event.offsetY; }
            return
        });
        
        canvas.addEventListener('mouseup', () => { 
            if(player.weapon==='gun'){ 
            player.gun.stopDragging();
            if(!isPaused){
            input.update()
            }
        }
        });
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
            block.applyGravity(block);
            block.update();
            block.draw();
            isCollision=true;
            }
        })
        mines.forEach(mine=>{
            mine.update()
            mine.draw()
        })
        zombies.forEach(zombie=>{
            zombie.update();
            zombie.die()
            zombie.draw();
        })
        zombies.forEach(z=>{
            z.stop=false;
        })
       pumpkins.forEach(pumpkin=>{
            pumpkin.update()
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
        drawPower()
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
