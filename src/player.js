import * as Input from "./input.js"
import { Constants } from "./constants.js"
import * as Resources from "./resources.js"
import { Bar } from "./bar.js"

export class Player {
    constructor(ctx, game) {
        this.ctx = ctx
        this.game = game
        
        this.img = Resources.images.sjhead

        // Movement
        this.dir = 1
        this.moveSpeed = 9
        this.maxX = Constants.CANVAS_WIDTH - this.img.width
        this.groundY = Constants.CANVAS_HEIGHT - this.img.height
        this.x = 0
        this.y = this.groundY

        // jump
        this.gravConst = -82
        this.jumpForce = 20
        this.jumpStartTime
        
        // attack
        this.atkDuration = 0.1
        this.atkFwdSpeed = 40
        this.atkBckSpeed = 15
        this.atkBckDuration = 0.02
        this.attackCount = 1
        this.atkCooldown = 0.67
        this.thirdAtkCooldown = 1.34
        this.atkStartTime

        // dash
        this.dashSpeed = 30
        this.dashDuration = 0.14
        this.dashCooldown = 1.5
        this.dashStartTime

        // status
        this.status = {
            canMove: true,
            isJumping: false,
            isAttacking: false,
            isDashing: false,
            isUsingSkill1: false,
            isUsingSkill2: false,
            isUsingUlt: false,
        }

        // HP
        this.currHP = 100
        this.maxHP = 100

        // ult gauge
        this.currUltGauge = 0
        this.maxUltGauge = 9

        this.HPBar = new Bar(ctx, 30, 50, 120, 20, "#FF0000", "#000000", 1, "HP", 14, "#000000", "Roboto Condensed")
        this.UltGaugeBar = new Bar(ctx, 30, 80, 120, 20, "#FFFF00", "#000000", 1, "Anger", 14, "#000000", "Roboto Condensed")
    }

    move() {
        if (Input.pressingKey.ArrowLeft) {
            this.dir = -1
            this.x += this.dir*this.moveSpeed
        } else if (Input.pressingKey.ArrowRight) {
            this.dir = 1
            this.x += this.dir*this.moveSpeed
        }
    }

    jump() {
        let passedTime = (Date.now() - this.jumpStartTime) / 1000 // in seconds
        if (this.y > this.groundY) {
            this.status.isJumping = false;
            this.y = this.groundY
            return
        }
        this.y -= this.jumpForce + this.gravConst*passedTime
    }

    attack() {
        let passedTime = (Date.now() - this.atkStartTime) / 1000 // in seconds
        if (passedTime > this.atkDuration) {
            this.status.isAttacking = false
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

    dash() {
        let passedTime = (Date.now() - this.dashStartTime) / 1000 // in seconds
        if (passedTime > this.dashDuration) {
            this.status.isDashing = false
            return
        }
        if (this.dir == 1) {
            this.x += this.dashSpeed
        } else {
            this.x -= this.dashSpeed
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
                        this.status.canMove = false
                        this.attack()
                        return true
                    case 'isDashing':
                        this.status.canMove = false
                        this.dash()
                        return true
                    case 'isUsingUlt':
                        this.status.canMove = false
                        this.useUlt()
                        return true
                }
            }
        }
        this.status.canMove = true
        return false
    }

    checkPressedKeys() {
        for (let key in Input.pressingKey) {
            if (Input.pressingKey[key]) {
                switch(key) {
                    case 'Space':
                        this.status.isJumping = true
                        this.jumpStartTime = Date.now()
                        this.jump()
                        return
                    case 'KeyZ':
                        let atkPassedTime = (Date.now() - this.atkStartTime) / 1000 // in seconds
                        if (atkPassedTime < this.atkCooldown) {
                            return
                        }
                        this.status.isAttacking = true
                        this.status.canMove = false
                        switch(this.attackCount) {
                            case 1:
                                if (atkPassedTime < this.thirdAtkCooldown) {
                                    return
                                }
                                Resources.audios.punch1.start()
                                this.attackCount++
                                break
                            case 2:
                                Resources.audios.punch2.start()
                                this.attackCount++
                                break
                            case 3:
                                Resources.audios.punch3.start()
                                this.attackCount = 1
                                break
                        }
                        if (this.currUltGauge < this.maxUltGauge) {
                            this.currUltGauge++
                        }
                        this.atkStartTime = Date.now()
                        this.attack()
                        return
                    case 'ShiftLeft':
                        let dashPassedTime = (Date.now() - this.dashStartTime) / 1000 // in seconds
                        if (dashPassedTime < this.dashCooldown) {
                            return
                        }
                        this.status.isDashing = true
                        this.status.canMove = false
                        this.dashStartTime = Date.now()
                        Resources.audios.dash.start()
                        this.dash()
                        return
                    case 'KeyX':
                        if (this.currUltGauge >= this.maxUltGauge) {
                            this.currUltGauge = 0
                            this.status.isUsingUlt = true
                            this.canMove = false
                            Resources.audios.ultStart.start()
                            this.useUlt()
                            return
                        }
                }
            }
        }
        return
    }

    useUlt() {
        this.status.isUsingUlt = false
        // do ult move first then later do audios and images
        
    }

    restrictXPos() { 
        if (this.x < 0) {
            this.x = 0
        } else if (this.x > this.maxX) {
            this.x = this.maxX
        }
    }

    drawStats() {
        this.HPBar.drawBar(this.currHP, this.maxHP)
        this.UltGaugeBar.drawBar(this.currUltGauge, this.maxUltGauge)
    }

    drawPlayer() {
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
            this.checkPressedKeys()
        }
        if (this.status.canMove) {
            this.move()
        }
        this.restrictXPos()
        this.drawPlayer()
        this.drawStats()
    }
}