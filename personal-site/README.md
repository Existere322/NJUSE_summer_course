# 个人主页 · 暑期课程 Agent Coding Demo

一个用原生 HTML / CSS / JavaScript 搭建的最小静态个人网站，可直接部署到 GitHub Pages。

## 项目用途

- 作为暑期课程 Agent Coding 的最小 Demo
- 展示姓名、简介、技能、项目、联系方式
- 包含一个深色 / 浅色主题切换交互（带本地持久化）

## 文件结构

```
NJUSE_summer_course/
├── .github/workflows/pages.yml   # GitHub Pages 部署 workflow（仓库根）
└── personal-site/                # 本项目
    ├── index.html                # 页面结构
    ├── style.css                 # 样式与主题变量
    ├── script.js                 # 主题切换逻辑
    └── README.md                 # 项目说明
```

## 本地预览

任选一种方式：

**方式一：直接打开**

双击 `index.html`，在浏览器中查看。

**方式二：启动本地服务器（推荐）**

```bash
# Python 3
python -m http.server 8000
```

然后访问 http://localhost:8000

## 自定义内容

- 编辑 `index.html` 中的姓名、简介、技能、项目、联系方式
- 修改 `style.css` 中 `:root` 和 `[data-theme="dark"]` 的颜色变量调整主题
- 项目链接默认指向 `https://github.com/`，替换为自己的仓库地址

## 部署到 GitHub Pages

本项目通过课程仓库 `NJUSE_summer_course` 的 GitHub Actions 自动部署，站点内容来自 `personal-site/` 子目录。

**一次性设置：** 进入仓库 **Settings → Pages → Build and deployment → Source**，选择 **"GitHub Actions"**（而非 "Deploy from a branch"）。

**触发方式：**

- 推送到 `main` 分支且修改了 `personal-site/**` 或 workflow 文件时自动部署
- 在仓库 **Actions** 页手动运行 workflow（`workflow_dispatch`）

部署成功后约 1 分钟访问：

```
https://existere322.github.io/NJUSE_summer_course/
```

## 技术说明

- 无前端框架、无构建工具
- 主题切换通过 `data-theme` 属性 + CSS 变量实现
- 首次访问跟随系统偏好（`prefers-color-scheme`），之后读取 `localStorage`
