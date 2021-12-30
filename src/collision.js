export class Collision {
    xLeft;
    xRight;
    yTop;
    yBottom;
    width;
    height;
    constructor(x, y, w, h) {
        this.xLeft = x;
        this.xRight = x + w;
        this.yTop = y;
        this.yBottom = y + h;
        this.width = w;
        this.height = h;
    }
    checkPointCollision(px, py) {
        if (px > this.xLeft && px < this.xRight && py > this.yTop && py < this.yBottom) {
            return true;
        }
        else {
            return false;
        }
    }
    checkBoxCollision(CollisionObj) {
        const isLTCollided = this.checkPointCollision(CollisionObj.xLeft, CollisionObj.yTop);
        const isRTCollided = this.checkPointCollision(CollisionObj.xRight, CollisionObj.yTop);
        const isLBCollided = this.checkPointCollision(CollisionObj.xLeft, CollisionObj.yBottom);
        const isRBCollided = this.checkPointCollision(CollisionObj.xRight, CollisionObj.yBottom);
        const status = {
            collided: isLTCollided || isRTCollided || isLBCollided || isRBCollided,
            LT: isLTCollided,
            RT: isRTCollided,
            LB: isLBCollided,
            RB: isRBCollided,
        };
        return status;
    }
    update(x, y) {
        this.xLeft = x;
        this.xRight = x + this.width;
        this.yTop = y;
        this.yBottom = y + this.height;
    }
}
