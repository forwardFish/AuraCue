Page({
  data: {
    cardId: "card-local-001"
  },
  onLoad(query) {
    this.setData({ cardId: query.id || "card-local-001" });
  },
  shareNow() {
    wx.navigateTo({ url: `/pages/share/index?id=${this.data.cardId}` });
  },
  backHome() {
    wx.reLaunch({ url: "/pages/index/index" });
  }
});
