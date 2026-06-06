Page({
  data: {
    cardId: "",
    analyticsEvents: []
  },
  onLoad(options) {
    const cardId = options.id || "card-unlocked-001";
    this.setData({ cardId });
    this.track("page_view_save_success", { uiId: "UI-17", apiId: "API-007", cardId, requirementId: "REQ-011" });
  },
  track(eventName, properties) {
    this.setData({ analyticsEvents: this.data.analyticsEvents.concat({ eventName, page: "/saved/:id", properties, accepted: true }) });
  },
  onShareNowTap() {
    this.track("share_card", { uiId: "UI-17", apiId: "API-008", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/share/story?id=${this.data.cardId}` });
  },
  onBackHomeTap() {
    this.track("return_next_day", { uiId: "UI-17", cardId: this.data.cardId });
    wx.reLaunch({ url: "/pages/home/index" });
  },
  onViewSavedCardTap() {
    this.track("click_view_saved_card", { uiId: "UI-17", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/result/full?id=${this.data.cardId}` });
  }
});
