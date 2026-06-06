Page({
  data: {
    cardId: "",
    orderId: "",
    analyticsEvents: [],
    supportToast: ""
  },
  onLoad(options) {
    const cardId = options.id || "card-locked-001";
    const orderId = options.orderId || "order-failed-001";
    this.setData({ cardId, orderId });
    this.track("page_view_mock_payment_failed", { uiId: "UI-12", cardId, orderId, requirementId: "REQ-012" });
  },
  track(eventName, properties) {
    this.setData({ analyticsEvents: this.data.analyticsEvents.concat({ eventName, page: "/unlock/:id/pay-failed", properties, accepted: true }) });
  },
  onTryAgainTap() {
    this.track("checkout_started", { uiId: "UI-12", cardId: this.data.cardId, retry: true, apiId: "API-005" });
    this.track("checkout_success", { uiId: "UI-13", cardId: this.data.cardId, result: "success", apiId: "API-005" });
    wx.navigateTo({ url: `/pages/unlock/success?id=${this.data.cardId}&orderId=order-t14-retry-001` });
  },
  onRestoreTap() {
    this.track("click_restore_purchase", { uiId: "UI-12", cardId: this.data.cardId, apiId: "API-004", method: "restore" });
    wx.navigateTo({ url: `/pages/unlock/success?id=${this.data.cardId}&orderId=restore-local` });
  },
  onInviteTap() {
    this.track("click_payment_invite_instead", { uiId: "UI-12", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/invite/start?id=${this.data.cardId}` });
  },
  onSupportTap() {
    this.track("click_payment_contact_support", { uiId: "UI-12", cardId: this.data.cardId, localOnly: true });
    this.setData({ supportToast: "Local support placeholder" });
  },
  onBackTap() {
    wx.navigateTo({ url: `/pages/unlock/pay?id=${this.data.cardId}` });
  }
});
