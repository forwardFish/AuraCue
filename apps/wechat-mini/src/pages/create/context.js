Page({
  data: {
    selectedContext: "work",
    contexts: ["Date", "Work", "Party", "Interview", "Travel", "Just for luck"]
  },
  selectContext(event) {
    this.setData({ selectedContext: event.currentTarget.dataset.context });
  },
  continueFlow() {
    wx.navigateTo({ url: "/pages/create/upload" });
  },
  skipContext() {
    wx.navigateTo({ url: "/pages/create/upload" });
  }
});
