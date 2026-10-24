# 鸟群插件

500 只以 `>` 表示的鸟，采用经典 Boids：26px 内分离避让，120px 邻域内对齐平均速度并向邻域中心聚合。权重分别为 1.7、1、0.65；速度限制 64–170px/s（初始 70–160px/s），总加速度限制 200px/s²。所有距离和聚合方向均采用环面最短偏移，固定 60Hz 同步更新。

构建：`npm --prefix frontend run build:birds`，新版本可用 `npm --prefix frontend run build:birds -- 1.3.5`。

预览：先确保宿主 frontend/dist 已构建，再运行 `npm --prefix frontend run preview:birds`，打开 http://127.0.0.1:5190/p/nearest-birds 。

包：frontend/plugin-packages/nearest-birds-1.3.4.zip。插件 id 为 nearest-birds。进入 fyuo-control. → plugins. 上传草稿，再发布。构建不会自动上传或修改排序。

纯浏览器本地运行，无 API、模型、外部素材。离屏或隐藏时暂停模拟，恢复后不追赶隐藏期间的时间；减少动态效果模式默认暂停，可手动继续。Canvas 像素上限约 200 万，侧栏预览绘制为 20 FPS。

鼠标在画布内作为不可见捕食者，不参与对齐和聚合，不渲染额外图形。180px 环面距离内的鸟转向逃离，越近逃逸权重越高，加速度上限 480px/s²。鼠标静止时仍有效，移出画布、取消指针或窗口失焦时退出。保留普通系统鼠标指针。

底部状态和控制框已隐藏。
