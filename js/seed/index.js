function drawSeed(x, y, raduis = 5, color = '#835d52', size = 2) {
    ctx.save()
    ctx.beginPath()
    ctx.translate(x, y)
    ctx.fillStyle = color;
    ctx.arc(0, 0, raduis * size, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
}