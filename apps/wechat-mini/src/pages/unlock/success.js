Page({
  data: {
    cardId: "",
    orderId: "",
    analyticsEvents: []
  },
  onLoad(options) {
    const cardId = options.id || "card-locked-001";
    const orderId = options.orderId || "order-paid-001";
    this.setData({ cardId, orderId });
    this.track("page_view_mock_payment_success", { uiId: "UI-13", cardId, orderId, requirementId: "REQ-012" });
  },
  track(eventName, properties) {
    this.setData({ analyticsEvents: this.data.analyticsEvents.concat({ eventName, page: "/unlock/:id/success", properties, accepted: true }) });
  },
  onViewFullTap() {
    this.track("click_view_full_card_after_payment", { uiId: "UI-13", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/result/full?id=${this.data.cardId}` });
  },
  onShareTap() {
    this.track("click_share_story_after_payment", { uiId: "UI-13", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/share/story?id=${this.data.cardId}` });
  }
});
