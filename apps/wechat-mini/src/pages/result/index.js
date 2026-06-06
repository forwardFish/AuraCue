Page({
  data: {
    cardId: "card-local-001",
    auraName: "Quiet Power Bloom"
  },
  onLoad(query) {
    this.setData({ cardId: query.id || "card-local-001" });
  },
  activateAura() {
    wx.navigateTo({ url: `/pages/activate/index?id=${this.data.cardId}` });
  },
  saveCard() {
    wx.navigateTo({ url: `/pages/saved/index?id=${this.data.cardId}` });
  },
  shareStory() {
    wx.navigateTo({ url: `/pages/share/index?id=${this.data.cardId}` });
  }
});
