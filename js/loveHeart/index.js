class DrawLoveHeart {
    constructor() {
        this.ctx = window.ctx
        // 获取爱心的点集
        this._points = this._getHeartPoint();
    }
    _getHeartPoint() {
        // x = 16 sin^3 t
        // y = 13 cos t - 5 cos 2t - 2 cos 3t - cos 4t
        // http://www.wolframalpha.com/input/?i=x+%3D+16+sin%5E3+t%2C+y+%3D+(13+cos+t+-+5+cos+2t+-+2+cos+3t+-+cos+4t)
        var points = [], x, y, t;
        for (var i = 10; i < 30; i += 0.2) {
            t = i / Math.PI;
            x = 16 * Math.pow(Math.sin(t), 3);
            y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            points.push({ x, y });
        }
        return points;
    }
    /**
     * 画爱心
     * 通过爱心公式,穷举点
     * x = 16 sin^3 t
     * y = 13 cos t - 5 cos 2t - 2 cos 3t - cos 4t
     * @param {*} x x坐标
     * @param {*} y y坐标
     * @param {*} loveColor 爱心的颜色
     * @param {*} size 爱心的大小(放大或缩小)
     */
    draw(x = 0, y = 0, loveColor = 'red', size = 2, rotate = 0, alpha = 1) {
        const ctx = this.ctx;
        const points = this._points;
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = alpha
        ctx.translate(x, y);
        ctx.rotate(rotate)
        ctx.fillStyle = loveColor
        for (let i = 0; i < points.length; ++i) {
            ctx.lineTo(points[i].x * size, -points[i].y * size);
        }
        ctx.closePath()
        ctx.fill();
        ctx.restore();// 还原状态
    }
    /** 
     * 判断点是否在爱心的内部
     * 通过不等式
     * (x ^ 2 + y ^ 2 - 1) ^ 3 - x ^ 2 * y ^ 3 < 0
     * https://www.wolframalpha.com/input?i=%28x+%5E+2+%2B+y+%5E+2+-+1%29+%5E+3+-+x+%5E+2+*+y+%5E+3+%3C+0
     * @param {*} size 爱心的大小 
    */
    isInside(x, y, size) {
        const nowX = x / size, nowY = -y / size;
        return Math.pow(nowX ** 2 + nowY ** 2 - 1, 3) - nowX ** 2 * nowY ** 3 < 0
    }
}