import * as Input from "./input.js"
import { Constants } from "./constants.js"
import * as Resources from "./resources.js"
import { Bar } from "./bar.js"
import { Collision } from "./collision.js"
import { Game } from "./game.js"

export class Player {
    ctx :CanvasRenderingContext2D
    game :Game

    img :HTMLImageElement

    dir :number
    moveSpeed :number
    maxX :number
    groundY :number
    x :number
    y :number
    
    gravConst :number
    jumpForce :number
    jumpStartTime :number
    
    atkDuration :number
    atkFwdSpeed :number
    atkBckSpeed :number
    atkBckDuration :number
    attackCount :number
    atkCooldown :number
    thirdAtkCooldown :number
    atkStartTime :number
    
    dashSpeed :number
    dashDuration :number
    dashCooldown :number
    dashStartTime :number
    
    ultDuration :number
    ulStartTime :number
    
    knockBackStartTime :number

    status: {
        [key:string] : boolean
    }

    currHP :number
    maxHP :number
    
    currUltGauge :number
    maxUltGauge :number

    HPBar :Bar
    UltGaugeBar :Bar

    constructor(ctx :CanvasRenderingContext2D, game :Game) {
        this.ctx = ctx
        this.game = game
        
        // image
        this.img = new Resources.images.sjhead
        this.img.width *= 1
        this.img.height *= 1

        // Movement
        this.dir = 1
        this.moveSpeed = 9
        this.maxX = Constants.CANVAS_WIDTH - this.img.width
        this.groundY = Constants.CANVAS_HEIGHT - this.img.height
        this.x = 50
        this.y = this.groundY

        // jump
        this.gravConst = -82
        this.jumpForce = 20
        this.jumpStartTime = Date.now()
        
        // attack
        this.atkDuration = 0.1
        this.atkFwdSpeed = 40
        this.atkBckSpeed = 15
        this.atkBckDuration = 0.02
        this.attackCount = 1
        this.atkCooldown = 0.67
        this.thirdAtkCooldown = 1.34
        this.atkStartTime = Date.now()

        // dash
        this.dashSpeed = 50
        this.dashDuration = 0.12
        this.dashCooldown = 1.5
        this.dashStartTime = Date.now()

        // ult
        this.ultDuration = 4
        this.ulStartTime = Date.now()

        // knock back
        this.knockBackStartTime = Date.now()

        // status
        this.status = {
            canMove: true,
            canAct: true,
            isJumping: false,
            isAttacking: false,
            isDashing: false,
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

    // hierarchy for actions:
    // ult
    // attack
    // dash
    // jump
    // move

    collisionBox() :Collision {
        return new Collision(this.x, this.y, this.img.width, this.img.height)
    }

    move() {
        if (Input.pressingKey[Input.keymap.moveLeft]) {
            this.dir = -1
            this.x += this.dir*this.moveSpeed
        } else if (Input.pressingKey[Input.keymap.moveRight]) {
            this.dir = 1
            this.x += this.dir*this.moveSpeed
        }
    }

    checkJumpKeyPress() {
        if (Input.pressingKey[Input.keymap.jump]) {
            return true
        }
        return false
    }

    startJump() {
        this.status.isJumping = true
        this.jumpStartTime = Date.now()
        return true
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

    applyGravity() {
        if (this.y == this.groundY) {
            
        }
    }
    // make apply gravity function
    // if y pos is above ground set offGroundStartTime = Date.now()
    // after action end, set offGroundStartTime = Date.now()

    checkAttackKeyPress() {
        if (Input.pressingKey[Input.keymap.attack]) {
            return true
        }
        return false
    }
    
    startAttack() {
        let atkPassedTime = (Date.now() - this.atkStartTime) / 1000 // in seconds
        if (atkPassedTime < this.atkCooldown) {
            return false
        }
        this.status.isAttacking = true
        this.status.canMove = false
        switch(this.attackCount) {
            case 1:
                if (atkPassedTime < this.thirdAtkCooldown) {
                    return false
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
        this.atkStartTime = Date.now()
        return true
    }

    attack() {
        let passedTime = (Date.now() - this.atkStartTime) / 1000 // in seconds
        if (passedTime > this.atkDuration) {
            this.status.isAttacking = false
            this.status.canMove = true
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

    checkDashKeyPress() {
        if (Input.pressingKey[Input.keymap.dash]) {
            return true
        }
        return false
    }
    startDash() {
        let dashPassedTime = (Date.now() - this.dashStartTime) / 1000 // in seconds
        if (dashPassedTime < this.dashCooldown) {
            return false
        }
        this.status.isDashing = true
        this.status.canMove = false
        Resources.audios.dash.start()
        this.dashStartTime = Date.now()
        return true
    }

    dash() {
        let passedTime = (Date.now() - this.dashStartTime) / 1000 // in seconds
        if (passedTime > this.dashDuration) {
            this.status.isDashing = false
            this.status.canMove = true
            return
        }
        if (this.dir == 1) {
            this.x += this.dashSpeed
        } else {
            this.x -= this.dashSpeed
        }
    }

    checkUltKeyPress() {
        if (Input.pressingKey[Input.keymap.ult]) {
            return true
        }
        return false
    }

    startUlt() {
        Resources.audios.ultStart.start()
        this.status.isUsingUlt = true
        return true
    }

    useUlt() {
        this.status.isUsingUlt = false
        // do ult move first then later do audios and images
    }

    startKnockBack() {

    }

    knockBack(xDir :number) {

    }

    checkAction() {
        if (this.status.isUsingUlt) {
            this.useUlt()
            return true
        }
        if (this.status.isAttacking) {
            this.attack()
            return true
        }
        if (this.status.isDashing) {
            this.dash()
            return true
        }
        if (this.status.isJumping) {
            this.jump()
            if (this.checkAttackKeyPress()) {
                if (this.startAttack()) {
                    this.attack()
                }
            } else if (this.checkDashKeyPress()) {
                if (this.startDash()) {
                    this.dash()
                }
            }
            return true
        }
        return false
    }


    checkKeyPress() {
        if (this.checkUltKeyPress()) {
            if (this.startUlt()) {
                this.useUlt()
            }
            return
        }
        if (this.checkAttackKeyPress()) {
            if (this.startAttack()) {
                this.attack()
            }
            return
        }
        if (this.checkDashKeyPress()) {
            if (this.startDash()) {
                this.dash()
            }
            return
        }
        if (this.checkJumpKeyPress()) {
            if (this.startJump()) {
                this.jump()
            }
            return
        }        
    }


    checkEnemyCollision() {
        for (let enemy of this.game.enemies) {

        }
    }
    

    restrictPos() { 
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

    drawCharacter() {
        if (this.dir == -1) {
            this.ctx.save()
            this.ctx.translate(this.x*2+this.img.width, 0)
            this.ctx.scale(this.dir, 1)
        }
        this.ctx.drawImage(this.img, this.x, this.y, this.img.width, this.img.height)
        this.ctx.restore()
    }

    render() {
        // if (this.status.canAct) {
            if (!this.checkAction()) {
                this.checkKeyPress()
            }
        // }
        if (this.status.canMove) {
            this.move()
        }
        // if (this.status.isJumping && !this.status.isAttacking && !this.status.isDashing) {
        //     // check jump or dash key
        // }
        this.restrictPos()
        this.drawCharacter()
        this.drawStats()
    }
}