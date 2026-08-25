# -*- coding: utf-8 -*-
"""把 questions/ 下所有题库合并生成网页版 questions.js。"""
import json
import glob
import os

BASE = os.path.dirname(os.path.abspath(__file__))
all_q = []
for f in sorted(glob.glob(os.path.join(BASE, "questions", "*.json"))):
    with open(f, "r", encoding="utf-8-sig") as fh:
        data = json.load(fh)
    for q in data.get("questions", []):
        q.setdefault("category", data.get("category", "未分类"))
        all_q.append(q)

out = os.path.join(BASE, "docs", "questions.js")
with open(out, "w", encoding="utf-8") as fh:
    fh.write("window.QUESTIONS = ")
    fh.write(json.dumps(all_q, ensure_ascii=False))
    fh.write(";\n")
print(f"questions.js 生成完成，共 {len(all_q)} 题")
