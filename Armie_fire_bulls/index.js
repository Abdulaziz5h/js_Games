// variables declarations
const canvas            = document.getElementById("main-canvas");
const scoreCounter      = document.getElementById('score-counter');
const scoreCounterOver  = document.getElementById('score-counter-over');
const StartBtn          = document.getElementById('start-btn');
const gameOverDialog    = document.querySelector('.game-over-ui');

canvas.height   = innerHeight;
canvas.width    = innerWidth;
const context   = canvas.getContext("2d");

// player class
class player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw = function () {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
    }
}
let heroPlayer = new player(canvas.width / 2, canvas.height / 2, 10, "white");
let GunShots  = [];
let Enemies   = [];
let Motions   = [];
function init() {
    // create player
    scoreCounter.innerText = 0;
    heroPlayer = new player(canvas.width / 2, canvas.height / 2, 10, "white");
    GunShots  = [];
    Enemies   = [];
    Motions   = [];
}

const friction = 0.97;

let animationId;
let spawnEnemyInterval;
// classes declarations

// player's gunshot class
class GunShot extends player {
    constructor(x, y, radius, color, velocity){ 
        super(x, y, radius, color);
        this.velocity = velocity;
    }
    update = function() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;    
    }
}
// Enemy class
class Enemy extends player {
    constructor(x, y, radius, color, velocity){ 
        super(x, y, radius, color);
        this.velocity = velocity;
    }
    update = function() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;    
    }
}
// motion class
class motion {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw = function () {
        context.save();
        context.beginPath();
        context.globalAlpha = this.alpha;
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }
    update = function() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}


// animate gunShots and enemies
function animate() {
    animationId = requestAnimationFrame(animate);
    context.fillStyle = "rgba(28, 23, 57, 0.2)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    heroPlayer.draw();
    Motions.forEach((motion, index) => {
        if (motion.alpha <= 0) {
            Motions.splice(index, 1); 
        } else {
            motion.update();
        }
    })
    // remove from edges of screen
    GunShots.forEach((gunShot, index) => {
        gunShot.update();
        if (
            gunShot.x + gunShot.radius < 0
            || gunShot.x - gunShot.radius > canvas.width
            || gunShot.y + gunShot.radius < 0
            || gunShot.y - gunShot.radius > canvas.height
        ) {
            setTimeout(() => {
                GunShots.splice(index, 1);
            })
        }
    });
    Enemies.forEach((enemy, indexEnemy) => {
        enemy.update();
        const dest = Math.hypot(heroPlayer.x - enemy.x, heroPlayer.y - enemy.y);
            if (dest - heroPlayer.radius - enemy.radius < 1) {
                cancelAnimationFrame(animationId);
                clearInterval(spawnEnemyInterval);
                scoreCounterOver.innerText = scoreCounter.innerText;
                gameOverDialog.style.opacity = 1;
                gameOverDialog.style.visibility = "visible";
            }
        GunShots.forEach((gunShot, indexGunShot) => {
            const dest = Math.hypot(gunShot.x - enemy.x, gunShot.y - enemy.y);
            if (dest - gunShot.radius - enemy.radius < 1) {
                for (let i= 0; i < enemy.radius * 2; i++){
                    Motions.push(new motion(gunShot.x, gunShot.y, Math.random() * 2, enemy.color, 
                            {
                                x: (Math.random() - 0.5) * (Math.random() * 7),
                                y: (Math.random() - 0.5) * (Math.random() * 7)
                            })
                    )
                }
                if (enemy.radius - 6 > 10) {
                    enemy.radius -= 10;
                    setTimeout(() => {
                        GunShots.splice(indexGunShot, 1);
                        scoreCounter.innerText = +scoreCounter.innerText + 1;
                    })
                } else {
                    setTimeout(() => {
                        Enemies.splice(indexEnemy, 1);
                        GunShots.splice(indexGunShot, 1);
                        scoreCounter.innerText = +scoreCounter.innerText + 2;
                    })
                }
            }
        })
    });
}
function spawnEnemy() {
    spawnEnemyInterval = setInterval(() => {
        const   
            radius = Math.random() * (30 - 8) + 8,
            color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        let x, y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
            
        const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x);
        const velocity = {
            x: Math.cos(angle) * 2,
            y: Math.sin(angle) * 2
        };

        Enemies.push(new Enemy(x, y, radius, color, velocity));
        console.log(Enemies); 
    }, 1000);
}

// listen to gunShot
addEventListener("click", function (event) {
    const angle = Math.atan2(event.clientY - canvas.height/2, event.clientX - canvas.width/2);
    const velocity = {
        x: Math.cos(angle) * 10,
        y: Math.sin(angle) * 10
    }
    GunShots.push(new GunShot(innerWidth / 2, innerHeight / 2, 5, "white", velocity));
    console.log(GunShots);  
});

// start animate play
StartBtn.addEventListener('click', () => {
    init();
    animate();
    spawnEnemy();
    gameOverDialog.style.opacity = 0;
    gameOverDialog.style.visibility = "hidden";
})
