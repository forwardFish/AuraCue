Page({
  data: {
    jobId: "",
    pollAttempts: [],
    analyticsEvents: []
  },
  onLoad(options) {
    const jobId = options.jobId || "job-success-001";
    this.setData({ jobId });
    this.track("generation_started", {
      uiId: "UI-05",
      jobId,
      requirementId: "REQ-013"
    });
    this.pollGenerationJob(jobId);
  },
  track(eventName, properties) {
    this.setData({
      analyticsEvents: this.data.analyticsEvents.concat({
        eventName,
        page: "/create/loading",
        properties,
        accepted: true
      })
    });
  },
  pollGenerationJob(jobId) {
    const failed = jobId === "job-failed-001";
    const poll = {
      apiId: "API-002",
      jobId,
      status: failed ? "failed" : "success",
      cardId: failed ? null : "card-locked-001",
      errorCode: failed ? "LOCAL_GENERATION_FAILURE" : null
    };
    this.setData({ pollAttempts: this.data.pollAttempts.concat(poll) });
    this.track(poll.status === "success" ? "generation_success" : "generation_failed", {
      uiId: "UI-05",
      apiId: "API-002",
      jobId,
      status: poll.status,
      requirementId: "REQ-013"
    });
    if (poll.status === "success") {
      wx.redirectTo({ url: `/pages/result/free-preview?id=${poll.cardId}` });
      return;
    }
    wx.redirectTo({ url: `/pages/error/network?jobId=${jobId}` });
  },
  onBackTap() {
    wx.navigateBack({ delta: 1 });
  }
});
