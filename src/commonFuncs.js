export function getHalfDiff(val1, val2) {
    return (val1 - val2) / 2;
}
export function drawText(ctx, text, x, y, width, height, color, font) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${height}px ${font}`;
    ctx.beginPath();
    if (width == 0) {
        ctx.fillText(text, x, y);
    }
    else {
        ctx.fillText(text, x, y, width);
    }
    ctx.restore();
}
