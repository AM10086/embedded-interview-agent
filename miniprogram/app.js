// app.js
const QUESTIONS = require('./data/questions.js');

App({
  globalData: {
    questions: QUESTIONS
  },

  // 答题统计读写（本地存储）
  getStats: function () {
    return wx.getStorageSync('agent_stats') || {};
  },
  saveStats: function (s) {
    wx.setStorageSync('agent_stats', s);
  },
  getMeta: function () {
    return wx.getStorageSync('agent_meta') || {};
  },
  saveMeta: function (m) {
    wx.setStorageSync('agent_meta', m);
  },
  record: function (cat, ok) {
    var s = this.getStats();
    s[cat] = s[cat] || { correct: 0, total: 0 };
    s[cat].total++;
    if (ok) s[cat].correct++;
    this.saveStats(s);
  }
});
