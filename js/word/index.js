function drawText(x, y, text = '宝贝～点我的心吧', textColor = 'red', scale = 2) {
    const ctx = window.ctx
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.strokeStyle = textColor;
    ctx.scale(scale, scale)
    ctx.moveTo(0, 0)
    ctx.lineTo(15, 15)
    ctx.lineTo(105, 15);
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.fillText(text, 23, 10, 90)
    ctx.closePath()
    ctx.restore()
}