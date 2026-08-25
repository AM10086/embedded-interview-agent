Page({
  data: { score: 0, total: 0, pct: 0, streak: 0 },
  onLoad(options) {
    const score = Number(options.score || 0);
    const total = Number(options.total || 0);
    const streak = Number(options.streak || 0);
    this.setData({ score, total, pct: Math.round(score / total * 100), streak });
  },
  again() { wx.navigateTo({ url: '/pages/quiz/quiz?mode=practice&cat=' + encodeURIComponent('全部') }); },
  goWeak() { wx.redirectTo({ url: '/pages/weak/weak' }); },
  goHome() { wx.reLaunch({ url: '/pages/index/index' }); }
});

