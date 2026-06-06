export const shellFixtureIds = {
  anonymousUserId: "user-local-001",
  cardId: "card-locked-001",
  unlockedCardId: "card-unlocked-001",
  savedCardId: "card-saved-001",
  jobId: "job-success-001",
  failedJobId: "job-failed-001",
  inviteCode: "INVITE-LOCAL-001",
  paymentOrderId: "order-paid-001"
};

export const shellRouteParams = {
  id: shellFixtureIds.cardId,
  code: shellFixtureIds.inviteCode
};

export const sceneOptions = ["date", "work", "party", "luck"];
export const energyOptions = ["confidence", "luck", "love", "calm", "charm", "focus"];

export function makeFreeCard(cardId = shellFixtureIds.cardId) {
  return {
    cardId,
    view: "free",
    locked: true,
    auraName: "Soft Glow Aura",
    luckyColor: "Champagne Gold",
    oneLineReminder: "Step into tonight with calm confidence.",
    previewImage: {
      variant: "low-res-watermarked",
      localPath: `local://cards/${cardId}/preview-watermarked.png`,
      watermark: "AuraCue Preview",
      blurred: true
    },
    lockedPreview: {
      fullContentAvailable: false,
      unlockRequired: true,
      hiddenFields: ["outfit", "beauty", "social", "ritual", "avoid", "caption", "theme"]
    }
  };
}

export function makeFullCard(cardId = shellFixtureIds.unlockedCardId) {
  return {
    cardId,
    view: "full",
    locked: false,
    entitlement: {
      entitled: true,
      entitlementId: "entitlement-paid-001",
      method: "payment"
    },
    card: {
      title: "Full Lucky Aura Card",
      auraName: "Golden Comet Aura",
      tarotSymbol: "The Star",
      message: "Your best signal today is warm certainty.",
      luckyColor: "Champagne Gold",
      colors: {
        primary: "#f4c76b",
        accent: "#8d5bff",
        background: "#160f24"
      },
      outfit: "A clean light layer with one luminous accessory.",
      beauty: "Soft highlight and a confident lip tint.",
      social: "Open with a sincere compliment.",
      ritual: "Take three slow breaths before entering the room.",
      avoid: "Do not rush into a promise before you feel ready.",
      caption: "Tonight I am choosing the brighter signal.",
      theme: "golden-night"
    },
    shareImagePath: `local://share-images/${cardId}-story.png`,
    savedAt: null
  };
}
