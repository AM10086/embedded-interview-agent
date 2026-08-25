const app = getApp();
Page({
  data: { rows: [], empty: true, tip: '' },
  onShow() {
    const s = app.getStats();
    let rows = [];
    for (const c in s) if (s[c].total > 0) rows.push({ c, rate: s[c].correct / s[c].total, pct: Math.round(s[c].correct / s[c].total * 100), correct: s[c].correct, total: s[c].total });
    rows.sort((a, b) => a.rate - b.rate);
    const worst = rows.length ? rows[0] : null;
    const tip = worst
      ? '💡 建议：你的最薄弱点是 ' + worst.c + '（正确率 ' + worst.pct + '%）。先用"智能练习"锁定该分类刷题，再配合 Python 版的 AI 智能诊断获得针对性学习目标。'
      : '💡 完成几轮练习后，这里会展示你的知识短板和针对性建议。';
    this.setData({ rows, empty: rows.length === 0, tip });
  }
});
