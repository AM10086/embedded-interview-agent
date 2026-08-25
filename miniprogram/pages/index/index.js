const app = getApp();
Page({
  data: {
    total: 0, cats: 0, best: 0, done: 0,
    catAll: [], selectedCat: '全部'
  },
  onLoad() {
    const QS = app.globalData.questions;
    const cats = [...new Set(QS.map(q => q.category))];
    const s = app.getStats(), m = app.getMeta();
    let done = 0; for (const c in s) done += s[c].total;
    const catAll = [{ name: '全部', count: QS.length }]
      .concat(cats.map(c => ({ name: c, count: QS.filter(q => q.category === c).length })));
    this.setData({ total: QS.length, cats: cats.length, best: m.best || 0, done, catAll });
  },
  selectCat(e) { this.setData({ selectedCat: e.currentTarget.dataset.c }); },
  goPractice() { this.startQuiz('practice'); },
  goMock() { this.startQuiz('mock'); },
  startQuiz(mode) {
    wx.navigateTo({ url: '/pages/quiz/quiz?mode=' + mode + '&cat=' + encodeURIComponent(this.data.selectedCat) });
  },
  goBank() { wx.navigateTo({ url: '/pages/bank/bank' }); },
  goWeak() { wx.navigateTo({ url: '/pages/weak/weak' }); }
});
