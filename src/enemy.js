import { Constants } from "./constants.js"
import * as Resources from "./resources.js"

export class Enemy {
    constructor(ctx, img) {
        this.ctx = ctx
        this.img = img
        
        // Movement variables
        this.dir = 1
        this.moveSpeed = 3
        this.maxX = Constants.CANVAS_WIDTH - this.img.width
        this.groundY = Constants.CANVAS_HEIGHT - this.img.height
        this.x = this.maxX - 300
        this.y = this.groundY

        // jump variables
        this.gravConst = -82
        this.jumpForce = 17
        this.jumpStartTime
        this.nextJumpTime = Date.now() + Math.random()*4000+1000 // in milliseconds

        // attack variables
        this.atkCoolddown = 11
        this.atkPauseTime = 1
        this.atkBckDuration = 0.08 + this.atkPauseTime
        this.atkDuration = 0.3 + this.atkPauseTime
        this.atkFwdSpeed = 26
        this.atkBckSpeed = 8
        this.atkStartTime = Date.now()

        // state variables
        this.state = {
            canMove: true,
            isJumping: false,
            isAttacking: false,
        }
    }

    move(playerXPos) {
        this.dir = 1
        if (playerXPos < this.x) {
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
        for (let key in this.state) {
            if (this.state[key]) {
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
        let curTime = Date.now()
        if ((curTime - this.atkStartTime) / 1000 > this.atkCoolddown) { // in seconds
            this.state.isAttacking = true
            this.state.canMove = false
            this.atkStartTime = curTime
            // play enemy attack scream audio
            this.attack()
            return
        }
        if (curTime > this.nextJumpTime) {
            this.state.isJumping = true
            this.jumpStartTime = curTime
            this.jump()
            return
        }
    }


    jump() {
        let passedTime = (Date.now() - this.jumpStartTime) / 1000 // in seconds
        if (this.y > this.groundY) {
            this.state.isJumping = false;
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
                this.state.isAttacking = false
                this.state.canMove = true
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


    render(playerXPos) {
        if (!this.checkAction()) {
            this.startAction()
        }
        if (this.state.canMove) {
            this.move(playerXPos)
        }
        this.restrictXPos()
        this.draw()
    }
}