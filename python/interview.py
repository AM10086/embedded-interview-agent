# -*- coding: utf-8 -*-
"""简历驱动的 AI 模拟面试（大厂面试官审问式）
流程：简历分析 → 20 题模拟面试（交互式） → 面试分析 + 修正计划 + 简历优化 + 学习计划
"""
import os

from agent import ai_chat

SYSTEM_PROMPT = (
    "你是资深大厂嵌入式软件面试官（风格对标华为/大疆/字节/小米），擅长'审问式'面试：\n"
    "1. 层层追问：抓住一个技术点不断深挖，直到确认对方真实水平，绝不轻易放过模糊回答\n"
    "2. 挑战式提问：对含糊其辞的回答立刻反问'具体怎么实现的？''数据是多少？''为什么这么做？'"
    "'如果...会怎样？'\n"
    "3. STAR 追问：针对简历项目追问 Situation/Task/Action/Result，验证项目真实性\n"
    "4. 难度递进：基础概念 → 深入原理 → 综合场景 → 压力题，循序渐进\n"
    "5. 判断标准：能讲清原理、能量化数据、能说出取舍（trade-off）才算通过\n"
    "说话简洁、直接、有压迫感但不失礼貌；一次只问一个问题。"
)


def read_resume():
    """获取简历：文件路径 或 直接粘贴。"""
    print("\n请提供你的简历（两种方式）：")
    print("  1. 输入简历文件路径（支持 .txt / .md，如 C:\\resume.md）")
    print("  2. 直接粘贴简历文本（粘贴完输入 END 结束）")
    choice = input("请选择 [1/2]: ").strip()
    if choice == "1":
        path = input("文件路径: ").strip().strip('"').strip("'")
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8-sig") as f:
                return f.read()
        print("[!] 文件不存在，请检查路径。")
        return None
    else:
        print("请粘贴简历内容（输入 END 结束）：")
        lines = []
        while True:
            line = input()
            if line.strip().upper() == "END":
                break
            lines.append(line)
        text = "\n".join(lines).strip()
        return text or None


def step1_analyze(resume, position, cfg):
    """第一步：AI 分析简历。"""
    print("\n" + "=" * 56)
    print("第一步：AI 简历分析")
    print("=" * 56)
    prompt = (
        f"请对下面这份简历做专业分析（目标岗位：{position}）。输出：\n"
        "## 一、整体评价\n（一句话定位 + 强项 3 条 + 弱项 3 条）\n"
        "## 二、面试官会质疑的风险点\n（列出 3-5 个面试官一定会深挖/挑战的地方，说明原因和可能的追问方向）\n"
        "## 三、简历表达优化建议\n（指出可以量化、可以改进、应该删除/补充的部分）\n\n"
        "简历内容：\n" + resume[:4000]
    )
    ans = ai_chat([{"role": "system", "content": SYSTEM_PROMPT},
                   {"role": "user", "content": prompt}], cfg)
    if ans is None:
        print("[!] 未启用 AI。请在 config.json 里把 ai.enabled 改为 true 并填写 api_key。")
        return None
    print("\n" + ans)
    return ans


