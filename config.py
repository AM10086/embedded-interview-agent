# -*- coding: utf-8 -*-
"""全局配置：题库路径、每轮题数、可选 AI 讲解接口。"""
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
        "api_key": "",
        "base_url": "https://api.deepseek.com/v1/chat/completions",
        "model": "deepseek-chat"
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
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                merge(cfg, json.load(f))
        except Exception:
            pass
    return cfg
