Page({
  data: {
    jobId: "job-failed-001",
    retryJobs: [],
    analyticsEvents: []
  },
  onLoad(options) {
    const jobId = options.jobId || "job-failed-001";
    this.setData({ jobId });
    this.track("page_view_generation_error", {
      uiId: "UI-18",
      jobId,
      requirementId: "REQ-013"
    });
  },
  track(eventName, properties) {
    this.setData({
      analyticsEvents: this.data.analyticsEvents.concat({
        eventName,
        page: "/error/network",
        properties,
        accepted: true
      })
    });
  },
  onTryAgainTap() {
    const retryJob = {
      jobId: "job-t11-retry-001",
      status: "pending",
      scene: "date",
      energy: "confidence",
      source: "UI-18-retry",
      apiId: "API-001"
    };
    this.setData({ retryJobs: this.data.retryJobs.concat(retryJob) });
    this.track("click_generation_retry", {
      uiId: "UI-18",
      controlId: "try-again",
      jobId: retryJob.jobId,
      requirementId: "REQ-013"
    });
    wx.redirectTo({ url: `/pages/create/loading?jobId=${retryJob.jobId}` });
  },
  onChangeSceneTap() {
    this.track("click_generation_change_scene", {
      uiId: "UI-18",
      controlId: "change-context",
      requirementId: "REQ-013"
    });
    wx.redirectTo({ url: "/pages/create/context" });
  },
  onCloseTap() {
    wx.redirectTo({ url: "/pages/create/context" });
  }
});
