# 🤖 嵌入式面试 AI Agent

> 一个帮助你备战嵌入式软件面试的智能练习 Agent：按你的薄弱点智能出题、自动判分、讲解、生成薄弱点分析报告，可选接入大模型做 AI 点评。

## ✨ 功能
- **智能出题**：根据历史答题正确率加权抽题，正确率越低越常考
- **专项练习**：按 C 语言 / 驱动外设 / RTOS / 嵌入式 Linux / 网络协议 分类练习
- **面试模拟**：随机连答 + 参考答案，模拟真实面试节奏
- **薄弱点分析**：自动统计各知识点正确率，生成 Top 薄弱点
- **AI 自由问答**（可选）：配置 API Key 后，可让大模型讲解任意面试题

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

## 📚 题库来源
结合嵌入式求职高频考点与个人简历项目整理（FreeRTOS / STM32 / ARM-Linux / 网络协议等）。
欢迎提交 Issue / PR 补充题目。

## 📄 License
MIT

