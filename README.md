# 🤖 嵌入式面试 AI Agent

> 按你的薄弱点智能出题 · 大厂审问式面试模拟 · 自动判分讲解，为嵌入式软件求职与面试做好准备

## 📑 目录
- [✨ 功能](#features)
- [🚀 快速开始（Python 版）](#quickstart)
- [🌐 网页版](#web)
- [🔌 接入 AI（多模型）](#ai)
- [📱 微信小程序版](#miniprogram)
- [📁 项目结构](#structure)

## <a name="features"></a> ✨ 功能
- **智能出题**：根据历史答题正确率加权抽题，正确率越低越常考
- **专项练习**：按 C 语言 / 驱动外设 / RTOS / 嵌入式 Linux / 网络协议 / 数据结构 / Git 分类练习
- **面试模拟**：限时 60 秒/题，还原真实面试节奏
- **题库目录**：按分类浏览 + 关键词搜索全部题目
- **薄弱点分析**：自动统计各知识点正确率，生成 Top 薄弱点
- **AI 智能诊断**（可选）：基于答题数据，AI 生成解决方案、学习目标与面试建议
- **简历驱动 AI 模拟面试**（可选）：AI 分析简历 → 20 题审问式面试 → 面试分析/修正计划/简历优化/学习计划
- **网页版简历 AI 模拟面试**：上传简历 + 目标岗位 → 大厂审问式 20 题面试（层层追问/挑战式提问/STAR 深挖/综合压力题）→ 面试分析/修正计划/简历优化/学习计划；内置审问引擎免 Key 开箱即用，配置大模型 API Key 后全真驱动
- **多平台**：Python 命令行 + 网页版 + 微信小程序，共用同一份题库

## <a name="quickstart"></a> 🚀 快速开始（Python 版）
```bash
cd python
python agent.py
```
Windows 也可直接双击 `python/启动Agent.bat` 一键启动。

## <a name="web"></a> 🌐 网页版（无需安装，浏览器直接玩）
👉 **https://am10086.github.io/embedded-interview-agent/**

> 纯前端实现，支持按薄弱点出题、面试模拟、薄弱点分析（本地存储）、**简历 AI 模拟面试**（上传简历 → 20 题大厂审问式面试 → 四维报告），数据与 Python 版共用同一题库。

## <a name="ai"></a> 🔌 接入 AI（多模型）
编辑 `python/config.json`，把 `ai.enabled` 改为 `true`，选择 provider 并填写 api_key：
```json
{
  "ai": { "enabled": true, "provider": "deepseek", "api_key": "你的API Key" }
}
```
支持的大模型：
| provider | 说明 |
|---|---|
| `deepseek` | DeepSeek（推荐，便宜）|
| `openai` | OpenAI GPT |
| `qwen` | 通义千问 |
| `zhipu` | 智谱 GLM |
| `kimi` | Kimi 月之暗面 |
| `ollama` | 本地 Ollama（无需 API Key）|

## <a name="miniprogram"></a> 📱 微信小程序版（miniprogram/）
完整的小程序源码（首页 / 答题 / 面试模拟 / 题库目录 / 薄弱点分析 / 成绩）。
**使用步骤：**
1. 下载安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开工具 → 导入项目 → 选择 `miniprogram/` 目录（AppID 可用测试号）
3. 编译预览即可在模拟器/手机体验

> 小程序题库与网页版共用同一份 660 题数据。

## <a name="structure"></a> 📁 项目结构
```
embedded-interview-agent/
├── README.md                  # 项目说明（本文件）
├── python/                    # Python 命令行版
│   ├── agent.py               # 主程序（菜单）
│   ├── quiz.py                # 答题引擎（智能出题/判分）
│   ├── analyzer.py            # 薄弱点分析
│   ├── interview.py           # 简历驱动 AI 模拟面试
│   ├── config.py / config.json# 配置（多模型 AI）
│   ├── generate_questions.py  # 题库生成器（基于知识库）
│   ├── gen_web_questions.py   # 网页版题库生成脚本
│   ├── 启动Agent.bat          # Windows 一键启动
│   ├── questions/             # 题库（660 题，7 大分类）
│   └── terms/                 # 知识点知识库（生成器数据源）
├── docs/                      # 网页版（GitHub Pages 部署源）
│   ├── index.html             # 网页应用
│   └── questions.js           # 网页题库数据
└── miniprogram/               # 微信小程序版
    ├── app.js / app.json / app.wxss
    ├── project.config.json
    ├── data/questions.js      # 小程序题库数据
    └── pages/                 # 首页/答题/题库/薄弱点/成绩
```
