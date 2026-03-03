# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YXK AI Fire 是一个同时支持**微信小程序**（`weapp/`）和**抖音小程序**（`ttapp/`）的原生双平台项目，无构建工具，直接用各平台开发者工具打开运行。

## 运行方式

| 平台 | 工具 | 导入目录 |
|------|------|---------|
| 微信 | 微信开发者工具 | `weapp/` |
| 抖音 | 抖音开发者工具 | `ttapp/` |

无 npm / 构建步骤，直接导入目录即可预览。

## 代码架构

### 双平台文件对应关系

| 用途 | 微信 (`weapp/`) | 抖音 (`ttapp/`) |
|------|----------------|----------------|
| 模板 | `.wxml` | `.ttml` |
| 样式 | `.wxss` | `.ttss` |
| 逻辑 | `.js` | `.js` |
| 配置 | `.json` | `.json` |

### 平台 API 差异

- 微信：`wx.*`，Canvas 使用 `type="2d"` + `wx.createSelectorQuery()` 新版 API
- 抖音：`tt.*`，Canvas 使用旧版 `tt.createCanvasContext()` + `ctx.draw()` 刷新

### 动画系统（`pages/index/index.js`）

序列帧动画通过 Canvas 运行时绘制实现（无外部图片资源）：

- `buildFrames(w, h, emberY)` — 预计算 24 帧数据，每帧包含 6 个烟雾粒子状态（位置、透明度、半径）和炭火脉动强度
- `_drawFrame(frameIdx)` — 按帧索引绘制：香柱 → 灰白燃烬段 → 炭火光晕（径向渐变）→ 烟雾粒子（径向渐变）
- 动画以 `setInterval` 驱动，12fps，24帧为一个循环（2秒/周期）
- 页面私有状态（`_ctx`, `_timer`, `_frame` 等）直接挂在 Page 实例上，不经过 `setData`

### 新增页面的步骤

1. 在 `weapp/pages/` 和 `ttapp/pages/` 下各新建同名目录
2. 在对应平台的 `app.json` → `"pages"` 数组中注册路径
3. 微信用 `.wxml`/`.wxss`，抖音用 `.ttml`/`.ttss`

## Git 操作注意事项

当前环境 bash shell 存在初始化问题（`add_item` fatal error），请使用以下方式执行 git 命令：

```bash
# 正确：直接用 git -C 指定目录
git -C "H:/YXK/WP_AI/YXK_AI_Fire" add <files>
git -C "H:/YXK/WP_AI/YXK_AI_Fire" commit -m "message"
git -C "H:/YXK/WP_AI/YXK_AI_Fire" push origin main

# 错误：cd 后再执行会触发 bash 崩溃
cd "h:/YXK/WP_AI/YXK_AI_Fire" && git ...
```
