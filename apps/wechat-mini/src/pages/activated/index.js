Page({
  data: {
    cardId: "card-local-001"
  },
  onLoad(query) {
    this.setData({ cardId: query.id || "card-local-001" });
  },
  done() {
    wx.navigateTo({ url: `/pages/saved/index?id=${this.data.cardId}` });
  },
  saveCard() {
    wx.navigateTo({ url: `/pages/saved/index?id=${this.data.cardId}` });
  },
  shareStory() {
    wx.navigateTo({ url: `/pages/share/index?id=${this.data.cardId}` });
  }
});
