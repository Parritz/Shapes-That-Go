var stage = document.getElementById('canvas').getContext('2d');
stage.canvas.width = window.innerWidth;
stage.canvas.height = window.innerHeight;

let screenHeightMagnitude = 1080/window.outerHeight;
stage.imageSmoothingEnabled = false;

var screenShake = false;
var shakeAmount = 15;
//const globalScrollSpd = 0;
var globalGravity = 5.1;
//const globalGravity = 0;
//const globalGravity = 3;


var blockSize = Math.round(stage.canvas.height / levels[0].length);
//const blockSize = Math.round(stage.canvas.width/22.95);

//const scrollSpd = blockSize / 3;
const scrollSpd = Math.round(stage.canvas.width / 71);
var globalScrollSpd = scrollSpd;

var chunks = [new Chunk(startingChunk, 0, 0, blockSize)]

var player = new Player(stage.canvas.width / 4, 300, blockSize, blockSize, 'red', globalGravity, blockSize / 2);

var blocks = [];

var powerups = [];

var pogs = [];

var particles = [];

var labels = [];

var deathMessages = ['you have passed away peacefully', 'that was embareningson', 'my grandma can do better than that', "you died. couldn't be me", "if you die, you're racist", "skill issue"];
var chicken = false;

var score = 0;

var scoreCoolDown = 10;
var scoreCD = scoreCoolDown;

var deathScreen = document.getElementById('death_overlay');
var deathText = document.getElementById('death_text');
var deathMsg = document.getElementById('death_t')
var scoreText = document.getElementById('score_t');
var retryBtn = document.getElementById('death_button');

var scoreX = 30;
var scoreY = 80;
var textSize = Math.round(stage.canvas.width / 35);

var powerupX = stage.canvas.width / 1.2;
var powerupY = 100;

// Get highscore from game.ejs now instead of cookie

// if (getCookie("highscore") != "") {
//     highscore = Number(getCookie("highscore"));
// } else {
//     highscore = 0;
// }

var canRestart = false

var chunksTillBonus = 15;

var gameTime = 0;

const globalPogImg = Math.round(Math.random() * 15) + 1;

/*var gravSymbols = {

    "-1" : String.fromCodePoint(0x2B06),
    "1" : String.fromCodePoint(0x2B07)

};*/

var gravImgs = {

    "-1": "sprites/arrows/up.png",
    "1": "sprites/arrows/down.png"

};

var gravArrow = new Image();

let gamepadIndex;
let gamepadConnected;
let gamepad;
window.addEventListener('gamepadconnected', (event) => {
    gamepadIndex = event.gamepad.index;
    gamepad = event.gamepad;
    gamepadConnected = true;
    labels.push(new Label("GAMEPAD CONNECTED", stage.canvas.width / 4, stage.canvas.height / 2.5, 75, '', true));
});

/*window.addEventListener("gamepadconnected", (e) => {
    console.log(
      "Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index,
      e.gamepad.id,
      e.gamepad.buttons.length,
      e.gamepad.axes.length,
    );
    labels.push(new Label("GAMEPAD CONNECTED", stage.canvas.width / 4, stage.canvas.height / 2.5, 75, '', true));
    window.gpConnected = true;
    window.gp = e.gamepad;
});*/

function buttonPressed(b) {
    if (typeof gamepad == 'object') {
        return gamepad.buttons[b].pressed;
    } else {
        return false;
    }
}

player.currentBlock = new Block(-500, -500, 0, 0, '#000', 0); // makes game not crash on startup

var lastLevel = 0;

player.currentChunk = chunks[0];
var latestChunk = chunks[0];

chunks[0].create();

let then = Date.now();
function getDeltaTime(){
    let now = Date.now()
    let dt = (now - then);
    then = now;

    return dt / (1000 / 60);
}

