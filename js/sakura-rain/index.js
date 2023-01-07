class SakuraRain {
    constructor(width, height, sakuraBloomDensity = 0.03, speedGrowInterval = 10000) {
        this.width = width;
        this.height = height;
        // 初始化时每px上sakuraBloomDensity个樱花
        this.sakuraBloomDensity = sakuraBloomDensity
        // 生长樱花的时间间隔
        this.speedGrowInterval = speedGrowInterval
    }
    drawSakuraBloom({ x, y, color = 'red', scaleX = 1, scaleY = 1, rotate = 0 }) {
        const ctx = window.ctx;
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = color;
        ctx.translate(x, y)
        ctx.rotate(rotate)
        ctx.scale(scaleX, scaleY)
        ctx.moveTo(0, 40)
        ctx.bezierCurveTo(-60, 20, -10, -60, 0, -20);
        ctx.bezierCurveTo(10, -60, 60, 20, 0, 40);
        ctx.fill();
        ctx.closePath()
        ctx.restore()
    }
    createSakuraBlooms(counts, isStart = true) {
        const sakuraBloomsArr = []
        // 颜色和scale用同一个rate参数控制,保证z轴上离人眼越近,颜色越明亮,樱花越大
        // 和视觉效果保持一致
        for (let i = 0; i < counts; ++i) {
            const rate = 0.3 + Math.random() * 0.6
            const alpha = Math.random() * Math.PI * 2
            const rotate = Math.random() * Math.PI * 2
            const color = ctx.createRadialGradient(0, 40, 0, 0, 40, 80);
            color.addColorStop(0, 'hsl(330, 70%, ' + 50 * (0.3 + rate) + '%)');
            color.addColorStop(0.05, 'hsl(330, 40%,' + 55 * (0.3 + rate) + '%)');
            color.addColorStop(1, 'hsl(330, 20%, ' + 70 * (0.3 + rate) + '%)');
            sakuraBloomsArr.push({
                x: getRandom(0, this.width),
                y: isStart ? getRandom(0, this.height / 2) : -30,
                color,
                alpha,
                rate,
                // rate * Math.sin() 模拟立体旋转 
                // 使用sin函数, 因为sin有周期,类似旋转
                scaleX: rate * Math.sin(alpha),
                scaleY: rate,
                rotate,
                speedX: (-1 + Math.random() * 2),
                speedY: (0.7 + Math.random()),
                // 使用rate参数保证樱花越小, 边界y越小, 呈现立体视觉 
                thresholdY: this.height / 2 + this.height / 2 * rate,
                ripple: 0, // 水波的层数
            })
        }
        return sakuraBloomsArr
    }
    drawRipple(x, y, radius, globalAlpha, scaleY = 0.3) {
        const ctx = window.ctx;
        ctx.save()
        ctx.beginPath()
        ctx.globalAlpha = globalAlpha
        ctx.translate(x, y)
        ctx.scale(1, scaleY)
        ctx.strokeStyle = 'white'
        ctx.arc(0, 0, radius, 0, Math.PI * 2)
        ctx.stroke();
        ctx.closePath()
        ctx.restore()
    }
    render() {
        const counts = Math.round(this.sakuraBloomDensity * this.width)
        let sakuraBlooms = this.createSakuraBlooms(counts);
        const addIntervalCache = Math.round(this.speedGrowInterval / this.width)
        let addInterval = addIntervalCache
        const PIOfPercentOf200 = Math.PI / 200
        const PI32 = Math.PI * 3 / 2;
        const rippleLevels = 100;
        setInterval(() => {
            const ctx = window.ctx
            ctx.clearRect(0, 0, this.width, this.height)
            for (let i = 0; i < sakuraBlooms.length; ++i) {
                const bloom = sakuraBlooms[i]
                this.drawSakuraBloom(bloom)
                // 到达水面的樱花停止下落
                if (bloom.y >= bloom.thresholdY || bloom.hasReachSurface) {
                    // 水的波纹
                    if (bloom.ripple < rippleLevels) {
                        ++bloom.ripple
                        this.drawRipple(bloom.x, bloom.y, bloom.ripple / rippleLevels * 100 * bloom.rate, 1 - bloom.ripple / rippleLevels)
                    }
                    bloom.alpha %= Math.PI;
                    if (!bloom.endAlpha) {
                        const speed = Math.PI / 200
                        if (bloom.alpha < Math.PI / 8 && bloom.alpha + speed >= Math.PI / 8) {
                            bloom.alpha = Math.PI / 8
                            bloom.endAlpha = true
                        } else if (bloom.alpha < Math.PI * 7 / 8 && bloom.alpha + speed >= Math.PI * 7 / 8) {
                            bloom.alpha = Math.PI / 8
                            bloom.endAlpha = true
                        } else {
                            bloom.alpha += speed
                        }
                    }
                    bloom.scaleX = Math.sin(bloom.alpha) * bloom.rate
                    bloom.rotate %= Math.PI * 2
                    if (bloom.rotate >= Math.PI / 2 - PIOfPercentOf200 && bloom.rotate <= Math.PI / 2 + PIOfPercentOf200) {
                        bloom.rotate = Math.PI / 2
                    } else if (bloom.rotate >= PI32 - PIOfPercentOf200 && bloom.rotate <= PI32 + PIOfPercentOf200) {
                        bloom.rotate = PI32
                    } else if (bloom.rotate >= Math.PI / 2 && bloom.rotate < Math.PI) {
                        bloom.rotate -= PIOfPercentOf200
                    } else if (bloom.rotate >= 0 && bloom.rotate < Math.PI / 2) {
                        bloom.rotate += PIOfPercentOf200
                    } else if (bloom.rotate >= Math.PI && bloom.rotate < Math.PI * 3 / 2) {
                        bloom.rotate += PIOfPercentOf200
                    } else {
                        bloom.rotate -= PIOfPercentOf200
                    }
                    bloom.x += 1
                    // 樱花到达水面后 在y轴上线 10 px范围内移动
                    if (bloom.y > bloom.thresholdY + 10 || bloom.y < bloom.thresholdY - 10 || bloom.y > this.height * 0.95) {
                        bloom.speedY = -bloom.speedY
                        bloom.speedY %= 0.3
                        if (bloom.speedY >= 0.15) {
                            bloom.speedY *= 0.7
                        }
                    }
                    bloom.y += bloom.speedY
                    bloom.hasReachSurface = true
                } else {
                    const alpha = bloom.alpha + Math.PI / 400
                    bloom.alpha = alpha
                    bloom.scaleX = Math.sin(alpha) * bloom.rate
                    bloom.rotate += Math.PI / 500
                    bloom.x += bloom.speedX
                    bloom.y += bloom.speedY
                }
                // 删除超出屏幕的樱花
                if (bloom.x > this.width + 30) {
                    sakuraBlooms.splice(i, 1)
                    --i
                }
            }
            --addInterval
            // addIntervalCache 次动画后, 增加一个樱花
            if (addInterval === 0) {
                sakuraBlooms.push(...this.createSakuraBlooms(1, false))
                addInterval = addIntervalCache
            }
        }, 16);
    }
}