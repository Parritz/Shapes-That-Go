class Block {

    constructor(x, y, w, h, c) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = c;

        this.index = 0;

        this.type = 'block';

    }

    draw() {

        stage.fillStyle = this.color;
        stage.lineWidth = 1;
        stage.fillRect(this.x, this.y, this.w, this.h);
        stage.strokeRect(this.x, this.y, this.w, this.h);
        stage.fillStyle = '#000';

    }

    scroll(scrollSpd) {

        this.x -= scrollSpd;

    }

}

class Spike {

    constructor(x, y, w, h, c, dir) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = c;

        this.index = 0;

        this.type = 'spike';
        this.direction = dir;

    }

    draw() {
        stage.fillStyle = this.color;
        stage.lineWidth = 1;

        if (this.direction == 1) {
            stage.beginPath();
            stage.moveTo(this.x, this.y + this.h);
            stage.lineTo(this.x + this.w / 2, this.y);
            stage.lineTo(this.x + this.w, this.y + this.h);
            stage.lineTo(this.x, this.y + this.h);
            stage.fill();
            stage.fillStyle = '#000000';
        } else if (this.direction == -1) {
            stage.beginPath();
            stage.moveTo(this.x, this.y);
            stage.lineTo(this.x + this.w / 2, this.y + this.h);
            stage.lineTo(this.x + this.w, this.y);
            //stage.lineTo()
            stage.fill();
            stage.fillStyle = '#000000';
        }
    }

    scroll(scrollSpd) {

        this.x -= scrollSpd;

    }

}

class Bounce {

    constructor(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = c;

        this.index = 0;

        //this.bounceHeight = 10;
        this.bounceHeight = 60;

        this.type = 'bounce';
    }

    draw() {
        stage.fillStyle = this.color;
        stage.lineWidth = 1;
        stage.fillRect(this.x, this.y, this.w, this.h);
        stage.strokeRect(this.x, this.y, this.w, this.h);
        stage.fillStyle = '#000';
    }

    scroll(scrollSpd) {

        this.x -= scrollSpd;

    }

}

class Powerup {
    constructor(x, y, w, h, type, name, expires, expireTime, uses) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.expires = expires;

        this.uses = uses;

        this.expireTimeOG = expireTime;
        this.expireTime = this.expireTimeOG;
        this.expiring = false;

        this.img = new Image();

        this.collected = false;

        this.type = type;
        this.name = name;

        this.img.src = "sprites/powerups/" + this.type + ".png";
    }

    draw() {
        //stage.fillRect(this.x, this.y, this.w, this.h);
        stage.drawImage(this.img, this.x, this.y, this.w, this.h);
    }

    update(deltaTime) {
        if (this.expires) {
            this.expireTime -= deltaTime;
        }
    }

    scroll(scrollSpd) {
        this.x -= scrollSpd;
    }
}

class Pog {
    constructor(x, y, w, h, img) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.xv = 0;
        this.yv = 0;

        this.magnetized = false;
        this.magnetSpd = Math.floor(Math.random() * (25 - 20) + 20)

        this.img = new Image();
        this.img.src = "sprites/pogs/CP" + img + ".png";

    }

    draw(deltaTime) {
        stage.drawImage(this.img, this.x, this.y, this.w, this.h);
        if (this.magnetized) {
            var dirX = player.x - this.x;
            var dirY = player.y - this.y;
            var magnitude = Math.floor(Math.sqrt(dirX ** 2 + dirY ** 2));
            dirX = dirX / magnitude;
            dirY = dirY / magnitude;

            this.x += dirX * this.magnetSpd * deltaTime;
            this.y += dirY * this.magnetSpd * deltaTime;
        }
    }

    scroll(scrollSpd) {
        this.x -= scrollSpd;
    }
}