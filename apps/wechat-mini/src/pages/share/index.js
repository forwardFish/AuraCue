Page({
  data: {
    cardId: "card-local-001"
  },
  onLoad(query) {
    this.setData({ cardId: query.id || "card-local-001" });
  },
  saveImage() {},
  copyLink() {},
  cancel() {
    wx.navigateBack();
  }
});
