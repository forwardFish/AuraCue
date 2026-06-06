const shortcuts = [
  { id: "date", label: "Date", icon: "heart" },
  { id: "work", label: "Work", icon: "briefcase" },
  { id: "party", label: "Party", icon: "map" },
  { id: "luck", label: "Just need luck", icon: "sparkle" }
];

Page({
  data: {
    shortcuts,
    selectedScene: null,
    analyticsEvents: []
  },
  onLoad() {
    this.track("page_view_home", { uiId: "UI-01", requirementId: "REQ-004" });
  },
  track(eventName, properties) {
    const analyticsEvents = this.data.analyticsEvents.concat({
      eventName,
      page: "/",
      properties,
      accepted: true
    });
    this.setData({ analyticsEvents });
  },
  onShortcutTap(event) {
    const scene = event.currentTarget.dataset.scene;
    this.setData({ selectedScene: scene });
    this.track("click_generate_start", {
      uiId: "UI-01",
      controlId: `scene-${scene}`,
      scene,
      requirementId: "REQ-004"
    });
    wx.navigateTo({ url: "/pages/create/scene/index" });
  },
  onStartTap() {
    this.track("click_generate_start", {
      uiId: "UI-01",
      controlId: "start-card",
      requirementId: "REQ-004"
    });
    wx.navigateTo({ url: "/pages/create/scene/index" });
  }
});
