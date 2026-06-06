Page({
  data: {
    cardId: "",
    features: [
      { id: "full-reading", title: "Full Aura Reading", teaser: "Deep insights for your energy today" },
      { id: "outfit", title: "Outfit Energy", teaser: "Best colors, style and vibe for you" },
      { id: "beauty", title: "Beauty Cue", teaser: "Glow tips aligned with your aura" },
      { id: "social", title: "Social Move", teaser: "What to say and how to connect" },
      { id: "ritual", title: "Tiny Ritual", teaser: "Simple practice to stay aligned" },
      { id: "avoid", title: "Avoid Today", teaser: "What to avoid for smooth energy" },
      { id: "share-card", title: "HD Share Card", teaser: "Beautiful card to share and inspire" }
    ],
    analyticsEvents: []
  },
  onLoad(options) {
    const cardId = options.id || "card-locked-001";
    this.setData({ cardId });
    this.track("page_view_unlock_choice", { uiId: "UI-07", cardId, requirementId: "REQ-010" });
  },
  track(eventName, properties) {
    this.setData({ analyticsEvents: this.data.analyticsEvents.concat({ eventName, page: "/unlock/:id", properties, accepted: true }) });
  },
  onPaidUnlockTap() {
    this.track("click_paid_unlock_entry", { uiId: "UI-07", cardId: this.data.cardId, apiId: "API-010", requirementId: "REQ-012" });
    wx.navigateTo({ url: `/pages/unlock/pay?id=${this.data.cardId}` });
  },
  onInviteTap() {
    this.track("click_invite_instead", { uiId: "UI-07", cardId: this.data.cardId, apiId: "API-010", requirementId: "REQ-012" });
    wx.navigateTo({ url: `/pages/invite/start?id=${this.data.cardId}` });
  },
  onCloseTap() {
    wx.navigateTo({ url: `/pages/result/free-preview?id=${this.data.cardId}` });
  }
});
