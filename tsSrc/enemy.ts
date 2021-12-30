import { Constants } from "./constants.js"
import * as Resources from "./resources.js"
import { Game } from "./game.js"
import { Collision } from "./collision.js"
import { textBar } from "./textBar.js"
import * as commonFuncs from "./commonFuncs.js"

export class Enemy {
    ctx :CanvasRenderingContext2D
    game :Game

    img :HTMLImageElement

    dir :number
    moveSpeed :number
    maxX :number
    groundY :number
    x :number
    y :number

    offGroundStartTime :number
    gravConst :number

    jumpForce :number
    jumpMinCooldown :number
    nextJumpTime :number
    
    atkDamage :number
    atkDamageMultiplier :number
    atkCoolddown :number
    atkPauseTime :number
    atkBckDuration :number
    atkDuration :number
    atkFwdSpeed :number
    atkBckSpeed :number
    atkStartTime :number

    knockBackDur :number
    knockBackStartTime :number
    knockBackForceY :number
    knockBackForceX :number
    knockBackDir :number

    collisionBox :Collision
    
    status: {
        canMove :boolean
        isJumping :boolean
        isAttacking :boolean
        isOffGround :boolean
        isGettingKnockBack :boolean
    }

    currHP :number
    maxHP :number

    HPBar :textBar

    constructor(ctx :CanvasRenderingContext2D, game :Game, x :number) {
        this.ctx = ctx
        this.game = game

        // image
        this.img = Resources.images.angryTrollFace.image
        this.img.width *= 0.8
        this.img.height *= 0.8

        // Movement
        this.dir = 1
        this.moveSpeed = 3
        this.maxX = Constants.CANVAS_WIDTH - this.img.width
        this.groundY = Constants.CANVAS_HEIGHT - this.img.height
        this.x = x
        this.y = this.groundY

        // gravity
        this.gravConst = 0.082
        this.offGroundStartTime = 0

        // jump
        this.jumpForce = 17
        this.jumpMinCooldown = 4000
        this.nextJumpTime = Date.now() + Math.random()*this.jumpMinCooldown+1000    
        
        // attack
        this.atkDamage = 8
        this.atkDamageMultiplier = 1.4
        this.atkCoolddown = 11000
        this.atkPauseTime = 1000
        this.atkBckDuration = 80 + this.atkPauseTime
        this.atkDuration = 300 + this.atkPauseTime
        this.atkFwdSpeed = 26
        this.atkBckSpeed = 8
        this.atkStartTime = Date.now()

        // knockback
        this.knockBackDur = 500
        this.knockBackStartTime = 0
        this.knockBackForceY = 12
        this.knockBackForceX = 7
        this.knockBackDir = 1

        // collision
        this.collisionBox = new Collision(this.x, this.y, this.img.width, this.img.height)

        // status
        this.status = {
            canMove: true,
            isJumping: false,
            isAttacking: false,
            isOffGround: false,
            isGettingKnockBack: false,
        }

        // HP
        this.maxHP = 40
        this.currHP = this.maxHP
        this.HPBar = new textBar(ctx, 0, 0, 80, 10, "#FF0000", "#000000", 1, "", 14, "#000000", "Roboto Condensed")
    }

    // Movement / X Position
    move() {
        if (this.status.canMove) {
            this.dir = 1
            if (this.game.player.x < this.x) {
                this.dir = -1
            }
            this.x += this.moveSpeed*this.dir
        }
    }

    // Gravity / Y Position
    checkOffGround() {
        if (this.y < this.groundY && !this.status.isOffGround) {
            this.status.isOffGround = true
            this.offGroundStartTime = Date.now()
            return
        }
        if (this.y >= this.groundY) {
            this.y = this.groundY
            this.status.isOffGround = false
        }
    }

    applyGravity() {
        if (this.status.isOffGround) {
            this.y += this.gravConst*(Date.now() - this.offGroundStartTime)
        }
    }

    // Jump
    jump() {
        this.y += -this.jumpForce
        if (this.y >= this.groundY) {
            this.endJump()
            return
        }
    }

    endJump() {
        this.status.isJumping = false; 
        this.nextJumpTime = Date.now() + Math.random()*4000+1000
    }
    
    // Attack
    startAttack() {
        this.status.isAttacking = true
        this.status.canMove = false
        this.atkStartTime = Date.now()
    }

    attack() {
        const passedTime = Date.now() - this.atkStartTime
        if (passedTime < this.atkPauseTime) {
            return
        }
        if (passedTime > this.atkDuration) {
            if (passedTime > this.atkDuration + 1000) {
                this.endAttack()
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

    endAttack() {
        this.status.isAttacking = false
        this.status.canMove = true
        this.atkStartTime = Date.now()
    }

    // Knockback
    startKnockBack() {
        this.status.canMove = false
        this.status.isAttacking = false
        this.status.isJumping = false
        this.status.isGettingKnockBack = true
        this.knockBackStartTime = Date.now()
    }

    knockBack() {
        this.x += this.knockBackForceX*this.knockBackDir
        this.y += -this.knockBackForceY
        if (Date.now() - this.knockBackStartTime > this.knockBackDur) {
            this.endknockBack()
            return
        }
    }

    endknockBack() {
        this.status.isGettingKnockBack = false
        this.status.canMove = true
    }

    checkStatus() {
        if (this.status.isGettingKnockBack) {
            this.knockBack()
            return true
        }
        if (this.status.isAttacking) {
            this.attack()
        }
        if (this.status.isJumping) {
            this.jump()
        }
        return false
    }

    checkActionTimer() {
        const currTime = Date.now()
        if (currTime - this.atkStartTime > this.atkCoolddown) {
            // play enemy attack scream audio
            this.startAttack()
            this.attack()
        }
        if (currTime > this.nextJumpTime) {
            this.status.isJumping = true
            this.jump()
        }
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

    restrictXPos() { 
        if (this.x < 0) {
            this.x = 0
        } else if (this.x > this.maxX) {
            this.x = this.maxX
        }
    }

    drawStats() {
        this.HPBar.updatePos(this.x + commonFuncs.getHalfDiff(this.img.width, this.HPBar.bar.width), this.y - 20)
        this.HPBar.draw(this.currHP, this.maxHP, true, true)
    }

    render() {
        if (!this.checkStatus()) {
            this.checkActionTimer()
        }
        // x position
        this.move()
        this.restrictXPos()
        
        // y position
        this.checkOffGround()
        this.applyGravity()
        
        this.collisionBox.update(this.x, this.y)
        
        this.drawCharacter()
        this.drawStats()
    }
}