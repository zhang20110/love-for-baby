class Tree {
    constructor(root) {
        // 树根的位置, 移动树只需要移动根部的位置即刻
        this.root = root;
    }
    async drawTree() {
        // 树的躯干的动画
        const offset = await (new Branch(this.root)).drawBranch()
        // 树叶的动画
        await new Promise((res, rej) => {
            const loveHeart = new DrawLoveHeart();
            let leavesCounts = 650 // 叶子的个数
            const leavesProperty = []
            const leavesPoint = { x: 545, y: 365 } // 整个爱心树叶的中心
            const leavesSize = 230;
            while (leavesCounts) {
                const x = getRandom(leavesPoint.x - 400, leavesPoint.x + 400)
                const y = getRandom(leavesPoint.y - 400, leavesPoint.y + 400)
                if (loveHeart.isInside(x - leavesPoint.x, y - leavesPoint.y, leavesSize)) {
                    leavesProperty.push({
                        x: x + offset.offsetX,
                        y: y + offset.offsetY,
                        color: 'rgba(255,' + getRandom(0, 255) + ',' + getRandom(0, 255) + ')',
                        // 大小
                        size: 0.1,
                        // 旋转角度
                        rotate: getRandom(0, 360) * Math.PI / 180,
                        // 透明度
                        alpha: Math.random() > 0.6 ? 0.3 : 1
                    })
                    --leavesCounts
                }
            }
            const nowLeaves = leavesProperty.splice(0, 2); // 现在树上的树叶
            let nowLeavesCounts = 0
            const timeId = setInterval(() => {
                for (let i = 0; i < nowLeaves.length; ++i) {
                    const nowLeave = nowLeaves[i]
                    if (nowLeave.size <= 1) {
                        loveHeart.draw(nowLeave.x, nowLeave.y, nowLeave.color, nowLeave.size, nowLeave.rotate, nowLeave.alpha)
                        nowLeave.size += 0.1
                    }
                    if (nowLeave.size > 1 && !nowLeave.status) {
                        nowLeave.status = true; // 标志叶子已经绘制完毕
                        ++nowLeavesCounts
                    }
                }
                nowLeaves.push(...leavesProperty.splice(0, 2))
                // 所有树叶都长好了
                if (nowLeavesCounts === nowLeaves.length) {
                    clearInterval(timeId);
                    res()
                }
            }, 16)
        })
    }

    /**
     * 将(x,y)位置的图形移动到(targetX,y)
     * @param {*} targetX 树根的终点位置
     * @param {*} speed 移动速度
     * @param {*} x 移动图形的x坐标
     * @param {*} y 移动图形的y坐标
     */
    async horizontalMoveTree(targetX, speed = 2, x, y) {
        const ctx = window.ctx
        const image = ctx.getImageData(x, y, 650, 850)
        return new Promise((res, rej) => {
            let i = x
            const timeId = setInterval(() => {
                i += speed
                ctx.save()
                ctx.putImageData(image, Math.min(i, targetX), y);
                ctx.restore()
                if (i >= targetX) {
                    clearInterval(timeId);
                    res()
                }
            }, 16)
        })
    }
}