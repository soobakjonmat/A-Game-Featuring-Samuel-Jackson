import { Constants } from "./constants.js"
import * as Resources from "./resources.js"

export class Enemy {
    constructor(ctx, game) {
        this.ctx = ctx
        this.game = game
        
        this.img = Resources.images.angryTrollFace        
        // Movement
        this.dir = 1
        this.moveSpeed = 3
        this.maxX = Constants.CANVAS_WIDTH - this.img.width
        this.groundY = Constants.CANVAS_HEIGHT - this.img.height
        this.x = this.maxX - 300
        this.y = this.groundY

        // jump
        this.gravConst = -82
        this.jumpForce = 17
        this.jumpStartTime
        this.nextJumpTime = Date.now() + Math.random()*4000+1000 // in milliseconds

        // attack
        this.atkCoolddown = 11
        this.atkPauseTime = 1
        this.atkBckDuration = 0.08 + this.atkPauseTime
        this.atkDuration = 0.3 + this.atkPauseTime
        this.atkFwdSpeed = 26
        this.atkBckSpeed = 8
        this.atkStartTime = Date.now()

        // status
        this.status = {
            canMove: true,
            isJumping: false,
            isAttacking: false,
        }
    }

    move() {
        this.dir = 1
        if (this.game.player.x < this.x) {
            this.dir = -1
        }
        this.x += this.moveSpeed*this.dir
    }

    restrictXPos() { 
        if (this.x < 0) {
            this.x = 0
        } else if (this.x > this.maxX) {
            this.x = this.maxX
        }
    }

    checkAction() {
        for (let key in this.status) {
            if (this.status[key]) {
                switch(key) {
                    case 'isJumping':
                        this.jump()
                        return true
                    case 'isAttacking':
                        this.attack()
                        return true
                }
            }
        }
        return false
    }

    startAction() {
        let currTime = Date.now()
        if ((currTime - this.atkStartTime) / 1000 > this.atkCoolddown) { // in seconds
            this.status.isAttacking = true
            this.status.canMove = false
            this.atkStartTime = currTime
            // play enemy attack scream audio
            this.attack()
            return
        }
        if (currTime > this.nextJumpTime) {
            this.status.isJumping = true
            this.jumpStartTime = currTime
            this.jump()
            return
        }
    }


    jump() {
        let passedTime = (Date.now() - this.jumpStartTime) / 1000 // in seconds
        if (this.y > this.groundY) {
            this.status.isJumping = false;
            this.y = this.groundY
            this.nextJumpTime = Date.now() + Math.random()*4000+1000 // in milliseconds
            return
        }
        this.y -= this.jumpForce + this.gravConst*passedTime
    }

    attack() {
        let passedTime = (Date.now() - this.atkStartTime) / 1000 // in seconds
        if (passedTime < this.atkPauseTime) {
            return
        }
        if (passedTime > this.atkDuration) {
            if (passedTime > this.atkDuration + 1) {
                this.status.isAttacking = false
                this.status.canMove = true
                return
            }
            return
        }
        if (this.dir == 1) {
            if (passedTime < this.atkBckDuration) {
                this.x -= this.atkBckSpeed
            } else {
                this.x += this.atkFwdSpeed
            }
        } else {
            if (passedTime < this.atkBckDuration) {
                this.x += this.atkBckSpeed
            } else {
                this.x -= this.atkFwdSpeed
            }
        }
    }

    draw() {
        if (this.dir == -1) {
            this.ctx.save()
            this.ctx.translate(this.x*2+this.img.width, 0)
            this.ctx.scale(this.dir, 1)
        }
        this.ctx.drawImage(this.img, this.x, this.y)
        this.ctx.restore()
    }


    render() {
        if (!this.checkAction()) {
            this.startAction()
        }
        if (this.status.canMove) {
            this.move()
        }
        this.restrictXPos()
        this.draw()
    }
}