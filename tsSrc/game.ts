import * as Input from "./input.js"
import { Player } from "./player.js"
import { Enemy } from "./enemy.js"
import { textBar } from "./textBar.js"

export class Game {
    showInfoInterval :number    
    frameCount :number

    cvs :HTMLCanvasElement
    ctx :CanvasRenderingContext2D
    enemies :Enemy[]

    player :Player

    gameEnded :boolean
    defeatDisplay :textBar
    victoryDisplay :textBar

    constructor() {
        // for analysing code
        this.showInfoInterval = 120
        this.frameCount = 9999

        this.cvs = <HTMLCanvasElement> document.getElementById("cvs")
        this.ctx = this.cvs.getContext("2d")

        this.enemies = []

        this.gameEnded = false
        this.defeatDisplay = new textBar(this.ctx, 0, 0, this.cvs.width, this.cvs.height, "#000000", "#000000", 1, "You suck", 40, "#770000", "Sans Serif")
        this.victoryDisplay = new textBar(this.ctx, 0, 0, this.cvs.width, this.cvs.height, "#000000", "#000000", 1, "Not bad ey", 40, "#00FF00", "Sans Serif")
    }
    
    init() {
        function setKeyTrue(e :KeyboardEvent) {
            Input.pressingKey[e.code] = true
        }
        function setKeyFalse(e :KeyboardEvent) {
            Input.pressingKey[e.code] = false
        }
        document.onkeydown = setKeyTrue
        document.onkeyup = setKeyFalse

        this.player = new Player(this.ctx, this)

        this.enemies.push(new Enemy(this.ctx, this, 700))
    }

    showInfo() {
        this.frameCount++
        if (this.frameCount > this.showInfoInterval) {
            this.frameCount = 0
            console.log() // put information to display here
        }
    }
    
    run() {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
        if (this.player.currHP <= 0) {
            this.gameEnded = true
        } else {
            this.player.render()
        }
        for (let enemy of this.enemies) {
            if (enemy.currHP <= 0) {
                this.enemies.splice(this.enemies.indexOf(enemy))
            }
            enemy.render()
        }
        if (this.enemies.length == 0) {
            this.gameEnded = true
        }
        this.showInfo()
        
        if (!this.gameEnded) {
            requestAnimationFrame(this.run.bind(this))
        } else {
            if (this.player.currHP <= 0) {
                this.defeatDisplay.draw(0, 0, false, true)
            } else {
                this.victoryDisplay.draw(0, 0, false, true)
            }
        }
    }

    start() {
        this.init()
        this.run()
    }
}
