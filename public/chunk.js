class Chunk {
    constructor(level, x, y, blockSize) {
        this.chunk = level;
        this.blockSize = blockSize;
        this.blocks = [];
        this.powerups = [];
        this.pogs = [];

        this.shieldChance = 25;
        this.doubleJumpChance = 40;
        this.magnetChance = 10;

        this.OGX = x;

        this.x = x;
        this.y = y;

        this.chunkY = this.y;
        this.chunkX = this.x;

        //this.chunkX = this.x;

        this.w = 0;
        this.h = 0;

    }

    create() {

        for (let i = 0; i < this.chunk.length; i++) {

            for (let j = 0; j < this.chunk[i].length; j++) {

                if (this.chunk[i][j] == 1) {

                    this.blocks.push(new Block(this.x, this.y, this.blockSize, this.blockSize, 'blue'))
                    //this.pogs.push(new Pog(this.x, this.y, this.blockSize/1.1, this.blockSize/1.1));

                } else if (this.chunk[i][j] == 2) {

                    this.blocks.push(new Spike(this.x + (this.blockSize / 6), this.y, this.blockSize - (this.blockSize / 3), this.blockSize, 'orange', 1));

                } else if (this.chunk[i][j] == 3) {

                    this.blocks.push(new Spike(this.x + (this.blockSize / 6), this.y, this.blockSize - (this.blockSize / 3), this.blockSize, 'orange', -1))

                } else if (this.chunk[i][j] == 4) {

                    this.blocks.push(new Bounce(this.x, this.y, this.blockSize, this.blockSize, '#32a852'));

                } else if (this.chunk[i][j] == 5 && Math.random() * 100 < this.doubleJumpChance) {

                    this.powerups.push(new Powerup(this.x + this.blockSize / 13, this.y, this.blockSize / 1.1, this.blockSize / 1.1, "doublejump", "Double Jump", false, 600, 3));

                } else if (this.chunk[i][j] == 6 && Math.random() * 100 < this.shieldChance) {

                    this.powerups.push(new Powerup(this.x + this.blockSize / 13, this.y, this.blockSize / 1.1, this.blockSize / 1.1, "shield", "Shield", true, 1000, 100));

                } else if (this.chunk[i][j] == 8 && Math.random() * 100 < this.magnetChance) {

                    this.powerups.push(new Powerup(this.x + this.blockSize / 13, this.y, this.blockSize / 1.1, this.blockSize / 1.1, "magnet", "Magnet", true, 500, 10));

                } else if (this.chunk[i][j] == 7) {

                    this.pogs.push(new Pog(this.x, this.y, this.blockSize / 1.1, this.blockSize / 1.1, globalPogImg));

                }

                this.x += this.blockSize;
                this.w += this.blockSize / 10;

            }

            this.y += this.blockSize;
            this.h += this.blockSize;
            this.x = this.OGX;

        }
    }

    draw(deltaTime) {
        for (let block = 0; block < this.blocks.length; block++) {
            this.blocks[block].draw();
        }

        for (let powerup = 0; powerup < this.powerups.length; powerup++) {
            if (!this.powerups[powerup].collected) {
                this.powerups[powerup].draw();
            }
        }

        for (let pog = 0; pog < this.pogs.length; pog++) {
            this.pogs[pog].draw(deltaTime);
            if (this.pogs[pog].x < -100) {

                this.pogs.splice(pog, 1);

            }
        }
    }

    scroll(scrollSpd, player, deltaTime) {
        scrollSpd = scrollSpd * deltaTime;

        for (let block = 0; block < this.blocks.length; block++) {
            if (!player.dead) {
                this.blocks[block].scroll(scrollSpd);
            }
        }

        for (let powerup = 0; powerup < this.powerups.length; powerup++) {
            if (!player.dead) this.powerups[powerup].scroll(scrollSpd);
        }

        if (!player.dead) {
            this.chunkX -= scrollSpd;
        }

        for (let pog = 0; pog < this.pogs.length; pog++) {
            this.pogs[pog].draw(deltaTime);
            if (!player.dead) this.pogs[pog].scroll(scrollSpd);
        }
    }
}