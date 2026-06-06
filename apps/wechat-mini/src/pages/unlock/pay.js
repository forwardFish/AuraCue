Page({
  data: {
    cardId: "",
    price: "$1.99",
    valueRows: [
      "Full reading & insights",
      "Outfit energy details",
      "Social action plan",
      "Lucky ritual",
      "Save & share high-quality card"
    ],
    order: null,
    analyticsEvents: []
  },
  onLoad(options) {
    const cardId = options.id || "card-locked-001";
    this.setData({ cardId });
    this.track("page_view_mock_payment_confirm", { uiId: "UI-11", cardId, requirementId: "REQ-012" });
  },
  track(eventName, properties) {
    this.setData({ analyticsEvents: this.data.analyticsEvents.concat({ eventName, page: "/unlock/:id/pay", properties, accepted: true }) });
  },
  createMockOrder() {
    const order = {
      orderId: "order-t14-local-001",
      cardId: this.data.cardId,
      amount: 1.99,
      currency: "USD",
      status: "pending",
      localMock: true
    };
    this.setData({ order });
    return order;
  },
  onConfirmTap() {
    const order = this.createMockOrder();
    this.track("checkout_started", { uiId: "UI-11", cardId: this.data.cardId, orderId: order.orderId, apiId: "API-005" });
    this.track("checkout_success", { uiId: "UI-13", cardId: this.data.cardId, orderId: order.orderId, result: "success", apiId: "API-005" });
    wx.navigateTo({ url: `/pages/unlock/success?id=${this.data.cardId}&orderId=${order.orderId}` });
  },
  onInviteTap() {
    this.track("click_payment_invite_instead", { uiId: "UI-11", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/invite/start?id=${this.data.cardId}` });
  },
  onCloseTap() {
    wx.navigateTo({ url: `/pages/unlock/index?id=${this.data.cardId}` });
  }
});
