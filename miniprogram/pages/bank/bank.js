const app = getApp();
Page({
  data: { keyword: '', selectedCat: '全部', groups: [], catAll: [] },
  onLoad() {
    const QS = app.globalData.questions;
    const cats = [...new Set(QS.map(q => q.category))];
    this.QS = QS;
    this.setData({ catAll: [{ name: '全部', count: QS.length }]
      .concat(cats.map(c => ({ name: c, count: QS.filter(q => q.category === c).length }))) });
    this.render();
  },
  onInput(e) { this.setData({ keyword: e.detail.value }); this.render(); },
  selectCat(e) { this.setData({ selectedCat: e.currentTarget.dataset.c }); this.render(); },
  render() {
    const kw = this.data.keyword.trim().toLowerCase();
    const groups = {};
    this.QS.forEach(q => {
      if (this.data.selectedCat !== '全部' && q.category !== this.data.selectedCat) return;
      if (kw) { const hay = (q.question + ' ' + (q.explanation || '')).toLowerCase(); if (hay.indexOf(kw) < 0) return; }
      (groups[q.category] = groups[q.category] || []).push(q);
    });
    const arr = Object.keys(groups).map(c => ({
      name: c, count: groups[c].length,
      items: groups[c].map((q, i) => ({ id: c + '_' + i, question: q.question, open: false,
        options: q.options || [], answer: q.answer || '', explanation: q.explanation || '' }))
    }));
    this.setData({ groups: arr, empty: arr.length === 0 });
  },
  toggle(e) {
    const id = e.currentTarget.dataset.id;
    const groups = this.data.groups.map(g => {
      g.items = g.items.map(it => it.id === id ? Object.assign({}, it, { open: !it.open }) : it);
      return g;
    });
    this.setData({ groups });
  }
});
