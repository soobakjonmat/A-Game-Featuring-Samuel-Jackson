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

    checkBoxCollision(aabbObj) {
        let isLTCollided = this.checkCollidePoint(aabbObj.xLeft, aabbObj.yTop);
        let isRTCollided = this.checkCollidePoint(aabbObj.xRight, aabbObj.yTop);
        let isLBCollided = this.checkCollidePoint(aabbObj.xLeft, aabbObj.yBottom);
        let isRBCollided = this.checkCollidePoint(aabbObj.xRight, aabbObj.yBottom);

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