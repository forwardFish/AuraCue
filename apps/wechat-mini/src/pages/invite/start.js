Page({
  data: {
    cardId: "",
    progress: 1,
    required: 3,
    rewardRows: ["Unlock full reading", "Outfit & color guide", "Social action plan", "Lucky ritual", "High-quality share card"],
    apiTrace: [],
    analyticsEvents: []
  },
  onLoad(options) {
    const cardId = options.id || "card-locked-001";
    this.setData({ cardId });
    this.recordInvite("invite_started", "UI-08");
    this.track("invite_started", { uiId: "UI-08", cardId, apiId: "API-010" });
  },
  track(eventName, properties) {
    this.setData({ analyticsEvents: this.data.analyticsEvents.concat({ eventName, page: "/invite/:id", properties, accepted: true }) });
  },
  recordInvite(action, source) {
    this.setData({
      apiTrace: this.data.apiTrace.concat({ apiId: "API-006", method: "POST", path: `/api/invites/${this.data.cardId}/events`, body: { action, inviteCode: "INVITE-LOCAL-001", source } })
    });
  },
  onInviteFriendsTap() {
    this.recordInvite("invite_button_tap", "UI-08");
    this.setData({ apiTrace: this.data.apiTrace.concat({ apiId: "API-008", method: "POST", path: "/api/share-events", body: { cardId: this.data.cardId, channel: "wechat_mock_share", source: "UI-08" } }) });
    this.track("click_invite_friends", { uiId: "UI-08", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/invite/progress?id=${this.data.cardId}` });
  },
  onPaidUnlockTap() {
    this.track("click_invite_paid_unlock", { uiId: "UI-08", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/unlock/pay?id=${this.data.cardId}` });
  },
  onBackTap() {
    wx.navigateTo({ url: `/pages/unlock/index?id=${this.data.cardId}` });
  }
});
