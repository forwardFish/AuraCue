Page({
  data: {
    cardId: "",
    title: "Full Lucky Aura Card",
    auraName: "Golden Comet Aura",
    tarotSymbol: "The Star",
    tarotKeywords: "Authority - Structure - Leadership",
    message: "Your best signal today is warm certainty.",
    caption: "Tonight I am choosing the brighter signal.",
    theme: "golden-night",
    guidanceRows: [
      { id: "colors", label: "Lucky Colors", title: "Navy, Rose, Gold", detail: "Wear one grounded tone with a warm luminous accent." },
      { id: "outfit", label: "Outfit Energy", title: "Tailored & Confident", detail: "A clean light layer with one luminous accessory." },
      { id: "beauty", label: "Beauty Cue", title: "Defined & Polished", detail: "Soft highlight and a confident lip tint." },
      { id: "social", label: "Social Move", title: "Lead with Clarity", detail: "Open with a sincere compliment." },
      { id: "ritual", label: "Tiny Ritual", title: "3 Deep Anchor Breaths", detail: "Take three slow breaths before entering the room." },
      { id: "avoid", label: "Avoid Today", title: "Keep It Gentle", detail: "Do not rush into a promise before you feel ready." }
    ],
    analyticsEvents: [],
    saveResponse: null,
    shareResponse: null,
    trendToast: ""
  },
  onLoad(options) {
    const cardId = options.id || "card-unlocked-001";
    this.setData({ cardId });
    this.track("page_view_full_result", { uiId: "UI-14", apiId: "API-003", cardId, view: "full", requirementId: "REQ-008,REQ-010" });
  },
  track(eventName, properties) {
    this.setData({ analyticsEvents: this.data.analyticsEvents.concat({ eventName, page: "/result/:id/full", properties, accepted: true }) });
  },
  onSaveTap() {
    const savedAt = "2026-05-26T00:15:00.000Z";
    this.setData({ saveResponse: { saved: true, cardId: this.data.cardId, savedAt } });
    this.track("save_card", { uiId: "UI-14", apiId: "API-007", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/saved/success?id=${this.data.cardId}` });
  },
  onShareStoryTap() {
    this.setData({ shareResponse: { shareEventId: "share-ui14-story", cardId: this.data.cardId, channel: "story", source: "full_result" } });
    this.track("share_card", { uiId: "UI-14", apiId: "API-008", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/share/story?id=${this.data.cardId}` });
  },
  onMoreShareTap() {
    this.setData({ shareResponse: { shareEventId: "share-ui14-chooser", cardId: this.data.cardId, channel: "chooser_opened", source: "full_result" } });
    this.track("click_more_sharing_options", { uiId: "UI-14", apiId: "API-008", cardId: this.data.cardId });
    wx.navigateTo({ url: `/pages/share/channels?id=${this.data.cardId}` });
  },
  onTrendTap() {
    const trendToast = "7-Day Trend is coming in a later AuraCue release.";
    this.setData({ trendToast });
    this.track("click_view_7_day_trend_disabled", { uiId: "UI-14", cardId: this.data.cardId, p1Deferred: true });
    if (typeof wx !== "undefined" && wx.showToast) {
      wx.showToast({ title: trendToast, icon: "none" });
    }
  }
});
