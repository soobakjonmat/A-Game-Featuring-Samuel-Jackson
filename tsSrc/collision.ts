export class Collision {
    xLeft :number
    xRight :number
    yTop :number
    yBottom :number
    width :number
    height :number
    constructor(x :number, y :number, w :number, h :number) {
        this.xLeft = x
        this.xRight = x + w
        this.yTop = y
        this.yBottom = y + h
        this.width = w
        this.height = h
    }

    checkPointCollision(px :number, py :number) {
        if (px > this.xLeft && px < this.xRight && py > this.yTop && py < this.yBottom) {
            return true
        } else {
            return false
        }
    }

    checkBoxCollision(CollisionObj :Collision) {
        const isLTCollided = this.checkPointCollision(CollisionObj.xLeft, CollisionObj.yTop)
        const isRTCollided = this.checkPointCollision(CollisionObj.xRight, CollisionObj.yTop)
        const isLBCollided = this.checkPointCollision(CollisionObj.xLeft, CollisionObj.yBottom)
        const isRBCollided = this.checkPointCollision(CollisionObj.xRight, CollisionObj.yBottom)

        const status = {
            collided: isLTCollided || isRTCollided || isLBCollided || isRBCollided,
            LT: isLTCollided,
            RT: isRTCollided,
            LB: isLBCollided,
            RB: isRBCollided,
        }
        return status
    }

    update(x :number, y :number) {
        this.xLeft = x
        this.xRight = x + this.width
        this.yTop = y
        this.yBottom = y + this.height
    }
}