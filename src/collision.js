export class Collision {
    constructor(x, y, w, h) {
        this.xLeft = x
        this.xRight = x + w
        this.yTop = y
        this.yBottom = y + h
        this.width = w
        this.height = h
    }

    checkPointCollision(px, py) {
        if (px > this.xLeft && px < this.xRight && py > this.yTop && py < this.yBottom) {
            return true;
        } else {
            return false;
        }
    }

    checkBoxCollision(CollisionObj) {
        let isLTCollided = this.checkPointCollision(CollisionObj.xLeft, CollisionObj.yTop);
        let isRTCollided = this.checkPointCollision(CollisionObj.xRight, CollisionObj.yTop);
        let isLBCollided = this.checkPointCollision(CollisionObj.xLeft, CollisionObj.yBottom);
        let isRBCollided = this.checkPointCollision(CollisionObj.xRight, CollisionObj.yBottom);

        let status = {
            collided: isLTCollided || isRTCollided || isLBCollided || isRBCollided,
            LT: isLTCollided,
            RT: isRTCollided,
            LB: isLBCollided,
            RB: isRBCollided,
        }

        return status
    }

    update(dx, dy) {
        this.xLeft += dx
        this.xRight += dx
        this.yTop += dy
        this.yBottom += dy
    }
}