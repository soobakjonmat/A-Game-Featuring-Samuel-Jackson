export class getFPS {
    constructor() {
        this.lastTime = Date.now()
        this.timeNow = Date.now()
        this.frameDisplayCount = 0
        this.fps = 0
        this.displayFrequency = 12
    }
    
    displayFPS() {
        if (this.frameDisplayCount == 1) {
            this.lastTime = Date.now()
        } else if (this.frameDisplayCount == 2) {
            this.timeNow = Date.now()
            this.fps = 1000 / (this.timeNow - this.lastTime)
            console.log(this.fps)
        } else if (this.frameDisplayCount > this.displayFrequency) {
            this.frameDisplayCount = 0
        }
        this.frameDisplayCount++
    }
}