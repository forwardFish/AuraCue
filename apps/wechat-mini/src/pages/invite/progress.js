Page({
  data: {
    cardId: "",
    inviteCode: "INVITE-LOCAL-001",
    progress: 2,
    required: 3,
    friends: [
      { id: "friend-lina", name: "Lina", status: "Joined" },
      { id: "friend-jason", name: "Jason", status: "Joined" },
      { id: "friend-pending", name: "Waiting for a friend", status: "Pending" }
    ],
    modalVisible: false,
    apiTrace: [],
    analyticsEvents: []
  },
  onLoad(options) {
    const cardId = options.id || "card-locked-001";
    this.setData({ cardId });
    this.track("page_view_invite_progress", { uiId: "UI-09", cardId });
  },
  track(eventName, properties) {
    this.setData({ analyticsEvents: this.data.analyticsEvents.concat({ eventName, page: "/invite/:id/progress", properties, accepted: true }) });
  },
  onCopyTap() {
    this.setData({ apiTrace: this.data.apiTrace.concat({ apiId: "API-008", method: "POST", path: "/api/share-events", body: { cardId: this.data.cardId, channel: "copy_link", source: "UI-09" } }) });
    this.track("copy_share_link", { uiId: "UI-09", cardId: this.data.cardId, inviteCode: this.data.inviteCode });
  },
  onInviteAgainTap() {
    this.setData({ apiTrace: this.data.apiTrace.concat({ apiId: "API-006", method: "POST", path: `/api/invites/${this.data.cardId}/events`, body: { action: "invite_again", inviteCode: this.data.inviteCode, source: "UI-09" } }) });
    this.track("click_invite_again", { uiId: "UI-09", cardId: this.data.cardId });
  },
  onHowItWorksTap() {
    this.setData({ modalVisible: true });
    this.track("click_invite_how_it_works", { uiId: "UI-09", cardId: this.data.cardId, modal: "invite-explainer" });
  }
});
