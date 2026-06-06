const sceneOptions = [
  { id: "date", label: "Date", icon: "heart", description: "Romantic, magnetic & heart-open." },
  { id: "work", label: "Work / Meeting", icon: "briefcase", description: "Confident, focused & respected." },
  { id: "party", label: "Party / Social", icon: "party", description: "Radiant, fun & unforgettable." },
  { id: "luck", label: "Just need luck", icon: "clover", description: "Lucky, aligned & open to magic." }
];

Page({
  data: {
    sceneOptions,
    selectedScene: null,
    canContinue: false,
    analyticsEvents: []
  },
  onLoad(options) {
    const selectedScene = options.scene || "date";
    this.setData({ selectedScene, canContinue: Boolean(selectedScene) });
    this.track("page_view_scene_selection", { uiId: "UI-02", requirementId: "REQ-006" });
  },
  track(eventName, properties) {
    const analyticsEvents = this.data.analyticsEvents.concat({
      eventName,
      page: "/create/scene",
      properties,
      accepted: true
    });
    this.setData({ analyticsEvents });
  },
  onSceneTap(event) {
    const scene = event.currentTarget.dataset.scene;
    this.setData({ selectedScene: scene, canContinue: true });
    this.track("select_scene", {
      uiId: "UI-02",
      controlId: `scene-${scene}`,
      scene,
      requirementId: "REQ-006"
    });
  },
  onContinueTap() {
    if (!this.data.selectedScene) {
      this.track("blocked_continue_scene", {
        uiId: "UI-02",
        controlId: "continue-scene",
        reason: "missing-scene",
        requirementId: "REQ-006"
      });
      return;
    }
    this.track("click_scene_continue", {
      uiId: "UI-02",
      controlId: "continue-scene",
      scene: this.data.selectedScene,
      requirementId: "REQ-006"
    });
    wx.navigateTo({ url: `/pages/create/energy?scene=${this.data.selectedScene}` });
  },
  onBackTap() {
    wx.navigateBack({ delta: 1 });
  }
});
