# -*- coding: utf-8 -*-
"""嵌入式面试 AI Agent —— 主程序
功能：智能出题（按薄弱点加权）、专项练习、面试模拟、薄弱点分析、可选 AI 讲解
运行：python agent.py
"""
import json
import random
import urllib.request

from config import load_config
from quiz import load_all_questions, run_quiz, check_answer
from analyzer import History


def ai_ask(prompt, cfg):
    """调用大模型接口（支持 DeepSeek/OpenAI/通义/智谱/Kimi/Ollama，在 config.json 配置）。"""
    ai = cfg.get("ai", {})
    if not ai.get("enabled"):
        return None
    provider_key = ai.get("provider", "deepseek")
    providers = cfg.get("providers", {})
    prov = providers.get(provider_key, providers.get("deepseek", {}))
    base_url = prov.get("base_url", "")
    model = prov.get("model", "deepseek-chat")
    api_key = ai.get("api_key", "")
    if not prov.get("no_key") and not api_key:
        return "（未配置 API Key：请在 config.json 的 ai.api_key 填写）"
    body = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
    }).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = "Bearer " + api_key
    req = urllib.request.Request(base_url, data=body, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"（AI 调用失败：{e}）"


def ai_explain(q, user_answer, cfg):
    prompt = (
        "你是嵌入式软件面试辅导老师。请点评学生的回答，并给出标准答案要点，简洁专业。\n\n"
        f"题目：{q['question']}\n"
        f"参考答案要点：{q.get('answer', '')}\n"
        f"学生的回答：{user_answer or '（未作答）'}\n"
    )
    return ai_ask(prompt, cfg)


def mock_interview(questions, history, count=10):
    """面试模拟：连续作答，简答题直接给参考答案。"""
    pool = random.sample(questions, min(count, len(questions)))
    score = 0
    for i, q in enumerate(pool, 1):
        print("\n" + "=" * 52)
        print(f"【面试模拟 {i}/{len(pool)}】[{q['category']}] {q['question']}")
        for opt in q.get("options", []):
            print("  " + opt)
        if q.get("type") == "judge":
            print("（回答 对 / 错）")
        ans = input("你的回答: ").strip()
        result = check_answer(q, ans)
        if result is True:
            score += 1
            print("[OK] 正确")
        elif result is False:
            print(f"[X] 参考答案：{q.get('answer')}")
        else:
            print(f"[答案] 参考答案：{q.get('answer')}")
        if q.get("explanation"):
            print("[讲解] 讲解：" + q["explanation"])
        history.record(q["category"], result is not False)
    print("\n" + "=" * 52)
    print(f"[得分] 模拟得分：{score}/{len(pool)}")


def menu(categories):
    print("\n===== [AI] 嵌入式面试 AI Agent =====")
    print("1. 开始练习（按薄弱点智能出题）")
    print("2. 专项练习（按知识点）")
    print("3. 面试模拟（随机题连答）")
    print("4. 薄弱点分析报告")
    print("5. AI 自由提问（需配置 API Key）")
    print("0. 退出")
    print("知识点分类：" + " / ".join(categories))
    return input("请选择: ").strip()


def main():
    cfg = load_config()
    questions = load_all_questions()
    if not questions:
        print("[!] 题库为空，请检查 questions/ 目录。")
        return
    history = History()
    categories = sorted(set(q["category"] for q in questions))

    while True:
        choice = menu(categories)
        if choice == "1":
            run_quiz(questions, history, count=cfg.get("questions_per_session", 10))
        elif choice == "2":
            print("\n知识点分类：")
            for i, c in enumerate(categories, 1):
                print(f"  {i}. {c}")
            idx = input("选择分类编号: ").strip()
            try:
                cat = categories[int(idx) - 1]
            except (ValueError, IndexError):
                print("无效选择")
                continue
            run_quiz(questions, history, count=cfg.get("questions_per_session", 10), category=cat)
        elif choice == "3":
            mock_interview(questions, history, count=cfg.get("questions_per_session", 10))
        elif choice == "4":
            print(history.report())
        elif choice == "5":
            q_text = input("请输入你的问题: ").strip()
            if not q_text:
                continue
            ans = ai_ask(
                "你是嵌入式软件面试辅导老师，请专业、简洁地回答下面的问题：\n" + q_text,
                cfg,
            )
            if ans is None:
                print("[!] 未启用 AI。请在 config.json 里配置 api_key 并把 enabled 改为 true。")
            else:
                print("\n[AI] AI 回答：\n" + ans)
        elif choice == "0":
            print("加油，祝你面试顺利！bye")
            break
        else:
            print("无效选择")


if __name__ == "__main__":
    main()


