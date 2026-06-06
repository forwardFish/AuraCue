Page({
  data: {
    cardId: "",
    analyticsEvents: [],
    shareImagePath: "local://share-images/card-unlocked-001-template-story-001.png",
    shareImageDataUrl: "",
    shareImageKey: "card-unlocked-001|template-story-001|story-9x16"
  },
  onLoad(options) {
    const cardId = options.id || "card-unlocked-001";
    this.setData({
      cardId,
      shareImagePath: `local://share-images/${cardId}-template-story-001.png`,
      shareImageKey: `${cardId}|template-story-001|story-9x16`
    });
    this.track("page_view_share_story", { uiId: "UI-15", apiId: "API-009", cardId, requirementId: "REQ-014" });
  },
  track(eventName, properties) {
    this.setData({ analyticsEvents: this.data.analyticsEvents.concat({ eventName, page: "/share/:id", properties, accepted: true }) });
  },
  onCloseTap() {
    this.track("click_close_share_preview", { uiId: "UI-15", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/result/full?id=${this.data.cardId}` });
  },
  onSaveTap() {
    this.track("save_card", { uiId: "UI-15", apiId: "API-007", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/saved/success?id=${this.data.cardId}` });
  },
  onShareTap() {
    this.track("share_card", { uiId: "UI-15", apiId: "API-008", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/share/channels?id=${this.data.cardId}` });
  },
  onCopyTap() {
    this.track("copy_share_link", { uiId: "UI-15", apiId: "API-008", cardId: this.data.cardId, mockedExternalAction: true });
    wx.showToast({ title: "Link copied", icon: "none" });
  }
});
