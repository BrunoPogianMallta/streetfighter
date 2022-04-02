const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0, canvas.width, canvas.height);

const gravity = 0.7

const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './img/blanka-map.png'
})

const player = new Fighter({
    position:{
        x:0,
        y:0
   },
   velocity: {
       x: 0,
       y: 0
   },
   offset:{
       x:0,
       y:0
   },
   imageSrc: './img/ryu/ryu-parado.png',
   framesMax:6,
   scale:2,
   offset: {
    x:-300,
    y:1
   },
   sprites: {
    idle:{
        imageSrc: './img/ryu/ryu-parado.png',
        framesMax: 6,
    },
    walking:{
        imageSrc: './img/ryu/ryu-andando.png',
        framesMax:6,
        image: new Image()
    },
    jump:{
        imageSrc: './img/ryu/ryu-pulando.png',
        framesMax:3,
        image: new Image()
    },
    fall:{

    }
   }
})

const enemy = new Fighter({
    position: {
        x:400,
        y:100
    },
velocity:{
        x: 0,
        y: 0
    },
color:'blue',
offset:{
    x:- 50,
    y: 0
}
})

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
}

function retangularColision({rectangle1,rectangle2}) {
    return(
    rectangle1.atackBox.position.x + rectangle1.atackBox.width >= rectangle2.position.x && 
    rectangle1.atackBox.position.x <= rectangle2.position.x + rectangle2.width && 
    rectangle1.atackBox.position.y + rectangle1.atackBox.height >= rectangle2.position.y && 
    rectangle1.atackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player,enemy,timeId}){
    clearTimeout(timeId)
    document.querySelector("#empate").style.display ='flex';
    if(player.health === enemy.health){
        document.querySelector("#empate").innerHTML = "EMPATE"
     }else if(player.health > enemy.health){
         document.querySelector("#empate").innerHTML = "PLAYER1 VENCEU"
         
     }else if(player.health < enemy.health){
         document.querySelector("#empate").innerHTML = "PLAYER2 VENCEU"  
     }
}

let timer = 60;
let timeId 
function decreaseTimer(){
    if(timer >0){
        timerId = setTimeout(decreaseTimer,1000)
        timer--
        document.querySelector('#timer').innerHTML= timer
    }
    if(timer === 0){
        determineWinner({player,enemy,timeId});
   }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    player.update()
    // enemy.update()
    player.velocity.x = 0
    enemy.velocity.x = 0
    
//player movement

if(keys.a.pressed && player.lastKey === 'a'){
    player.velocity.x = -5
    player.switchSprite('walking')
}else if(keys.d.pressed && player.lastKey === 'd'){
    player.velocity.x = 5
    player.switchSprite('walking')
}else {
    player.switchSprite('idle')
}
if(player.velocity.y < 0){
    player.switchSprite('jump')
}

//enemy movement
if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
    enemy.velocity.x = -5
}else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = 5
}

//detect colision
if(retangularColision({rectangle1: player,rectangle2: enemy})&&
    player.isAttacking
){
    player.isAttacking = false
    console.log("enemy acertou")
    enemy.health -= 20
    document.querySelector('#enemyHealth').style.width = enemy.health+'%'
}
if(retangularColision({
    rectangle1: enemy,
    rectangle2: player
})&&
    enemy.isAttacking
){
    enemy.isAttacking = false
    player.health -= 20
    document.querySelector('#playerHealth').style.width = player.health+'%'
}
//end game based on health
if(enemy.health <= 0 || player.health <= 0){
  determineWinner({player,enemy,timeId})  
}
    
}

    
animate()

window.addEventListener('keydown',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey ='d'
            break;
        case 'a':
           keys.a.pressed = true
           player.lastKey = 'a'
            break;
        case 'w':
            player.velocity.y = -16
            keys.w.pressed = true
            break;
        case ' ':
            player.attack()
            break; 
        
         case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey ='ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20
            break;
        case 'ArrowDown':
            enemy.attack()
            break;
    

        
        
    }
})

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
        break;
            case 'w':
            keys.w.pressed = false
        
    }
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break;
            case 'w':
            keys.w.pressed = false
        
    }
})
