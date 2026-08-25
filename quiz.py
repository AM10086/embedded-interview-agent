# -*- coding: utf-8 -*-
"""答题引擎：加载题库、按权重出题、判分。"""
import json
import os
import random
from config import QUESTIONS_DIR


def load_all_questions():
    questions = []
    for fname in sorted(os.listdir(QUESTIONS_DIR)):
        if not fname.endswith(".json"):
            continue
        path = os.path.join(QUESTIONS_DIR, fname)
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"⚠️ 题库加载失败 {fname}: {e}")
            continue
        for q in data.get("questions", []):
            q["category"] = data.get("category", fname)
            questions.append(q)
    return questions


def build_pool(questions, category=None, count=10, weights=None):
    """按分类/权重抽取题目。weights 为 {分类: 权重}，正确率越低权重越高。"""
    if category:
        pool = [q for q in questions if q["category"] == category]
    else:
        pool = list(questions)
    if not pool:
        return []
    if weights:
        w = [weights.get(q["category"], 1.0) for q in pool]
        return random.choices(pool, weights=w, k=min(count, len(pool)))
    return random.sample(pool, min(count, len(pool)))


def check_answer(q, user_answer):
    """单选/判断自动判分；多选按集合比较；简答返回 None（需自评）。"""
    qtype = q.get("type")
    correct = str(q.get("answer", "")).strip()
    user = user_answer.strip()
    if qtype == "short":
        return None
    if qtype == "judge":
        return user.upper() == correct.upper()
    if qtype == "single":
        return user.upper() == correct.upper()
    if qtype == "multi":
        u = set(a.strip().upper() for a in user.replace("，", ",").split(",") if a.strip())
        c = set(a.strip().upper() for a in correct.split(",") if a.strip())
        return u == c
    return False


def ask_one(q, index, total):
    print("\n" + "=" * 52)
    print(f"【{index}/{total}】[{q['category']}] {q['question']}")
    for opt in q.get("options", []):
        print("  " + opt)
    if q.get("type") == "judge":
        print("（回答 对 / 错）")
    return input("你的答案: ").strip()


def run_quiz(questions, history, count=10, category=None, mock=False):
    """练习模式主循环。mock=True 时简答题只展示参考答案，不要求自评。"""
    weights = history.category_weights()
    pool = build_pool(questions, category=category, count=count,
                      weights=None if category else weights)
    if not pool:
        print("该分类暂无题目。")
        return
    score = 0
    total = 0
    for i, q in enumerate(pool, 1):
        ans = ask_one(q, i, len(pool))
        result = check_answer(q, ans)
        if result is None:  # 简答题
            total += 1
            print("\n📖 参考答案：")
            print("  " + q.get("answer", ""))
            if q.get("explanation"):
                print("💡 讲解：")
                print("  " + q["explanation"])
            if mock:
                ok = True
                score += 1
            else:
                s = input("给自己打分（1-5，回车默认 3）: ").strip()
                try:
                    s = int(s) if s else 3
                except ValueError:
                    s = 3
                s = max(1, min(5, s))
                ok = s >= 4
                if ok:
                    score += 1
        else:
            total += 1
            ok = result
            if result:
                score += 1
                print("✅ 正确！")
            else:
                print(f"❌ 正确答案：{q.get('answer')}")
            if q.get("explanation"):
                print("💡 讲解：" + q["explanation"])
        history.record(q["category"], ok)
    print("\n" + "=" * 52)
    print(f"🎯 本轮得分：{score}/{total}")
