// Prevent potential death when game first starts
let physicsTicking = false;
function enablePhysics() {
    physicsTicking = true;
}

function testPlayerCollisions(currentChunk) {
    //BLOCK COLLISION

    var topBlockIndex = currentChunk.blocks.findIndex(block => topCollision(player, block));
    var bottomBlockIndex = currentChunk.blocks.findIndex(block => bottomCollision(player, block));
    var sideBlockIndex = currentChunk.blocks.findIndex(block => sideCollision(player, block));

    // Testing for player's feet colliding with the top of a block

    if (topBlockIndex !== -1) {
        if (currentChunk.blocks[topBlockIndex].type == 'block') {
            player.y = currentChunk.blocks[topBlockIndex].y - player.h;
            player.yv = 0;
            if (player.gravityDir === 1) player.onGround = true;
        }

        if (currentChunk.blocks[topBlockIndex].type == 'spike' && physicsTicking) {
            player.dead = true;
        }

        if (currentChunk.blocks[topBlockIndex].type == 'bounce') {
            player.y = currentChunk.blocks[topBlockIndex].y - player.h;
            player.yv = -player.yv * currentChunk.blocks[topBlockIndex].bounceHeight;
            player.onGround = false;
        }
    }

    //Testing for player's head colliding with the bottom of a block.
    if (bottomBlockIndex !== -1) {
        console.log(currentChunk.blocks[bottomBlockIndex].type);
        if (currentChunk.blocks[bottomBlockIndex].type == 'block') {
            player.y = currentChunk.blocks[bottomBlockIndex].y + currentChunk.blocks[bottomBlockIndex].h;
            player.yv = 0;
            if (player.gravityDir === -1) player.onGround = true;
        }

        if (currentChunk.blocks[bottomBlockIndex].type == 'bounce') {
            player.y = currentChunk.blocks[bottomBlockIndex].y + currentChunk.blocks[bottomBlockIndex].h;
            player.yv = -player.yv * currentChunk.blocks[bottomBlockIndex].bounceHeight;
            player.onGround = false;
        }

        if (currentChunk.blocks[bottomBlockIndex].type == 'spike' && physicsTicking) {
            player.dead = true;
        }
    }

    //Testing if the player hits a block on it's side

    if (sideBlockIndex !== -1) {
        if (player.shield) {
            explode(15, currentChunk.blocks[sideBlockIndex], globalGravity);
            currentChunk.blocks.splice(sideBlockIndex, 1);
            var sh = player.activePowerups[player.activePowerups.findIndex(sh => sh.type == 'shield')]
            sh.uses--;
            //shakeScreen(100)
            screenShake = true;
        } else if (physicsTicking) {
            player.onGround = true;
            player.dead = true;
        }
    } else {

        screenShake = false;

    }

    if (player.gravityDir == 1) player.nojump = blocks.some(block => block.y == player.y - player.h && player.x + player.w >= block.x && player.x <= block.x + block.w); // Disable jumping if there is a block directly above the player
    if (player.gravityDIr == -1) player.nojump = blocks.some(block => block.y == player.y + player.h && player.x + player.w >= block.x && player.x <= block.x + block.w)

    //SHIELD COLLISION
    if (player.shield) {
        shieldBlockIndex = currentChunk.blocks.findIndex(block => player.shieldCollision(block));
        if (shieldBlockIndex !== -1) {
            explode(15, currentChunk.blocks[shieldBlockIndex], globalGravity);
            currentChunk.blocks.splice(shieldBlockIndex, 1);
            var sh = player.activePowerups[player.activePowerups.findIndex(sh => sh.type == 'shield')]
            sh.uses--;
            //shakeScreen(100)
            screenShake = true;

        }
    }

    //POWERUP COLLISION

    chunkPowerups = currentChunk.powerups;
    powerupIndex = chunkPowerups.findIndex(powerup => collision(player, powerup));

    if (powerupIndex !== -1 && !chunkPowerups[powerupIndex].collected) {
        var powerup = chunkPowerups[powerupIndex];
        var powerupType = powerup.type;
        var powerupName = powerup.name;
        var playerHasPowerup = false;

        if (!player.hasPowerup(powerupType)) {
            player.activePowerups.push(powerup);
            labels.push(new Label(powerupName, player.x, player.y, 25, '', true));
            eval("player." + powerupType + " = true;");
            powerup.collected = true;
        }
    }

    //POG COLLISION

    chunkPogs = currentChunk.pogs;
    pogIndex = chunkPogs.findIndex(pog => collision(pog, player));

    if (pogIndex !== -1) {
        points = 500;
        score += points;
        labels.push(new Label('+' + String(points), player.x, player.y, 15, '#000', false));
        chunkPogs.splice(pogIndex, 1);
    }
}