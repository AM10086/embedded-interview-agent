# -*- coding: utf-8 -*-
"""题库生成器：基于 terms/ 知识库自动生成概念选择题和判断题。
用法：python generate_questions.py
"""
import json
import os
import random

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TERMS_DIR = os.path.join(BASE_DIR, "terms")
OUT_DIR = os.path.join(BASE_DIR, "questions")

CATEGORY_MAP = {
    "c.json": "C 语言",
    "driver.json": "驱动与外设",
    "rtos.json": "RTOS",
    "linux.json": "嵌入式 Linux",
    "network.json": "网络与协议",
    "ds_algo.json": "数据结构与算法",
    "git_tools.json": "Git 与工具链",
}


def load_terms():
    terms = {}  # category -> [ {t, d} ]
    for fname in sorted(os.listdir(TERMS_DIR)):
        if not fname.endswith(".json"):
            continue
        cat = CATEGORY_MAP.get(fname, fname[:-5])
        with open(os.path.join(TERMS_DIR, fname), "r", encoding="utf-8-sig") as f:
            terms[cat] = json.load(f)
    return terms


def make_mcq(term, defn, all_terms, rng):
    """概念反选：给定义，选概念。"""
    distractors = rng.sample(all_terms, min(3, len(all_terms)))
    # 保证干扰项不包含正确答案
    distractors = [t for t in distractors if t["t"] != term["t"]][:3]
    options_pool = [term] + distractors
    rng.shuffle(options_pool)
    letters = "ABCD"
    opts = [f"{letters[i]}. {o['t']}" for i, o in enumerate(options_pool)]
    correct_idx = options_pool.index(term)
    return {
        "type": "single",
        "question": f"下列哪个概念是指：{defn}？",
        "options": opts,
        "answer": letters[correct_idx],
        "explanation": f"{term['t']}：{defn}",
    }


def make_judge_true(term, defn):
    return {
        "type": "judge",
        "question": f"判断：{term['t']} 的含义是“{defn}”。",
        "answer": "对",
        "explanation": f"正确。{term['t']}：{defn}",
    }


def make_judge_false(term, defn, other, rng):
    other_term, other_def = other["t"], other["d"]
    return {
        "type": "judge",
        "question": f"判断：{term['t']} 的含义是“{other_def}”。",
        "answer": "错",
        "explanation": f"错误。“{other_def}”描述的是 {other_term}。{term['t']} 的正确含义是：{defn}",
    }


def main():
    rng = random.Random(42)
    terms = load_terms()
    all_terms = [t for cat in terms.values() for t in cat]
    os.makedirs(OUT_DIR, exist_ok=True)

    total = 0
    for cat, tlist in terms.items():
        out = []
        for term in tlist:
            defn = term["d"]
            out.append(make_mcq(term, defn, all_terms, rng))
            out.append(make_judge_true(term, defn))
            other = rng.choice([t for t in all_terms if t["t"] != term["t"]])
            out.append(make_judge_false(term, defn, other, rng))
        safe = {"C 语言": "c_language", "驱动与外设": "driver", "RTOS": "rtos",
                "嵌入式 Linux": "linux", "网络与协议": "network",
                "数据结构与算法": "ds_algo", "Git 与工具链": "git_tools"}.get(cat, cat)
        path = os.path.join(OUT_DIR, f"gen_{safe}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"category": cat, "questions": out}, f, ensure_ascii=False, indent=1)
        total += len(out)
        print(f"  {cat}: 生成 {len(out)} 题 -> {os.path.basename(path)}")
    print(f"共生成 {total} 题")


if __name__ == "__main__":
    main()
