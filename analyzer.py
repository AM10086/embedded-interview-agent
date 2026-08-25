# -*- coding: utf-8 -*-
"""薄弱点分析：读写答题历史，计算各知识点正确率与权重。"""
import json
import os
from config import HISTORY_FILE


class History:
    def __init__(self):
        self.data = self._load()

    def _load(self):
        if os.path.exists(HISTORY_FILE):
            try:
                with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}

    def save(self):
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)

    def record(self, category, ok):
        entry = self.data.setdefault(category, {"correct": 0, "total": 0})
        entry["total"] += 1
        if ok:
            entry["correct"] += 1
        self.save()

    def category_weights(self):
        """正确率越低 → 权重越高 → 越容易被抽到（智能出题核心）。"""
        weights = {}
        for cat, e in self.data.items():
            total = e.get("total", 0)
            if total == 0:
                weights[cat] = 1.0
            else:
                rate = e.get("correct", 0) / total
                weights[cat] = round(1.0 + (1.0 - rate) * 2.0, 2)
        return weights

    def report(self):
        rows = []
        for cat, e in self.data.items():
            total = e.get("total", 0)
            if total == 0:
                continue
            correct = e.get("correct", 0)
            rate = correct / total
            rows.append((cat, correct, total, rate))
        if not rows:
            return "📊 暂无答题记录，先去练几题吧！"
        rows.sort(key=lambda r: r[3])
        lines = ["📊 薄弱点分析（正确率从低到高）："]
        for cat, correct, total, rate in rows:
            bar = "█" * int(rate * 10) + "░" * (10 - int(rate * 10))
            lines.append(f"  {cat:<12} {bar} {rate * 100:.0f}%  （{correct}/{total}）")
        return "\n".join(lines)
