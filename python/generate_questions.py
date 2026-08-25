# -*- coding: utf-8 -*-
"""题库生成器：基于 terms/ 知识库自动生成概念选择题和判断题。
用法：python generate_questions.py
解析结构：定义 + 面试提示（分类定制）+ 相关概念
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

CATEGORY_TIPS = {
    "C 语言": "面试提示：C 语言高频考点集中在指针、内存、关键字语义，作答建议先说结论再给例子；易错点是区分声明与定义、const/static/volatile 的修饰对象。",
    "驱动与外设": "面试提示：外设类问题常考总线区别（UART/SPI/I2C）、寄存器操作与中断/DMA 取舍，回答时最好结合你的项目经历举例；易错点是混淆同步/异步与全双工/半双工。",
    "RTOS": "面试提示：RTOS 重点考任务调度、同步与资源保护（信号量/互斥量/队列），面试官喜欢追问'如果优先级反转怎么办'；易错点是分不清同步与互斥的适用场景。",
    "嵌入式 Linux": "面试提示：嵌入式 Linux 常考系统移植流程、设备树、进程线程与驱动框架，回答要体现工程流程；易错点是混淆设备树与内核配置、静态库与动态库。",
    "网络与协议": "面试提示：网络题常考 TCP/UDP 区别、三次握手与自定义通信协议设计（帧头+校验），结合物联网场景回答更出彩；易错点是忘记字节序转换。",
    "数据结构与算法": "面试提示：数据结构常考复杂度与选型（数组 vs 链表、队列缓冲），算法题建议先讲思路再写代码；易错点是忽略最坏时间复杂度。",
    "Git 与工具链": "面试提示：工具链题常考 Git 工作流、构建调试流程（CMake/GDB），体现工程规范意识；易错点是混淆工作区/暂存区/版本库。",
}


def load_terms():
    terms = {}
    for fname in sorted(os.listdir(TERMS_DIR)):
        if not fname.endswith(".json"):
            continue
        cat = CATEGORY_MAP.get(fname, fname[:-5])
        with open(os.path.join(TERMS_DIR, fname), "r", encoding="utf-8-sig") as f:
            terms[cat] = json.load(f)
    return terms


def make_mcq(term, defn, all_terms, rng, tip):
    distractors = [t for t in rng.sample(all_terms, 8) if t["t"] != term["t"]][:3]
    options_pool = [term] + distractors
    rng.shuffle(options_pool)
    letters = "ABCD"
    opts = [f"{letters[i]}. {o['t']}" for i, o in enumerate(options_pool)]
    correct_idx = options_pool.index(term)
    other = [o["t"] for o in options_pool if o["t"] != term["t"]]
    explanation = (
        f"【解析】{term['t']} 是指：{defn}。"
        f"干扰项辨析：{other[0]}、{other[1]}、{other[2]} 分别是其他概念，注意不要混淆。"
        f"{tip}"
    )
    return {
        "type": "single",
        "question": f"下列哪个概念是指：{defn}？",
        "options": opts,
        "answer": letters[correct_idx],
        "explanation": explanation,
    }


def make_judge_true(term, defn, tip):
    return {
        "type": "judge",
        "question": f"判断：{term['t']} 的含义是“{defn}”。",
        "answer": "对",
        "explanation": f"【解析】判断正确。{term['t']} 的定义：{defn}。{tip}",
    }


def make_judge_false(term, defn, other, tip):
    other_term, other_def = other["t"], other["d"]
    return {
        "type": "judge",
        "question": f"判断：{term['t']} 的含义是“{other_def}”。",
        "answer": "错",
        "explanation": f"【解析】判断错误。题干描述“{other_def}”指的是 {other_term}，不是 {term['t']}。{term['t']} 的正确含义是：{defn}。{tip}",
    }


def main():
    rng = random.Random(42)
    terms = load_terms()
    all_terms = [t for cat in terms.values() for t in cat]
    os.makedirs(OUT_DIR, exist_ok=True)

    total = 0
    for cat, tlist in terms.items():
        out = []
        tip = CATEGORY_TIPS.get(cat, "")
        for term in tlist:
            defn = term["d"]
            out.append(make_mcq(term, defn, all_terms, rng, tip))
            out.append(make_judge_true(term, defn, tip))
            other = rng.choice([t for t in all_terms if t["t"] != term["t"]])
            out.append(make_judge_false(term, defn, other, tip))
        safe = {"C 语言": "c_language", "驱动与外设": "driver", "RTOS": "rtos",
                "嵌入式 Linux": "linux", "网络与协议": "network",
                "数据结构与算法": "ds_algo", "Git 与工具链": "git_tools"}.get(cat, cat)
        path = os.path.join(OUT_DIR, f"gen_{safe}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"category": cat, "questions": out}, f, ensure_ascii=False, indent=1)
        total += len(out)
        print(f"  {cat}: {len(out)} 题")
    print(f"共生成 {total} 题")


if __name__ == "__main__":
    main()
