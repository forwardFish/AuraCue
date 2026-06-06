Page({
  data: {
    inviteCode: "",
    apiTrace: [],
    analyticsEvents: []
  },
  onLoad(options) {
    const inviteCode = options.code || "INVITE-LOCAL-001";
    this.setData({ inviteCode });
    this.setData({ apiTrace: this.data.apiTrace.concat({ apiId: "API-006", method: "POST", path: "/api/invites/card-locked-001/events", body: { action: "friend_accept", inviteCode, friendId: "friend-local-landing", source: "UI-10" } }) });
    this.track("page_view_invite_landing", { uiId: "UI-10", inviteCode, noLoginRequired: true });
  },
  track(eventName, properties) {
    this.setData({ analyticsEvents: this.data.analyticsEvents.concat({ eventName, page: "/invite/landing/:code", properties, accepted: true }) });
  },
  onGenerateTap() {
    this.track("click_friend_generate_card", { uiId: "UI-10", inviteCode: this.data.inviteCode, noLoginRequired: true });
    wx.navigateTo({ url: "/pages/create/scene" });
  }
});