def step2_interview(resume, position, analysis, cfg):
    """第二步：20 题交互式模拟面试（大厂审问式）。"""
    print("\n" + "=" * 56)
    print("第二步：20 题模拟面试（大厂审问式）")
    print("=" * 56)
    print("规则：AI 每次问 1 题，你认真作答（建议用 STAR 结构、带数据）。开始！\n")

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"这是应聘者（目标岗位：{position}）的简历：\n{resume[:4000]}\n\n"
                                    f"以及你对简历的分析（用于把握深挖方向）：\n{analysis}"},
        {"role": "assistant", "content": analysis},
    ]
    answers = []
    for i in range(1, 21):
        if i == 1:
            q_prompt = "请提出第 1 个问题：先让应聘者做个 30 秒自我介绍（要求突出技术亮点），然后立刻进入第一个技术题。只问一个问题。"
        elif i <= 8:
            q_prompt = (f"请提出第 {i} 题：基础到进阶的技术题（C/驱动/RTOS 方向），"
                        "针对上一题回答模糊的点可以优先深挖。只问一个问题，难度递进。")
        elif i <= 15:
            q_prompt = (f"请提出第 {i} 题：结合简历项目（如 FreeRTOS 多任务、STM32+OpenMV 循迹、TinyML、ARM-Linux 实习）"
                        "做 STAR 深挖或综合场景题。若上一题回答有漏洞，先挑战它再换题。只问一个问题。")
        else:
            q_prompt = (f"请提出第 {i} 题：压力题/综合题/开放设计题（如'给你一块新 MCU 你会怎么上手''如何设计一个可靠的通信系统'），"
                        "考察工程思维和取舍能力。只问一个问题。")
        messages.append({"role": "user", "content": q_prompt})
        q = ai_chat(messages, cfg)
        if q is None:
            print("[!] AI 调用中断，请检查配置后重试。")
            return answers
        messages.append({"role": "assistant", "content": q})
        print(f"\n【面试官 Q{i}】{q}")
        ans = input("【你】").strip()
        if not ans:
            ans = "（未作答，跳过）"
        answers.append({"q": q, "a": ans, "no": i})
        messages.append({"role": "user", "content": f"应聘者第 {i} 题的回答：{ans}"})
    return answers


def step3_report(messages, answers, cfg):
    """第三步：AI 总结报告。"""
    print("\n" + "=" * 56)
    print("第三步：AI 面试总结与提升方案")
    print("=" * 56)
    report_prompt = (
        "20 题面试已结束。请基于全程对话，输出一份完整、专业、可执行的报告：\n"
        "## 一、面试分析\n（整体表现评分 0-100、分题型表现、暴露的知识短板、表达与逻辑问题、面试官角度的录用判断）\n"
        "## 二、修正计划\n（针对暴露的问题，按优先级列出可执行改进步骤，每条给出具体做法和周期）\n"
        "## 三、简历优化方案\n（结合面试暴露的问题，给出简历具体修改建议：补充哪些技能、项目描述怎么改、"
        "怎么量化成果、哪些经历要突出）\n"
        "## 四、学习计划\n（按周拆分：第 1 周/第 2 周/第 3-4 周，具体到知识点、推荐资源和练习方法，"
        "贴合目标岗位嵌入式软件工程师）\n"
        "要求：具体、量化、可执行，不要空话。"
    )
    messages.append({"role": "user", "content": report_prompt})
    report = ai_chat(messages, cfg)
    if report is None:
        return
    print("\n" + report)
    # 保存报告
    try:
        fname = "interview_report.txt"
        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), fname),
                  "w", encoding="utf-8") as f:
            f.write(report)
        print(f"\n[已保存] 报告已写入 {fname}")
    except Exception:
        pass


def start(cfg):
    """主入口。"""
    print("\n===== 简历驱动 AI 模拟面试 =====")
    resume = read_resume()
    if not resume:
        print("[!] 未获取到简历内容。")
        return
    position = input("应聘岗位（回车默认：嵌入式软件工程师（实习））: ").strip()
    if not position:
        position = "嵌入式软件工程师（实习）"

    analysis = step1_analyze(resume, position, cfg)
    if analysis is None:
        return
    answers = step2_interview(resume, position, analysis, cfg)
    if not answers:
        return
    step3_report_build(analysis, answers, cfg)


def step3_report_build(analysis, answers, cfg):
    """第三步：基于完整对话重建消息后生成报告。"""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": "以下是刚才的 20 题模拟面试记录，请基于此输出总结报告。"},
    ]
    for a in answers:
        messages.append({"role": "user", "content": f"第{a['no']}题：{a['q']}"})
        messages.append({"role": "assistant", "content": f"应聘者回答：{a['a']}"})
    step3_report(messages, answers, cfg)

