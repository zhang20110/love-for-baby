# For
    我最珍贵的礼物
    但问前程,无问西东
    不要太在意,越在意越无法把握,越容易失去,平淡的心坚守
# 问题
1. canvas 的width 和 style.width是不一样的, 如果不一致,浏览器会宽缩到style.width, 会导致内部像素变形,画出来的图形可能变形
2. 请确保在调用 clearRect()之后绘制新内容前调用beginPath(), 否则可能导致擦除失败