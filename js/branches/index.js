/**
 * 原理: 在贝塞尔曲线上画圆
 * x = (1−t)^2x1 + 2t(1−t)x2 + t^2x3
 * y = (1−t)^2y1 + 2t(1−t)y2 + t^2y3
 * https://zh.javascript.info/bezier-curve#shu-xue
 */
class Branch {
    constructor(p1) {
        this.root = p1 // 树根的位置
    }
    bezier(p1, p2, p3, t) {
        const x = (1 - t) ** 2 * (p1.x) + 2 * t * (1 - t) * (p2.x) + t ** 2 * (p3.x)
        const y = (1 - t) ** 2 * (p1.y) + 2 * t * (1 - t) * (p2.y) + t ** 2 * (p3.y)
        return { x, y }
    }
    drawAnimated({ p1, p2, p3 }, radius = 30, counts = 100, offsetX = 0, offsetY = 0, clear = false) {
        return new Promise((res, rej) => {
            let i = 0;
            let nowRadius = radius;
            const timeId = setInterval(() => {
                const p = this.bezier(p1, p2, p3, i / counts);
                ctx.save()
                ctx.beginPath()
                // translate保证树长在对应的树根位置
                ctx.translate(offsetX, offsetY)
                ctx.fillStyle = '#835d52'
                ctx.arc(p.x, p.y, nowRadius, 0, Math.PI * 2)
                ctx.fill()
                // 清除树根的圆弧
                if (clear) {
                    // -2 是阴影的大小
                    ctx.clearRect(p1.x - radius - 2, p1.y, 2 * radius + 4, radius + 4)
                }
                ctx.closePath()
                ctx.restore()
                if (i === counts) {
                    clearInterval(timeId);
                    res()
                }
                ++i;
                nowRadius *= 0.97
            }, 16)
        })
    }
    async drawBranch() {
        //数据结构: [x1, y1, x2, y2, x3, y3, 树的分支]
        // x,y是贝塞尔曲线的三个控制点
        const beziersPointers = [
            [535, 680, 570, 250, 500, 200, 30, 100, [
                [540, 500, 455, 417, 340, 400, 13, 100, [
                    [450, 435, 434, 430, 394, 395, 2, 40]
                ]],
                [550, 445, 600, 356, 680, 345, 12, 100, [
                    [578, 400, 648, 409, 661, 426, 3, 80]
                ]],
                [539, 281, 537, 248, 534, 217, 3, 40],
                [546, 397, 413, 247, 328, 244, 9, 80, [
                    [427, 286, 383, 253, 371, 205, 2, 40],
                    [498, 345, 435, 315, 395, 330, 4, 60]
                ]],
                [546, 357, 608, 252, 678, 221, 6, 100, [
                    [590, 293, 646, 277, 648, 271, 2, 80]
                ]]
            ]]
        ]
        let branchs = beziersPointers;
        // 实际树根的位置到画的树根的位置偏移量
        const offsetX = this.root.x - branchs[0][0],
            offsetY = this.root.y - branchs[0][1]
        // 广度优先遍历
        while (branchs && branchs.length) {
            const arrPromise = []
            const arrSon = []
            for (let i = 0; i < branchs.length; i++) {
                const b = branchs[i];
                arrPromise.push(this.drawAnimated({
                    p1: { x: b[0], y: b[1] },
                    p2: { x: b[2], y: b[3] },
                    p3: { x: b[4], y: b[5] },
                }, b[6], b[7], offsetX, offsetY, branchs === beziersPointers))
                b[8] && arrSon.push(...b[8])
            }
            await Promise.all(arrPromise);
            branchs = arrSon
        }
        return {
            offsetX,
            offsetY
        }
    }
}