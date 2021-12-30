import * as Input from "./input.js"
import { Constants } from "./constants.js"
import * as Resources from "./resources.js"
import { textBar } from "./textBar.js"
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
    
    offGroundStartTime :number
    gravConst :number

    jumpForce :number

    atkDamage :number
    atkDur :number
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
    ultCooldown :number
    ulStartTime :number
    
    knockBackDur :number
    knockBackStartTime :number
    knockBackForceY :number
    knockBackForceX :number
    knockBackDir :number

    collisionBox :Collision
    invinStartTime :number
    invinDur :number
    isOpaque :boolean
    blinkOpaChangeTime :number
    blinkFreq :number
    blinkOpacity :number

    status: {
        canMove :boolean
        isJumping :boolean
        isAttacking :boolean
        isDashing :boolean
        isUsingUlt :boolean
        isInvincible :boolean
        isOffGround :boolean
        isGettingKnockBack :boolean
    }

    currHP :number
    maxHP :number
    HPBar :textBar
    
    currUltGauge :number
    maxUltGauge :number
    UltGaugeBar :textBar

    constructor(ctx :CanvasRenderingContext2D, game :Game) {
        this.ctx = ctx
        this.game = game
        
        // image
        this.img = Resources.images.sjhead.image
        this.img.width *= 1
        this.img.height *= 1

        // Movement
        this.dir = 1
        this.moveSpeed = 9
        this.maxX = Constants.CANVAS_WIDTH - this.img.width
        this.groundY = Constants.CANVAS_HEIGHT - this.img.height
        this.x = 50
        this.y = this.groundY

        // gravity
        this.offGroundStartTime = 0
        this.gravConst = 0.082

        // jump
        this.jumpForce = 20
        
        // attack
        this.atkDamage = 7
        this.atkDur = 100
        this.atkFwdSpeed = 40
        this.atkBckSpeed = 15
        this.atkBckDuration = 20
        this.attackCount = 1
        this.atkCooldown = 670
        this.thirdAtkCooldown = 1340
        this.atkStartTime = 0

        // dash
        this.dashSpeed = 50
        this.dashDuration = 120
        this.dashCooldown = 1500
        this.dashStartTime = 0

        // ult
        this.ultCooldown = 12000
        this.ultDuration = 4000
        this.ulStartTime = 0

        // knock back
        this.knockBackDur = 500
        this.knockBackStartTime = 0
        this.knockBackForceY = 12
        this.knockBackForceX = 7
        this.knockBackDir = 1

        // collision
        this.collisionBox = new Collision(this.x, this.y, this.img.width, this.img.height)
        this.invinDur = 1500
        this.invinStartTime = 0
        this.isOpaque = true
        this.blinkOpaChangeTime = 0
        this.blinkFreq = 100
        this.blinkOpacity = 0.5

        // status
        this.status = {
            canMove: true,
            isJumping: false,
            isAttacking: false,
            isDashing: false,
            isUsingUlt: false,
            isInvincible: false,
            isOffGround: false,
            isGettingKnockBack: false,
        }

        // HP
        this.maxHP = 40
        this.currHP = this.maxHP
        this.HPBar = new textBar(ctx, 30, 50, 120, 20, "#FF0000", "#000000", 1, "HP", 14, "#000000", "Roboto Condensed")

        // ult gauge
        this.currUltGauge = 0
        this.maxUltGauge = 9
        this.UltGaugeBar = new textBar(ctx, 30, 80, 120, 20, "#FFFF00", "#000000", 1, "Anger", 14, "#000000", "Roboto Condensed")
    }

    // Movement / X Position
    move() {
        if (this.status.canMove) {
            if (Input.pressingKey[Input.keymap.moveLeft]) {
                this.dir = -1
                this.x += this.dir*this.moveSpeed
            } else if (Input.pressingKey[Input.keymap.moveRight]) {
                this.dir = 1
                this.x += this.dir*this.moveSpeed
            }
        }
    }

    // Gravity / Y Position
    checkOffGround() {
        if (this.y < this.groundY && !this.status.isOffGround) {
            this.status.isOffGround = true
            this.offGroundStartTime = Date.now()
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

    checkJumpKeyPress() {
        if (Input.pressingKey[Input.keymap.jump]) {
            return true
        }
        return false
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
        this.status.isJumping = false
    }

    // Attack
    checkAttackKeyPress() {
        if (Input.pressingKey[Input.keymap.attack]) {
            return true
        }
        return false
    }
    
    startAttack() {
        const atkPassedTime = Date.now() - this.atkStartTime
        if (atkPassedTime < this.atkCooldown) {
            return false
        }
        Resources.audios.dash.start()
        this.status.isAttacking = true
        this.status.canMove = false
        switch(this.attackCount) {
            case 1:
                if (atkPassedTime < this.thirdAtkCooldown) {
                    return false
                }
                this.attackCount++
                break
            case 2:
                this.attackCount++
                break
            case 3:
                this.attackCount = 1
                break
        }
        if (this.currUltGauge < this.maxUltGauge) {
            this.currUltGauge++
        }
        this.atkStartTime = Date.now()
        return true
    }

    attack() {
        const passedTime = Date.now() - this.atkStartTime
        if (passedTime > this.atkDur) {
            this.endAttack()
            return
        }
        if (this.dir == 1) {
            if (passedTime < this.atkBckDuration) {
                this.x += -this.atkBckSpeed
            } else {
                this.x += this.atkFwdSpeed
            }
        } else {
            if (passedTime < this.atkBckDuration) {
                this.x += this.atkBckSpeed
            } else {
                this.x += -this.atkFwdSpeed
            }
        }
    }

    endAttack() {
        this.status.isAttacking = false
        this.status.canMove = true
    }

    // Dash
    checkDashKeyPress() {
        if (Input.pressingKey[Input.keymap.dash]) {
            return true
        }
        return false
    }

    startDash() {
        const dashPassedTime = Date.now() - this.dashStartTime
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
        const passedTime = Date.now() - this.dashStartTime
        if (passedTime > this.dashDuration) {
            this.endDash()
            return
        }
        if (this.dir == 1) {
            this.x += this.dashSpeed
        } else {
            this.x += -this.dashSpeed
        }
    }

    endDash() {
        this.status.isDashing = false
        this.status.canMove = true
    }

    // Ult
    checkUltKeyPress() {
        if (Input.pressingKey[Input.keymap.ult]) {
            return true
        }
        return false
    }

    startUlt() {
        if (this.currUltGauge != this.maxUltGauge) {
            return false
        }
        this.currUltGauge = 0
        Resources.audios.ultStart.start()
        this.status.isUsingUlt = true
        return true
    }

    useUlt() {
        this.status.isUsingUlt = false
        // do ult move first then later do audios and images
    }

    // Knockback
    startKnockBack() {
        this.status.canMove = false
        this.status.isAttacking = false
        this.status.isJumping = false
        this.status.isInvincible = true
        this.invinStartTime = Date.now()
        this.status.isGettingKnockBack = true
        this.knockBackStartTime = this.invinStartTime
    }

    // figure out why characters bounce several times when applied gravity and knockbacked
    /* figure out why sometimes when player is attacking, enemy is not attacking
        but player status is deemed as not attacking*/
    knockBack() {
        this.x += this.knockBackForceX*this.knockBackDir
        this.y += -this.knockBackForceY
        if (Date.now() - this.knockBackStartTime > this.knockBackDur) {
            this.endKnockBack()
            return
        }
    }

    endKnockBack() {
        this.status.isGettingKnockBack = false
        this.status.canMove = true
    }

    playRandomPunchSound() {
        const punchNum = Math.floor(Math.random()*3)+1
        switch (punchNum) {
            case 1:
                Resources.audios.punch1.start()
                break
            case 2:
                Resources.audios.punch2.start()
                break
            case 3:
                Resources.audios.punch3.start()
                break
        }
    }

    // Collision
    checkCollision() {
        if (Date.now() - this.invinStartTime > this.invinDur) {
            this.status.isInvincible = false
        }
        if (this.status.isDashing || this.status.isUsingUlt) {
            return
        }
        for (let enemy of this.game.enemies) {
            // do sounds
            const colStatus = this.collisionBox.checkBoxCollision(enemy.collisionBox)
            if (colStatus.collided) {
                this.status.canMove = true
                enemy.status.canMove = true
                if (colStatus.LB || colStatus.LT) {
                    this.knockBackDir = -1
                    enemy.knockBackDir = 1
                } else if (colStatus.RB || colStatus.RT) {
                    this.knockBackDir = 1
                    enemy.knockBackDir = -1
                }
                if (this.status.isAttacking) {
                    this.playRandomPunchSound()
                    enemy.startKnockBack()
                    enemy.knockBack()
                    enemy.currHP -= this.atkDamage
                    if (enemy.status.isAttacking && !this.status.isInvincible) {
                        this.startKnockBack()
                        this.knockBack()
                        this.currHP -= enemy.atkDamage*enemy.atkDamageMultiplier
                    }
                    this.endAttack()
                } else {
                    if (this.status.isInvincible) {
                        return
                    }
                    this.playRandomPunchSound()
                    if (enemy.status.isAttacking) {
                        this.startKnockBack()
                        this.knockBack()
                        this.currHP -= enemy.atkDamage*enemy.atkDamageMultiplier
                    } else {
                        this.startKnockBack()
                        this.knockBack()
                        this.currHP -= enemy.atkDamage
                    }
                }                
            }
        }
    }

    checkStatus() {
        if (this.status.isUsingUlt) {
            this.useUlt()
            return true
        }
        if (this.status.isGettingKnockBack) {
            this.knockBack()
            return true
        }
        if (this.status.isAttacking) {
            this.attack()
        } else if (this.status.isDashing) {
            this.dash()
        }
        if (this.status.isJumping) {
            this.jump()
        }
        return false
    }

    checkKeyPress() {
        if (this.checkUltKeyPress() && !this.status.isDashing && !this.status.isAttacking) {
            if (this.startUlt()) {
                this.useUlt()
            }
            return
        }
        if (this.checkAttackKeyPress() && !this.status.isAttacking && !this.status.isDashing) {
            if (this.startAttack()) {
                this.attack()
            }
            return
        }
        if (this.checkDashKeyPress() && !this.status.isDashing && !this.status.isAttacking) {
            if (this.startDash()) {
                this.dash()
            }
            return
        }
        if (this.checkJumpKeyPress() && !this.status.isDashing && !this.status.isAttacking && !this.status.isJumping) {
            this.status.isJumping = true
            this.jump()
            return
        }
    }

    restrictXPos() { 
        if (this.x < 0) {
            this.x = 0
        } else if (this.x > this.maxX) {
            this.x = this.maxX
        }
    }

    drawStats() {
        this.HPBar.draw(this.currHP, this.maxHP, true, true)
        this.UltGaugeBar.draw(this.currUltGauge, this.maxUltGauge, true, true)
    }

    blinkPlayer() {
        const currTime = Date.now() 
        if (currTime - this.blinkOpaChangeTime > this.blinkFreq) {
            this.blinkOpaChangeTime = currTime
            if (this.isOpaque) {
                this.isOpaque = false
            } else {
                this.isOpaque = true
            }
        }
        if (this.isOpaque) {
            this.ctx.globalAlpha = 1
        } else {
            this.ctx.globalAlpha = this.blinkOpacity
        }
    }

    drawCharacter() {
        this.ctx.save()
        if (this.dir == -1) {
            this.ctx.translate(this.x*2+this.img.width, 0)
            this.ctx.scale(this.dir, 1)
        }
        // make transparent while dashing
        if (this.status.isDashing) {
            this.ctx.globalAlpha = this.blinkOpacity
        }
        // blink while invincible
        if (this.status.isInvincible) {
            this.blinkPlayer()
        }
        if (!this.status.isDashing && !this.status.isInvincible) {
            this.ctx.globalAlpha = 1
        }
        this.ctx.drawImage(this.img, this.x, this.y, this.img.width, this.img.height)
        this.ctx.restore()
    }

    render() {
        if (!this.checkStatus()) {
            this.checkKeyPress()
        }
        // x position
        this.move()
        this.restrictXPos()
        
        // y position
        this.checkOffGround()
        this.applyGravity()

        this.collisionBox.update(this.x, this.y)
        this.checkCollision()

        this.drawCharacter()
        this.drawStats()
    }
}