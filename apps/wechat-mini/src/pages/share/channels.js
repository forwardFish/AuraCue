Page({
  data: {
    cardId: "",
    analyticsEvents: [],
    channels: [
      { id: "wechat", label: "WeChat", color: "#07c160", initial: "W" },
      { id: "moments", label: "Moments", color: "#18b77a", initial: "M" },
      { id: "xiaohongshu", label: "Xiaohongshu", color: "#ff2442", initial: "X" },
      { id: "instagram-story", label: "Instagram Story", color: "#d84bb5", initial: "I" },
      { id: "save-image", label: "Save Image", color: "#64748b", initial: "S" },
      { id: "copy-link", label: "Copy Link", color: "#8b5cf6", initial: "C" }
    ]
  },
  onLoad(options) {
    const cardId = options.id || "card-unlocked-001";
    this.setData({ cardId });
    this.track("page_view_share_channels", { uiId: "UI-16", apiId: "API-008", cardId, requirementId: "REQ-014" });
  },
  track(eventName, properties) {
    this.setData({ analyticsEvents: this.data.analyticsEvents.concat({ eventName, page: "/share/:id/channels", properties, accepted: true }) });
  },
  onChannelTap(event) {
    const channelId = event.currentTarget.dataset.channel;
    this.track("share_card", { uiId: "UI-16", apiId: "API-008", cardId: this.data.cardId, channel: channelId, mockedExternalAction: true });
    wx.showToast({ title: "Shared locally", icon: "none" });
  },
  onCancelTap() {
    this.track("click_cancel_share_channels", { uiId: "UI-16", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/share/story?id=${this.data.cardId}` });
  }
});
