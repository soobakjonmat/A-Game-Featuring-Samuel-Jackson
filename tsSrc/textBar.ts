import * as commonFuncs from "./commonFuncs.js"

export class textBar {
    ctx:CanvasRenderingContext2D
    bar:{
        x:number,
        y:number,
        width:number,
        height:number,
        fillColor:string,
        edgeColor:string,
        edgeLineWidth:number,
    }
    text:{
        text:string,
        x:number,
        y:number,
        width:number,
        height:number,
        color:string,
        font:string,
    }
    textBarRelConstX:number
    textBarRelConstY:number
    constructor(ctx:CanvasRenderingContext2D, x:number, y:number, width:number, height:number, fillColor:string, edgeColor:string, edgeLineWeight:number, text:string, textHeight:number, textColor:string, textFont:string) {
        this.ctx = ctx

        this.bar = {
            x:x,
            y:y,
            width:width,
            height:height,
            fillColor:fillColor,
            edgeColor:edgeColor,
            edgeLineWidth:edgeLineWeight,
        }
        this.text = {
            text:text,
            x:0,
            y:0,
            width:0,
            height:textHeight,
            color:textColor,
            font:textFont,
        }
        this.ctx.font = `${this.text.height}px ${this.text.font}`
        this.text.width = this.ctx.measureText(this.text.text).width
        this.textBarRelConstX = commonFuncs.getHalfDiff(this.bar.width, this.text.width)
        this.textBarRelConstY = commonFuncs.getHalfDiff(this.bar.height, this.text.height)
        this.text.x = this.bar.x + this.textBarRelConstX
        this.text.y = this.bar.y + this.text.height + this.textBarRelConstY
    }


    updatePos(x:number, y:number) {
        this.bar.x = x
        this.bar.y = y
        this.text.x = this.bar.x + this.textBarRelConstX
        this.text.y = this.bar.y + this.text.height + this.textBarRelConstY
    }

    draw(currValue:number, maxValue:number, yesBar:boolean, yesText:boolean) {
        if (yesBar) {
            this.drawBar(currValue, maxValue)
        }
        if (yesText) {
            commonFuncs.drawText(this.ctx, this.text.text, this.text.x, this.text.y, 0, this.text.height, this.text.color, this.text.font)
        }
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
    }


}