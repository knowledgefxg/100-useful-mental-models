# 100 个思维模型 · 中文知识手册

React + Vite 静态阅读站点：100 篇模型说明、100 张主图、68 张正文结构图，米白底与藏蓝配色。中英文对照、预渲染 HTML、站内搜索、阅读进度均已就绪，可直接构建部署。

仓库：<https://github.com/knowledgefxg/100-useful-mental-models>

## 环境要求

- **Node.js** 22.12+（推荐 24 LTS）
- **Python 3**（`npm run dev` / `npm run build` 会调用仓库内同步脚本，无需单独操作）

## 本地开发

```sh
git clone https://github.com/knowledgefxg/100-useful-mental-models.git
cd 100-useful-mental-models
npm install
npm run dev
```

浏览器打开 http://127.0.0.1:8080/ 。修改前端代码或样式会自动刷新。终端 `Ctrl+C` 结束。

端口占用：`npm run dev -- --port 8081`。

请使用上述命令启动，不要直接双击根目录 `index.html`。

## 构建与预览

```sh
npm run build
npm run preview
```

- **中文**：`/model/1/` 等
- **英文**：`/en/model/1/` 等；顶栏 **EN / 中文** 切换同一篇；阅读进度双语共用

构建输出每种语言的首页、8 个主题页、100 篇模型页及 `404.html`。首屏为完整 HTML，脚本加载后接管搜索与路由。旧 hash 链接 `#model/1` 等会自动跳转。

### 部署配置

编辑 `site.config.json`：

| 字段 | 含义 |
|------|------|
| `siteUrl` | 正式域名（无末尾 `/），用于 sitemap、canonical、分享图 |
| `base` | 站点路径：`/` 或 `/handbook/` 等 |

临时覆盖：

```sh
npm run build -- --base=/handbook/ --site=https://example.com
```

上传 `dist/` 至静态托管；`base` 须与线上路径一致。

## 阅读功能

- 八个主题，模型连续编号 1–100。
- 首页六种场景入口；搜索支持模型名、场景与正文片段。
- 阅读位置保存在本机浏览器。
- 窄屏可收起侧栏；文内「本篇目录」快速跳转章节。

## 目录说明

```
content/           模型数据（含 models.json、英文 JSON）
docs/assets/       主图与正文结构图
src/               React 应用
scripts/           同步脚本与站点构建
site.config.json   域名与 base
styles.css         全局样式
```

## 检查

```sh
npm test
npm run build
```

## 技术栈

[React](https://react.dev/) · [Vite](https://vite.dev/)
