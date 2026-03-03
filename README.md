# YXK AI Fire

一个同时支持**微信小程序**和**抖音小程序**的跨平台项目，使用各平台原生开发方式构建。

## 项目结构

```
YXK_AI_Fire/
├── weapp/          # 微信小程序
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── project.config.json
│   └── pages/
│       └── index/
│           ├── index.js
│           ├── index.json
│           ├── index.wxml
│           └── index.wxss
└── ttapp/          # 抖音小程序
    ├── app.js
    ├── app.json
    ├── app.ttss
    ├── project.config.json
    └── pages/
        └── index/
            ├── index.js
            ├── index.json
            ├── index.ttml
            └── index.ttss
```

## 平台差异说明

| 文件类型 | 微信小程序 | 抖音小程序 |
|--------|-----------|-----------|
| 模板文件 | `.wxml`   | `.ttml`   |
| 样式文件 | `.wxss`   | `.ttss`   |
| 逻辑文件 | `.js`     | `.js`     |
| 配置文件 | `.json`   | `.json`   |

## 运行流程

### 微信小程序

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具，点击 **「+」新建项目**
3. 目录选择本项目的 `weapp/` 文件夹
4. AppID 填写自己的 AppID（或选择「测试号」）
5. 点击**确定**，即可在模拟器中看到启动页显示 `hello`

### 抖音小程序

1. 下载并安装 [抖音开发者工具](https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/developer-instrument/download/developer-instrument-update-and-download)
2. 打开抖音开发者工具，点击 **「+」新建项目**
3. 目录选择本项目的 `ttapp/` 文件夹
4. AppID 填写自己的 AppID（或使用测试模式）
5. 点击**确定**，即可在模拟器中看到启动页显示 `hello`

## 技术栈

- 微信小程序原生开发
- 抖音小程序原生开发
