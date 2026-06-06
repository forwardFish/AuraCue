export function createLocalAnalyticsClient({ apiClient, store }) {
  return {
    async track(eventName, page, properties = {}) {
      const event = { eventName, page, properties };
      const response = await apiClient.recordAnalyticsEvent(event);
      store.trackAnalytics({ ...event, analyticsEventId: response.analyticsEventId });
      return response;
    }
  };
}
