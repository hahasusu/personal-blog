# docker 安装 VitePress

在docker环境下安装和配置VitePress

## vitepress介绍

VitePress 是基于Vite的静态站点生成器 (SSG)，将指定路径的Markdown生成静态 HTML 页面。 样式美观，简单易用。适合构建项目网站、API文档等。

快速开始：https://vitepress.dev/zh/guide/getting-started

vitepress 配置：https://vitepress.dev/zh/reference/site-config

## 准备nodejs环境

vitepress 需要nodejs 18 及以上版本，建议直接拉取node镜像

```bash
docker run -it -d --name nodejs -p 80:80 -v /root/docker/vitepress/:/vitepress/ node:lts-alpine3.19
# -p 80:80 将vitepress预览端口映射到
# -v /root/docker/vitepress/:/vitepress/ vitepress文件挂载到宿主机，后续以vitepress作为根目录

# 进入容器
docker exec -it nodejs /bin/sh
```

## 初始化项目

根据官方指引创建并初始化vitepress项目：

https://vitepress.dev/zh/guide/getting-started

```bash
# 进入vitepress目录
cd /vitepress
# 添加vitepress 依赖
npm add -D vitepress
# 执行初始化指引
npx vitepress init
```

成功后，查看vitepress的文件结构

```tex
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json
```

## 构建&预览

查看package.json：

```json
{
  ...
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  ...
}
```

### 构建文档

```sh
npm run docs:build
```

### 预览文档

```sh
npm run docs:preview
```

`preview` 命令将启动一个本地静态 Web 服务 `http://localhost:4173`，该服务以 `.vitepress/dist` 作为源文件。这是检查生产版本在本地环境中是否正常的一种简单方法。

### 修改端口

通过传递 `--port` 作为参数修改文档预览端口为80。

```json
{
  "scripts": {
    "docs:preview": "vitepress preview docs --port 80"
  }
}
```

## 后端运行

执行npm run 时候会占用当前终端，退出终端的时候服务会终止， 通过**nohup** 将npm run 命令在后台运行

```sh
# nohup command > myout.file 2>&1 &
# nohup 全称：no hang up（不挂起）。也就是说，当前交互命令行退出的时候，程序还在运行
# >vitepress.out 结果输出到vitepress.out
# 2>&1 将标准错误（2）重定向到标准输出（&1），标准输出（&1）再被重定向输入到vitepress.out文件中。
# " &"：表示后台运行，不霸占交互命令行
nohup npm run docs:preview >vitepress.out 2>&1 &
```

## 停止运行

ps\top 来查找npm 进程，kill命令结束进程

```sh
# 查找进程，也可以用top
ps -ef
# 结束进程  kill -9 强制结束
kill <processID>
```

