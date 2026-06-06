Page({
  data: {
    title: "Start Your Aura Journey",
    subtitle: "Choose today's mood to reveal your lucky aura card."
  },
  startAuraCard() {
    wx.navigateTo({ url: "/pages/create/context" });
  }
});
