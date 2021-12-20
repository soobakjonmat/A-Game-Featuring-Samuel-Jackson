import * as Resources from "./resources.js"
import * as Input from "./input.js"
import { Player } from "./player.js"
import { Enemy } from "./enemy.js"

export class Game {
    constructor() {
        this.cvs = document.getElementById("cvs")
        this.ctx = this.cvs.getContext("2d")

        function setKeyTrue(e) {
            Input.pressingKey[e.code] = true
        }
        function setKeyFalse(e) {
            Input.pressingKey[e.code] = false
        }
        document.onkeydown = setKeyTrue
        document.onkeyup = setKeyFalse
    }
    
    init() {
        this.player = new Player(this.ctx, Resources.images.sjhead)
        this.enemy = new Enemy(this.ctx, Resources.images.angryTrollFace)
    }
    
    run() {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
        this.enemy.render(this.player.x)
        this.player.render()
        requestAnimationFrame(this.run.bind(this))
    }

    start() {
        this.init()
        this.run()
    }
}
