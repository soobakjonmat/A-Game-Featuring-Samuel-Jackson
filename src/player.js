import * as Input from "./input.js"
import { Constants } from "./constants.js"
import * as Resources from "./resources.js"

export class Player {
    constructor(ctx, img) {
        this.ctx = ctx
        this.img = img
        
        // Movement variables
        this.dir = 1
        this.moveSpeed = 9
        this.maxX = Constants.CANVAS_WIDTH - this.img.width
        this.groundY = Constants.CANVAS_HEIGHT - this.img.height
        this.x = 0
        this.y = this.groundY

        // jump variables
        this.gravConst = -82
        this.jumpForce = 20
        this.jumpStartTime
        
        // attack variables
        this.atkDuration = 0.1
        this.atkFwdSpeed = 40
        this.atkBckSpeed = 15
        this.atkBckDuration = 0.02
        this.attackCount = 1
        this.atkCooldown = 0.67
        this.thirdAtkCooldown = 1.34
        this.atkStartTime

        // dash variables
        this.dashSpeed = 30
        this.dashDuration = 0.14
        this.dashCooldown = 1.5
        this.dashStartTime

        // state variables
        this.state = {
            canMove: true,
            isJumping: false,
            isAttacking: false,
            isDashing: false,
            isUsingSkill1: false,
            isUsingSkill2: false,
            isUsingUlt: false,
        }

        // Bars
        this.fontHeight = 14
        this.HPBarYPos = 50
        this.ultGaugeYPos = 80

        // HP variables
        this.curHP = 100
        this.maxHP = 100
        this.HPBarWidth = 120
        this.HPBarHeight = 20

        // ult gauge variables
        this.curUltGauge = 0
        this.maxUltGauge = 9
        this.ultGaugeBarWidth = 120
        this.ultGaugeBarHeight = 20
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
            this.state.isJumping = false;
            this.y = this.groundY
            return
        }
        this.y -= this.jumpForce + this.gravConst*passedTime
    }

    attack() {
        let passedTime = (Date.now() - this.atkStartTime) / 1000 // in seconds
        if (passedTime > this.atkDuration) {
            this.state.isAttacking = false
            this.state.canMove = true
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
            this.state.isDashing = false
            this.state.canMove = true
            return
        }
        if (this.dir == 1) {
            this.x += this.dashSpeed
        } else {
            this.x -= this.dashSpeed
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
                        this.state.canMove = false
                        this.attack()
                        return true
                    case 'isDashing':
                        this.state.canMove = false
                        this.dash()
                        return true
                }
            }
        }
        return false
    }

    checkPressedKeys() {
        for (let key in Input.pressingKey) {
            if (Input.pressingKey[key]) {
                switch(key) {
                    case 'Space':
                        this.state.isJumping = true
                        this.jumpStartTime = Date.now()
                        this.jump()
                        return
                    case 'KeyZ':
                        let atkPassedTime = (Date.now() - this.atkStartTime) / 1000 // in seconds
                        if (atkPassedTime < this.atkCooldown) {
                            return
                        }
                        this.state.isAttacking = true
                        this.state.canMove = false
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
                        if (this.curUltGauge < this.maxUltGauge) {
                            this.curUltGauge++
                        }
                        this.atkStartTime = Date.now()
                        this.attack()
                        return
                    case 'ShiftLeft':
                        let dashPassedTime = (Date.now() - this.dashStartTime) / 1000 // in seconds
                        if (dashPassedTime < this.dashCooldown) {
                            return
                        }
                        this.state.isDashing = true
                        this.state.canMove = false
                        this.dashStartTime = Date.now()
                        Resources.audios.dash.start()
                        this.dash()
                        return
                    case 'KeyX':
                        if (this.curUltGauge >= this.maxUltGauge) {
                            this.curUltGauge = 0
                            // this.state.isUsingUlt = true
                            // this.canMove = false
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
        // do ult move first then later do audios and images
        
    }

    restrictXPos() { 
        if (this.x < 0) {
            this.x = 0
        } else if (this.x > this.maxX) {
            this.x = this.maxX
        }
    }

    drawHPBar() {
       // filling HP
       this.ctx.fillStyle = "#ff0000"
       this.ctx.beginPath()
       this.ctx.rect(30, this.HPBarYPos, this.curHP*this.HPBarWidth/this.maxHP, this.HPBarHeight)
       this.ctx.fill()
       // gauge bar edge
       this.ctx.beginPath()
       this.ctx.strokeRect(30, this.HPBarYPos, this.HPBarWidth, this.HPBarHeight)
       // text
       this.ctx.font = `${this.fontHeight}px Roboto Condensed`
       this.HPText = "HP"
       this.HPTextSize = this.ctx.measureText(this.HPText)
       this.ctx.fillStyle = "#000000"
       this.ctx.fillText(this.HPText, 30+(this.HPBarWidth-this.HPTextSize.width)/2, this.HPBarYPos+this.fontHeight)
   }

    drawUltGaugeBar() {
        // filling gauge
        this.ctx.fillStyle = "#ffff00"
        this.ctx.beginPath()
        this.ctx.rect(30, this.ultGaugeYPos, this.curUltGauge*this.ultGaugeBarWidth/this.maxUltGauge, this.ultGaugeBarHeight)
        this.ctx.fill()
        // gauge bar edge
        this.ctx.beginPath()
        this.ctx.strokeRect(30, this.ultGaugeYPos, this.ultGaugeBarWidth, this.ultGaugeBarHeight)
        // text
        this.ctx.font = `${this.fontHeight}px Roboto Condensed`
        this.ultText = "Anger"
        this.ultTextSize = this.ctx.measureText(this.ultText)
        this.ctx.fillStyle = "#000000"
        this.ctx.fillText(this.ultText, 30+(this.ultGaugeBarWidth-this.ultTextSize.width)/2, this.ultGaugeYPos+this.fontHeight)
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
            this.checkPressedKeys()
        }
        if (this.state.canMove) {
            this.move()
        }
        this.restrictXPos()
        this.drawHPBar()
        this.drawUltGaugeBar()
        this.draw()
    }
}