function update(timestamp) {
    let deltaTime = getDeltaTime();

    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight;
    stage.clearRect(0, 0, stage.canvas.width, stage.canvas.height);

    stage.canvas.style.left = screenShake ? String(Math.random() * (shakeAmount - -shakeAmount) + -shakeAmount) + "px" : 0; //Screenshake
    stage.canvas.style.top = screenShake ? String(Math.random() * (shakeAmount - -shakeAmount) + -shakeAmount) + "px" : 0; //Screenshake

    blockSize = Math.round(stage.canvas.height / latestChunk.chunk.length);

    //DrawObjects(globalScrollSpd); //Draws blocks and stuff

    //stage.fillStyle = 'green';
    //stage.fillRect(player.currentChunk.chunkX, player.currentChunk.chunkY, player.currentChunk.w, player.currentChunk.h);

    gameTime++;

    globalScrollSpd = Math.floor((scrollSpd + (gameTime / 1000))); //Make scrollspeed speed up longer you play

    globalScrollSpd = globalScrollSpd * deltaTime;

    globalGravity = globalGravity * deltaTime;

    var chunkRightSideX = latestChunk.chunkX + latestChunk.w;
    var chunkLeftSideX = latestChunk.chunkX;

    for (chunk = 0; chunk < chunks.length; chunk++) {
        chunks[chunk].draw();
        chunks[chunk].scroll(globalScrollSpd, player);

        if (player.x + player.w >= chunkLeftSideX) player.currentChunk = latestChunk;
        for (block = 0; block < chunks[chunk].blocks.length; block++) {
            if (chunks[chunk].blocks[block].x <= -200) {
                chunks[chunk].blocks.splice(block, 1);
            }
        }
    }

    if (chunkRightSideX <= stage.canvas.width + blockSize * 3) { // Spawns new chunk after the currentChunk
        var randomLevel = Math.round(Math.random() * levels.length) - 1;
        randomLevel = randomLevel <= 0 ? 1 : randomLevel;
        //if (randomLevel == lastLevel) randomLevel = lastLevel === 0 ? randomLevel + 1 : randomLevel - 1;
        lastLevel = randomLevel;
        chunksTillBonus--;
        isBonus = chunksTillBonus <= 0;
        var newChunk = new Chunk(isBonus ? bonus : levels[randomLevel], player.currentChunk.chunkX + player.currentChunk.w, 0, blockSize);
        chunks.push(newChunk);
        newChunk.create();
        latestChunk = newChunk;
        if (isBonus && !player.dead) {
            setTimeout(function () {
                if (isBonus) labels.push(new Label("BONUS", stage.canvas.width / 2.5, stage.canvas.height / 2.5, 75, '', true));
            }, 1000);
            chunksTillBonus = 15;
        }
    }

    stage.fillStyle = '#fff';
    //stage.font = String(textSize) + "px Comic Sans MS";
    stage.font = String(textSize) + "px CoolFont";
    //stage.fillRect(textX-20,textY-textSize/1.25,String(score).length*38,textSize*1);

    stage.fillStyle = '#000';
    if (!player.dead) stage.fillText(score, scoreX, scoreY);
    //stage.fillText(buttonPressed(0), scoreX, scoreY);

    //gravArrow.src = gravImgs[String(player.gravityDir)];

    //stage.drawImage(gravArrow, scoreX, scoreY+50, 75, 100);


    for (p = 0; p < player.activePowerups.length; p++) {
        powerup = player.activePowerups[p];
        if (powerup.expires) {
            powerupText = powerup.name + " " + Math.round(powerup.expireTime / 10);
            powerupX = stage.canvas.width - (powerupText.length * 25);
            powerupY = 100 + (p) * 100;
            /*if (powerup.expireTime < powerup.expireTimeOG / 4 && powerup.expires) {
                stage.fillStyle = Math.random() * 100 <= 60 ? '#ff0000' : 'rgba(0,0,0,0)';
            } else {
                stage.fillStyle = '#000';
            }*/

            if (!player.dead) {
                stage.fillText(powerupText, powerupX - (powerupText.length * 20), powerupY);
            }
        } else {
            powerupText = powerup.name + " " + Math.floor(powerup.uses);
            powerupX = stage.canvas.width - (powerupText.length * 25);
            powerupY = 100 + (p) * 100;
            stage.fillText(powerupText, powerupX - (powerupText.length * 20), powerupY);
        }

    }

    try {
        var outChunk = chunks.findIndex(chunk => chunk.blocks[0].x + chunk.w <= 0);
    } catch {
        console.error("EH I'M ERRORING HERE!");
    }

    if (outChunk !== -1) {
        chunks.splice(outChunk, 1);
    }

    for (p = 0; p < particles.length; p++) {
        particles[p].draw();
        particles[p].physics();
        if (particles[p].y >= stage.canvas.height) {
            particles.splice(p, 1);
        }
    }

    for (l = 0; l < labels.length; l++) {
        labels[l].draw();
        if (labels[l].y <= -100) labels.splice(l, 1);
    }

    player.jumping = !player.onGround;

    if (player.magnet && player.x + player.w >= player.currentChunk.chunkX + player.currentChunk.w / 6) {
        for (p = 0; p < player.currentChunk.pogs.length; p++) {
            (function (i) {
                var pog = player.currentChunk.pogs[i];
                setTimeout(() => {
                    pog.magnetized = true;
                }, i * 50);
            })(p);
        }
    }

    if (!player.dead) {
        player.draw();
        player.physics(deltaTime);
        player.update();
        scoreCD -= deltaTime; 
        testPlayerCollisions(player.currentChunk);
    } else {
        if (!player.exploded) { //Make player explode if the player has not already exploded
            explode(30, player, globalGravity);
            player.exploded = true;
            shakeScreen(250);
        }
        if (!chicken) {
            //deathText.innerHTML = deathMessages[Math.round(Math.random()*deathMessages.length)-1];
            chicken = true;
        }
        deathScreen.style.visibility = "visible";
        deathText.style.visibility = 'visible';
        if (score > highscore) {
            highscore = score;
            fetch("/submiths", {
                method: "POST",
                body: JSON.stringify({
                    score: score
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            scoreText.innerHTML = 'SCORE: ' + score;
            deathText.style.visibility = 'visible';
            deathMsg.innerHTML = 'NEW HIGH SCORE!';
            deathMsg.style.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
            // setCookie("highscore", String(score), 400);
            setTimeout(function () { canRestart = true }, 1000);
        } else {
            scoreText.innerHTML = 'SCORE: ' + score;
            deathText.style.visibility = 'visible';
            canRestart = true
        }
    }

    if (player.onGround) {

        player.jumps = 0;

    }

    if (player.y >= stage.canvas.height || player.y < -400) { player.dead = true; } // Kill the player if it falls off the map

    if (scoreCD < 0 && !player.dead) {
        score += 100;
        scoreCD = scoreCoolDown;
    }

    requestAnimationFrame(update);
}

document.addEventListener('keydown', function (event) {

    if (event.key == ' ' && (player.onGround || (player.jumping && player.doublejump && player.jumps == 0.5)) && !player.dead && !player.nojump) {
        player.jump();
    }

    if (event.key == ' ' && player.dead && canRestart) {

        location.reload();

    }

    if ((event.key == 'f' || event.key == 'F') && player.onGround) {

        player.gravityDir = -player.gravityDir;
        player.onGround = false;

        /*if (globalScrollSpd == 0) {
            globalScrollSpd = Math.round(stage.canvas.width / 75);
        } else {
            globalScrollSpd = 0;
        }*/

    }


})

window.onload = function () {
    setInterval(enablePhysics, 100);
    requestAnimationFrame(update);
}

function shakeScreen(time) {

    screenShake = true;

    setTimeout(function () {

        screenShake = false;

    }, time)

}