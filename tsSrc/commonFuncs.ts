export function getHalfDiff(val1 :number, val2 :number) {
    return (val1 - val2)/2
}

export function drawText(ctx :CanvasRenderingContext2D, text: string, x: number, y: number, width :number, height: number, color: string, font: string) {
    ctx.save()
    ctx.fillStyle = color
    ctx.font = `${height}px ${font}`
    ctx.beginPath()
    if (width == 0) {
        ctx.fillText(text, x, y)
    } else {
        ctx.fillText(text, x, y, width)
    }
    ctx.restore()
}