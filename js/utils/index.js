//工具函数
function getRandom(left, right) {
    const random = Math.random()
    return left + Math.floor(random * (right - left))
}
function getTime(string = '2022-10-2 19:19') {
    let timeInterval = Math.trunc(((+new Date()) - (+new Date(string))) / 1000);
    const seconds = timeInterval % 60;
    timeInterval = Math.trunc(timeInterval / 60);
    const minutes = timeInterval % 60
    timeInterval = Math.trunc(timeInterval / 60);
    const hours = timeInterval % 24
    const days = Math.trunc(timeInterval / 24);
    return {
        seconds,
        minutes,
        hours,
        days
    }
}