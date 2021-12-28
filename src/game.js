import * as Input from "./input.js";
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
export class Game {
    cvs;
    ctx;
    enemies;
    frameCount;
    player;
    constructor() {
        this.cvs = document.getElementById("cvs");
        this.ctx = this.cvs.getContext("2d");
        this.enemies = [];
        this.frameCount = 0;
    }
    init() {
        function setKeyTrue(e) {
            Input.pressingKey[e.code] = true;
        }
        function setKeyFalse(e) {
            Input.pressingKey[e.code] = false;
        }
        document.onkeydown = setKeyTrue;
        document.onkeyup = setKeyFalse;
        this.player = new Player(this.ctx, this);
        this.enemies.push(new Enemy(this.ctx, this, 700));
    }
    showInfo() {
        this.frameCount++;
        if (this.frameCount > 60) {
            this.frameCount = 0;
            console.log(); // put information to display here
        }
    }
    run() {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        this.player.render();
        for (let enemy of this.enemies) {
            enemy.render();
        }
        this.showInfo();
        requestAnimationFrame(this.run.bind(this));
    }
    start() {
        this.init();
        this.run();
    }
}
