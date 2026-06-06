Page({
  data: {
    selectedCard: "II",
    generating: false
  },
  selectCard(event) {
    this.setData({ selectedCard: event.currentTarget.dataset.card });
  },
  revealAura() {
    this.setData({ generating: true });
    wx.navigateTo({ url: "/pages/result/index?id=card-local-001" });
  }
});
