// just enter 'tsc' command to compile
export class Bar {
    ctx: CanvasRenderingContext2D
    bar: {
        x: number,
        y: number,
        width: number,
        height: number,
        fillColor: string,
        edgeColor: string,
        edgeLineWidth: number,
    }
    text: {
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
        font: string,
    }
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fillColor: string, edgeColor: string, edgeLineWeight: number, text: string, textHeight: number, textColor: string, textFont: string) {
        this.ctx = ctx

        this.bar = {
            x: x,
            y: y,
            width: width,
            height: height,
            fillColor: fillColor,
            edgeColor: edgeColor,
            edgeLineWidth: edgeLineWeight,
        }
        this.text = {
            text: text,
            x: 0,
            y: 0,
            width: 0,
            height: textHeight,
            color: textColor,
            font: textFont,
        }

        this.updateTextPos()
    }

    updateTextPos() {
        this.ctx.font = `${this.text.height}px ${this.text.font}`
        this.text.width = this.ctx.measureText(this.text.text).width
        this.text.x = this.bar.x + this.getRelativeCenter(this.bar.width, this.text.width)
        this.text.y = this.bar.y + this.text.height + this.getRelativeCenter(this.bar.height, this.text.height)   
    }

    getRelativeCenter(bigger:number, smaller:number) :number {
        return (bigger-smaller)/2
    }

    drawBar(currValue:number, maxValue:number) {
        // bar
        this.ctx.fillStyle = this.bar.fillColor
        this.ctx.beginPath()
        this.ctx.rect(this.bar.x, this.bar.y, currValue*this.bar.width/maxValue, this.bar.height)
        this.ctx.fill()
        // edge
        this.ctx.lineWidth = this.bar.edgeLineWidth
        this.ctx.strokeStyle = this.bar.edgeColor
        this.ctx.beginPath()
        this.ctx.strokeRect(this.bar.x, this.bar.y, this.bar.width, this.bar.height)
        // text
        this.ctx.fillStyle = this.text.color
        this.ctx.font = `${this.text.height}px ${this.text.font}`
        this.ctx.beginPath()
        this.ctx.fillText(this.text.text, this.text.x, this.text.y)
    }
}