Page({
  data: {
    cardId: "",
    freeFields: {
      auraName: "Soft Glow Aura",
      luckyColor: "Champagne Gold",
      oneLineReminder: "Step into tonight with calm confidence."
    },
    lockedRows: [
      { id: "outfit", title: "Outfit Energy", teaser: "Best styles and fabrics for today" },
      { id: "beauty", title: "Beauty Cue", teaser: "Hair, makeup and scent aligned for you" },
      { id: "social", title: "Social Move", teaser: "How to show up and connect" },
      { id: "ritual", title: "Tiny Ritual", teaser: "A 1-minute practice to shift your energy" },
      { id: "avoid", title: "Avoid Today", teaser: "What to avoid for smooth flow" }
    ],
    analyticsEvents: [],
    apiTrace: []
  },
  onLoad(options) {
    const cardId = options.id || "card-locked-001";
    this.setData({ cardId });
    this.loadFreePreview(cardId);
  },
  track(eventName, properties) {
    this.setData({
      analyticsEvents: this.data.analyticsEvents.concat({
        eventName,
        page: "/result/:id",
        properties,
        accepted: true
      })
    });
  },
  loadFreePreview(cardId) {
    this.setData({
      apiTrace: this.data.apiTrace.concat({
        apiId: "API-003",
        method: "GET",
        path: `/api/cards/${cardId}`,
        query: { view: "free" },
        lockedFullContentExposed: false
      })
    });
    this.track("view_result_free", {
      uiId: "UI-06",
      apiId: "API-003",
      cardId,
      view: "free",
      requirementId: "REQ-009"
    });
  },
  onUnlockTap() {
    this.track("click_unlock", {
      uiId: "UI-06",
      cardId: this.data.cardId,
      requirementId: "REQ-009"
    });
    wx.navigateTo({ url: `/pages/unlock/index?id=${this.data.cardId}` });
  },
  onInviteTap() {
    this.track("click_invite_unlock_entry", {
      uiId: "UI-06",
      cardId: this.data.cardId,
      requirementId: "REQ-009"
    });
    wx.navigateTo({ url: `/pages/invite/start?id=${this.data.cardId}` });
  },
  onShareTap() {
    this.track("click_preview_share_locked", {
      uiId: "UI-06",
      cardId: this.data.cardId,
      locked: true
    });
  },
  onBackTap() {
    wx.navigateBack({ delta: 1 });
  }
});
