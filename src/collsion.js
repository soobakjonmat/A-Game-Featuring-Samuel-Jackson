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
        let isLTCollsion = this.checkCollidePoint(aabbObj.xLeft, aabbObj.yTop);
        let isRTCollsion = this.checkCollidePoint(aabbObj.xRight, aabbObj.yTop);
        let isLBCollsion = this.checkCollidePoint(aabbObj.xLeft, aabbObj.yBottom);
        let isRBCollsion = this.checkCollidePoint(aabbObj.xRight, aabbObj.yBottom);

        return isLTCollsion || isRTCollsion || isLBCollsion || isRBCollsion
    }

    update(dx, dy) {
        this.xLeft += dx
        this.xRight += dx
        this.yTop += dy
        this.yBottom += dy
    }
}