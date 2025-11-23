class Particle {

    constructor(x, y, w, h, c, xv, yv, g) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = c;

        this.xv = xv;
        this.yv = yv;
        this.gravity = g;

        this.counter = 0;
        //this.expire = 20;

    }

    draw() {

        stage.fillStyle = this.color;
        stage.fillRect(this.x, this.y, this.w, this.h);
        stage.fillStyle = '#000';

    }

    physics(deltaTime) {

        this.yv += this.gravity * deltaTime;

        this.x += this.xv * deltaTime;
        this.y += this.yv * deltaTime;

    }

}

class Label {
    constructor(text, x, y, fontSize, color, RGB) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.riseSpd = Math.random() * (10 - 5) + 5;
        this.fontSize = fontSize;

        this.color = color;
        this.RGB = RGB;
    }

    draw(deltaTime) {

        stage.font = this.fontSize + 'px CoolFont';
        if (this.RGB) this.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
        stage.fillStyle = this.color;
        stage.fillText(this.text, this.x, this.y);

        this.y -= this.riseSpd * deltaTime;

    }
}