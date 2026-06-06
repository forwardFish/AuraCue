const sceneOptions = [
  { id: "date", label: "Date", shortLabel: "Date", icon: "heart" },
  { id: "work", label: "Work / Meeting", shortLabel: "Work", icon: "briefcase" },
  { id: "party", label: "Party / Social", shortLabel: "Party", icon: "party" },
  { id: "luck", label: "Just need luck", shortLabel: "Just me", subLabel: "Just need luck", icon: "person" }
];

const energyOptions = [
  { id: "confidence", label: "Confidence", icon: "spark", description: "Stand tall. Believe in you." },
  { id: "luck", label: "Luck", icon: "clover", description: "Open doors. Attract opportunity." },
  { id: "love", label: "Love", icon: "heart", description: "Open your heart. Invite meaningful love." },
  { id: "calm", label: "Calm", icon: "moon", description: "Find peace. Let go of what weighs you down." },
  { id: "charm", label: "Charm", icon: "star", description: "Magnetic energy. Naturally draw people in." },
  { id: "focus", label: "Focus", icon: "eye", description: "Clear your mind. Stay aligned and on track." }
];

function validationMessage(scene, energy) {
  if (scene && energy) {
    return "";
  }
  if (!scene && !energy) {
    return "Choose one scene and one energy to continue.";
  }
  if (!scene) {
    return "Choose one scene to continue.";
  }
  return "Choose one energy to continue.";
}

Page({
  data: {
    sceneOptions,
    energyOptions,
    selectedScene: null,
    selectedEnergy: null,
    feeling: "",
    canGenerate: false,
    validationMessage: "Choose one energy to continue.",
    localGenerationJobs: [],
    analyticsEvents: []
  },
  onLoad(options) {
    const selectedScene = options.scene || null;
    this.setData({
      selectedScene,
      canGenerate: Boolean(selectedScene && this.data.selectedEnergy),
      validationMessage: validationMessage(selectedScene, this.data.selectedEnergy)
    });
    this.track("page_view_energy_selection", { uiId: "UI-03", requirementId: "REQ-007" });
  },
  track(eventName, properties) {
    const analyticsEvents = this.data.analyticsEvents.concat({
      eventName,
      page: "/create/energy",
      properties,
      accepted: true
    });
    this.setData({ analyticsEvents });
  },
  syncCompletion() {
    const canGenerate = Boolean(this.data.selectedScene && this.data.selectedEnergy);
    this.setData({
      canGenerate,
      validationMessage: validationMessage(this.data.selectedScene, this.data.selectedEnergy)
    });
  },
  onSceneTap(event) {
    const scene = event.currentTarget.dataset.scene;
    this.setData({ selectedScene: scene });
    this.track("select_scene", {
      uiId: "UI-04",
      controlId: `scene-${scene}`,
      scene,
      requirementId: "REQ-006"
    });
    this.syncCompletion();
  },
  onEnergyTap(event) {
    const energy = event.currentTarget.dataset.energy;
    this.setData({ selectedEnergy: energy });
    this.track("select_energy", {
      uiId: "UI-03",
      controlId: `energy-${energy}`,
      energy,
      requirementId: "REQ-007"
    });
    this.syncCompletion();
  },
  onFeelingInput(event) {
    this.setData({ feeling: event.detail.value });
  },
  onGenerateTap() {
    if (!this.data.canGenerate) {
      this.track("blocked_generate_incomplete_selection", {
        uiId: "UI-04",
        controlId: "generate-card",
        reason: this.data.validationMessage,
        requirementId: "REQ-006,REQ-007"
      });
      return;
    }
    const job = {
      jobId: "job-t10-local-001",
      status: "success",
      cardId: "card-t10-local-001",
      scene: this.data.selectedScene,
      energy: this.data.selectedEnergy,
      source: "UI-03"
    };
    this.setData({ localGenerationJobs: this.data.localGenerationJobs.concat(job) });
    this.track("click_generate_card", {
      uiId: "UI-03",
      controlId: "generate-card",
      scene: this.data.selectedScene,
      energy: this.data.selectedEnergy,
      jobId: job.jobId,
      requirementId: "REQ-006,REQ-007"
    });
    wx.navigateTo({ url: `/pages/create/loading?jobId=${job.jobId}` });
  },
  onBackTap() {
    wx.navigateBack({ delta: 1 });
  }
});
