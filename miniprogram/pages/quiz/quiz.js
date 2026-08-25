const app = getApp();
Page({
  data: {
    mode: 'practice', idx: 0, total: 0, score: 0, streak: 0, best: 0,
    q: null, options: [], type: 'single', answered: false,
    feedback: '', fbClass: '', timerText: '', timerWarn: false, progress: 0,
    shortValue: '', gradeSel: 0, catName: ''
  },
  onLoad(options) {
    const QS = app.globalData.questions;
    const mode = options.mode || 'practice';
    const cat = decodeURIComponent(options.cat || '全部');
    let pool = cat === '全部' ? QS.slice() : QS.filter(q => q.category === cat);
    if (!pool.length) { wx.showToast({ title: '该分类暂无题目', icon: 'none' }); wx.navigateBack(); return; }
    // 智能出题（按薄弱点加权）
    const hasStats = Object.keys(app.getStats()).length > 0;
    if (mode === 'practice' && cat === '全部' && hasStats) {
      const s = app.getStats();
      const w = pool.map(q => { const e = s[q.category]; if (!e || !e.total) return 1; return 1 + (1 - e.correct / e.total) * 2; });
      const tw = w.reduce((a, b) => a + b, 0);
      const res = [];
      for (let i = 0; i < Math.min(10, pool.length); i++) {
        let r = Math.random() * tw, acc = 0, pick = pool[0];
        for (let j = 0; j < pool.length; j++) { acc += w[j]; if (r <= acc) { pick = pool[j]; break; } }
        res.push(pick);
      }
      pool = res;
    } else {
      pool = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(10, pool.length));
    }
    this.pool = pool;
    this.setData({ mode, total: pool.length, catName: pool[0].category });
    this.showQ();
  },
  showQ() {
    const q = this.pool[this.data.idx];
    let options = [];
    if (q.type === 'single') {
      options = q.options.map((o, i) => ({ key: 'ABCD'[i], text: o.replace(/^[A-D][.、]\s*/, '') }));
    }
    this.setData({
      q, options, type: q.type, answered: false, feedback: '', fbClass: '', gradeSel: 0,
      progress: Math.round(this.data.idx / this.data.total * 100)
    });
    if (this.data.mode === 'mock') this.startTimer();
  },
  startTimer() {
    this.clearTimer();
    let left = 60;
    this.setData({ timerText: '⏱ ' + left + 's', timerWarn: left <= 10 });
    this.timer = setInterval(() => {
      left--;
      if (left <= 0) { this.clearTimer(); this.answer2(-1); return; }
      this.setData({ timerText: '⏱ ' + left + 's', timerWarn: left <= 10 });
    }, 1000);
  },
  clearTimer() { if (this.timer) { clearInterval(this.timer); this.timer = null; } },
  onUnload() { this.clearTimer(); },
  answer2(i) {
    if (this.data.answered) return;
    const q = this.data.q;
    let ok = false;
    if (q.type === 'single') {
      const letter = 'ABCD'[i];
      if (i >= 0) ok = letter === q.answer;
      const options = this.data.options.map((o, idx) => {
        if ('ABCD'[idx] === q.answer) return Object.assign({}, o, { cls: 'correct' });
        if (idx === i) return Object.assign({}, o, { cls: 'wrong' });
        return Object.assign({}, o, { cls: 'locked' });
      });
      this.setData({ options });
    } else if (q.type === 'judge') {
      ok = i >= 0 && String(i).toUpperCase() === String(q.answer).toUpperCase();
    }
    this.clearTimer();
    const fb = ok ? '✅ 正确\n' + (q.explanation || '') : '❌ 正确答案：' + (q.answer || '') + '\n' + (q.explanation || '');
    app.record(q.category, ok);
    const score = this.data.score + (ok ? 1 : 0);
    const streak = ok ? this.data.streak + 1 : 0;
    this.setData({ answered: true, feedback: fb, fbClass: ok ? 'ok' : 'no', score, streak, best: Math.max(this.data.best, streak) });
  },
  tapOpt(e) { if (!this.data.answered) this.answer2(Number(e.currentTarget.dataset.i)); },
  tapJudge(e) { if (!this.data.answered) this.answer2(e.currentTarget.dataset.v); },
  onShortInput(e) { this.setData({ shortValue: e.detail.value }); },
  grade(e) {
    const v = Number(e.currentTarget.dataset.v);
    if (this.data.answered) return;
    this.setData({ gradeSel: v });
    const q = this.data.q;
    const ok = v >= 4;
    const fb = '[参考答案] ' + (q.answer || '') + '\n[讲解] ' + (q.explanation || '');
    app.record(q.category, ok);
    this.clearTimer();
    const score = this.data.score + (ok ? 1 : 0);
    const streak = ok ? this.data.streak + 1 : 0;
    this.setData({ answered: true, feedback: fb, fbClass: ok ? 'ok' : 'no', score, streak, best: Math.max(this.data.best, streak) });
  },
  next() {
    if (this.data.idx + 1 >= this.data.total) {
      const m = app.getMeta();
      m.best = Math.max(m.best || 0, this.data.score);
      app.saveMeta(m);
      wx.redirectTo({ url: '/pages/result/result?score=' + this.data.score + '&total=' + this.data.total + '&streak=' + this.data.best });
      return;
    }
    this.setData({ idx: this.data.idx + 1 });
    this.showQ();
  },
  quit() { this.clearTimer(); wx.navigateBack(); }
});

