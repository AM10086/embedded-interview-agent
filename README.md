# 🤖 嵌入式面试 AI Agent

> 一个帮助你备战嵌入式软件面试的智能练习 Agent：按你的薄弱点智能出题、自动判分、讲解、生成薄弱点分析报告，可选接入大模型做 AI 点评。

## ✨ 功能
- **智能出题**：根据历史答题正确率加权抽题，正确率越低越常考
- **专项练习**：按 C 语言 / 驱动外设 / RTOS / 嵌入式 Linux / 网络协议 分类练习
- **面试模拟**：随机连答 + 参考答案，模拟真实面试节奏
- **薄弱点分析**：自动统计各知识点正确率，生成 Top 薄弱点
- **AI 自由问答**（可选）：配置 API Key 后，可让大模型讲解任意面试题
- **AI 智能诊断**（可选）：基于答题数据，AI 自动分析薄弱点 → 给出解决方案 → 制定学习目标 → 面试准备建议
- **解析优化**：每题解析包含【解析】【易错点】【面试追问】，自动生成题含干扰项辨析+面试提示

## 🌐 网页版（无需安装，浏览器直接玩）
👉 **https://am10086.github.io/embedded-interview-agent/**

> 纯前端实现，支持按薄弱点出题、面试模拟、薄弱点分析（本地存储），数据与 Python 版共用同一题库。

## 🚀 快速开始
```bash
# 1. 需要 Python 3.8+
python agent.py
```

## 📁 项目结构
```
embedded-interview-agent/
├── agent.py          # 主程序（菜单）
├── quiz.py           # 答题引擎（出题/判分）
├── analyzer.py       # 薄弱点分析与历史记录
├── config.py         # 配置加载
├── config.json       # 用户配置（题数、AI）
├── questions/        # 题库（JSON）
│   ├── c_language.json
│   ├── driver.json
│   ├── rtos.json
│   ├── linux.json
│   └── network.json
└── history.json      # 答题历史（自动生成）
```

## 🔌 可选：接入 AI 讲解（支持多模型）
编辑 `config.json`，把 `ai.enabled` 改为 `true`，选择 provider 并填写 api_key：
```json
{
  "ai": {
    "enabled": true,
    "provider": "deepseek",
    "api_key": "你的API Key"
  }
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

## 📱 微信小程序版（miniprogram/）
完整的小程序源码（首页 / 答题 / 面试模拟 / 题库目录 / 薄弱点分析 / 成绩）。
**使用步骤：**
1. 下载安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开工具 → 导入项目 → 选择 `miniprogram/` 目录（AppID 可用测试号）
3. 编译预览即可在模拟器/手机体验

> 小程序题库与网页版共用同一份 660 题数据。



