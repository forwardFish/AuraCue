Page({
  data: {
    uploaded: false
  },
  uploadOutfit() {
    this.setData({ uploaded: true });
  },
  continueFlow() {
    wx.navigateTo({ url: "/pages/create/draw" });
  },
  skipUpload() {
    wx.navigateTo({ url: "/pages/create/draw" });
  }
});
