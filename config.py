# -*- coding: utf-8 -*-
"""全局配置：题库路径、每轮题数、可选 AI 讲解接口（支持多模型）。"""
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTIONS_DIR = os.path.join(BASE_DIR, "questions")
HISTORY_FILE = os.path.join(BASE_DIR, "history.json")
CONFIG_FILE = os.path.join(BASE_DIR, "config.json")

DEFAULTS = {
    "questions_per_session": 10,
    "ai": {
        "enabled": False,
        "provider": "deepseek",
        "api_key": ""
    },
    "providers": {
        "deepseek": {"name": "DeepSeek", "base_url": "https://api.deepseek.com/v1/chat/completions", "model": "deepseek-chat"},
        "openai": {"name": "OpenAI", "base_url": "https://api.openai.com/v1/chat/completions", "model": "gpt-4o-mini"},
        "qwen": {"name": "通义千问", "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", "model": "qwen-plus"},
        "zhipu": {"name": "智谱GLM", "base_url": "https://open.bigmodel.cn/api/paas/v4/chat/completions", "model": "glm-4-flash"},
        "kimi": {"name": "Kimi月之暗面", "base_url": "https://api.moonshot.cn/v1/chat/completions", "model": "moonshot-v1-8k"},
        "ollama": {"name": "Ollama本地", "base_url": "http://localhost:11434/v1/chat/completions", "model": "qwen2.5:7b", "no_key": True}
    }
}


def load_config():
    cfg = json.loads(json.dumps(DEFAULTS))

    def merge(base, extra):
        for k, v in extra.items():
            if isinstance(v, dict) and isinstance(base.get(k), dict):
                merge(base[k], v)
            else:
                base[k] = v

    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8-sig") as f:
                merge(cfg, json.load(f))
        except Exception:
            pass
    return cfg
