Page({
  data: {
    cardId: "card-local-001",
    selectedAnchor: "",
    sealing: false,
    sealProgress: 0
  },
  onLoad(query) {
    this.setData({ cardId: query.id || "card-local-001" });
  },
  selectAnchor(event) {
    this.setData({ selectedAnchor: event.currentTarget.dataset.anchor });
  },
  sealAura() {
    if (!this.data.selectedAnchor) {
      wx.showToast({ title: "Choose an anchor first", icon: "none" });
      return;
    }
    this.setData({ sealing: true });
    wx.navigateTo({ url: `/pages/activated/index?id=${this.data.cardId}` });
  },
  cancelSeal() {
    this.setData({ sealing: false, sealProgress: 0 });
  }
});
