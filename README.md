# Emby Crx

_Emby 增强插件 (适用于 Chrome 内核浏览器)_

---

## 使用须知

**初次加载可能会有显示问题, 刷新载入看到, MISTY MEDIA 字样加载页面即可**

**默认匹配所有 8096/12308 端口网页, 如需更改, 修改 manifest.json 文件内 include_globs 表达式即可**

如: `"include_globs": ["*//tv.emby.media/*"]`

## 动画预览 (因 LOGO 入场动画过于优先, 效果可能略差, 最新版已更改, 视频等待更新, 具体效果可以自行尝试)

https://user-images.githubusercontent.com/18238152/235517763-5ee7fe21-87e7-414f-a1cd-b2c6fadbb8d5.mp4

## 使用方法

Chrome 扩展设置 > 开发者模式 > 加载已解压的扩展程序 > 直接选择源码即可

## 等待修复

-   点击返回后重置元素
-   点击主页后重置元素

## TODO

-   封装为单 JS/CSS, 供客户端使用
-   内封装进 Misty Media 客户端
-   播放跳转第三方播放器功能
-   媒体库 Hover 后居中显示库名

---

## 效果预览

![1](https://user-images.githubusercontent.com/18238152/235510774-666d9006-cbad-4b97-9a73-ad5334cb7eee.png) ![2](https://user-images.githubusercontent.com/18238152/235510867-4b71a870-6be6-46a5-b988-527d667b020d.png) ![3](https://user-images.githubusercontent.com/18238152/235510872-ef88ae87-6693-4c11-b7ad-0f05e1a5c583.png) ![4](https://user-images.githubusercontent.com/18238152/235510874-f2fe4715-eb68-4f7a-ac49-50dc5f4ef5aa.png)
