class Player {
    constructor(x, y, w, h, c, g, jh) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = c;

        this.currentChunk = [];

        this.OGgravity = g;
        this.gravity = this.OGgravity;
        this.xv = 0;
        this.yv = 0;

        this.gravityDir = 1;

        this.spd = 3;
        this.OGjumpheight = jh;
        this.doubleJumpHeight = this.OGjumpheight * 1.2;
        this.jumpheight = this.OGjumpheight;

        this.doublejump = false;
        this.shield = false;
        this.magnet = false;

        this.activePowerups = [];

        this.jumps = 0;

        this.onGround = false;
        this.jumping = false;

        this.nojump = false;

        this.dead = false;
        this.exploded = false;

        this.currentBlock;

        this.shieldX = this.x + this.w * 1.1;
        this.shieldY = this.y;
        this.shieldW = 10;
        this.shieldH = this.h;

        // window.addEventListener("resize", () => {
        //     this.OGjumpheight = blockSize / 2;
        //     this.doubleJumpHeight = this.OGjumpheight * 1.2;
        //     this.jumpheight = this.OGjumpheight;
        // });
    }

    draw() {

        stage.fillStyle = this.color;
        stage.fillRect(this.x, this.y, this.w, this.h);
        stage.fillStyle = '#000';

        if (this.shield) {

            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);

            stage.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
            stage.fillRect(this.shieldX, this.y-10, this.shieldW, this.h+20);
            //stage.fillRect(this.shieldX, this.shieldY, this.shieldW, this.shieldH);

        }

    }

    physics(dt) {

        var min = this.gravityDir == 1 ? -65 : -25;
        var max = this.gravityDir == 1 ? 25 : 65;    

        //console.log(this.yv);

        this.yv = Math.clamp(this.yv, min, max);

        this.yv += this.gravity * this.gravityDir * dt;

        this.x += this.xv * this.spd * dt;

        if (!this.dead && physicsTicking) {
            this.y += this.yv * dt;
        }
    }

    update(){

        for(p=0;p<this.activePowerups.length;p++){

            if(this.activePowerups[p].expireTime <= 0 || this.activePowerups[p].uses == 0){
                eval("player." + this.activePowerups[p].type + " = false;");
                this.activePowerups.splice(p,1);
            } else {
                this.activePowerups[p].update();
            }

        }

        this.shieldX = this.x + this.w * 1.4;
        this.shieldY = this.y+this.h/3;
        this.shieldW = 10;
        this.shieldH = this.h/5;

    }

    hasPowerup(type){

        for(p=0;p<player.activePowerups.length;p++){
            if(player.activePowerups[p].type == type){
                return true;
            }
        }

        return false;

    }

    jump() {
        this.jumpheight = this.jumps == 0.5 ? this.doubleJumpHeight : this.OGjumpheight;
        if(this.jumps == 0.5){
            var DJ = this.activePowerups[this.activePowerups.findIndex(dj => dj.type == "doublejump")]
            DJ.uses-=1;
        }
        
        if (this.jumps < 1) {
            let scalingFactor = screenHeightMagnitude * (blockSize / 83);
            this.onGround = false;
            this.jumping = true;
            this.yv = -this.jumpheight * this.gravityDir * scalingFactor;
            this.jumps = this.doublejump ? this.jumps + 0.5 : this.jumps + 1;
        }
    }

    shieldCollision(block){
        if (
            this.shieldX+this.shieldW >= block.x && this.shieldX <= block.x+block.w && this.shieldY+this.shieldH >= block.y && this.shieldY <= block.y+block.h
          ) {
            // Collision detected!
            return true;
          } else {
            // No collision
            return false;
          }
    }

}