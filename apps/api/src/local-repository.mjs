import { buildLocalAuraCard } from "../../../packages/prompt-core/src/local-generator.mjs";
import { buildLocalShareRenderMetadata } from "../../../packages/card-renderer/src/local-renderer.mjs";

const fixedNow = "2026-05-26T00:00:00.000Z";

export const localRepositoryMode = {
  storage: "deterministic-json-repository",
  liveServiceWritesAllowed: false,
  entities: [
    "users",
    "aura_cards",
    "generation_jobs",
    "card_templates",
    "share_events",
    "analytics_events",
    "payment_orders",
    "user_entitlements"
  ]
};

export const repositorySchema = {
  users: ["id", "anonymousId", "createdAt"],
  aura_cards: [
    "id",
    "userId",
    "jobId",
    "scene",
    "energy",
    "content",
    "isUnlocked",
    "savedAt",
    "shareImagePath",
    "createdAt"
  ],
  generation_jobs: [
    "id",
    "userId",
    "scene",
    "energy",
    "status",
    "cardId",
    "errorCode",
    "createdAt",
    "completedAt"
  ],
  card_templates: ["id", "name", "format", "version"],
  share_events: ["id", "userId", "cardId", "channel", "source", "inviteCode", "friendId", "createdAt"],
  analytics_events: ["id", "userId", "eventName", "page", "properties", "createdAt"],
  payment_orders: ["id", "userId", "cardId", "amount", "currency", "status", "createdAt", "completedAt"],
  user_entitlements: ["id", "userId", "cardId", "method", "orderId", "createdAt"]
};

export const repositoryMethodCoverage = {
  "API-001": ["createGenerationJob", "readGenerationJob"],
  "API-002": ["readGenerationJob", "completeGenerationJob"],
  "API-003": ["readAuraCard", "readEntitlementForCard"],
  "API-004": ["unlockCard", "readEntitlementForCard"],
  "API-005": ["createMockPaymentOrder", "completeMockPaymentOrder", "readPaymentOrder"],
  "API-006": ["recordInviteEvent", "readInviteProgress", "readEntitlementForCard"],
  "API-007": ["saveCard", "readAuraCard"],
  "API-008": ["recordShareEvent", "readShareEvent"],
  "API-009": ["renderShareImage", "readRenderedShareImage", "readCardTemplate", "readAuraCard"],
  "API-010": ["recordAnalyticsEvent", "readAnalyticsEvents"]
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nextId(prefix, collection) {
  return `${prefix}-${String(collection.length + 1).padStart(3, "0")}`;
}

function makeCardContent(variant) {
  const base = buildLocalAuraCard({
    scene: variant === "unlocked" ? "party" : "date",
    energy: variant === "unlocked" ? "charm" : "confidence"
  });
  return {
    ...base,
    title: variant === "unlocked" ? "Full Lucky Aura Card" : "Tonight's Lucky Aura Preview",
    auraName: variant === "unlocked" ? "Golden Comet Aura" : "Soft Glow Aura",
    theme: variant === "unlocked" ? "golden-night" : "soft-preview"
  };
}

export function createSeedData() {
  const user = { id: "user-local-001", anonymousId: "anon-local-001", createdAt: fixedNow };
  const lockedCard = {
    id: "card-locked-001",
    userId: user.id,
    jobId: "job-success-001",
    scene: "date",
    energy: "confidence",
    content: makeCardContent("locked"),
    isUnlocked: false,
    savedAt: null,
    shareImagePath: null,
    createdAt: fixedNow
  };
  const unlockedCard = {
    id: "card-unlocked-001",
    userId: user.id,
    jobId: "job-success-002",
    scene: "party",
    energy: "charm",
    content: makeCardContent("unlocked"),
    isUnlocked: true,
    savedAt: null,
    shareImagePath: "local://share-images/card-unlocked-001-story.png",
    createdAt: fixedNow
  };
  const savedCard = {
    id: "card-saved-001",
    userId: user.id,
    jobId: "job-success-003",
    scene: "work",
    energy: "focus",
    content: makeCardContent("unlocked"),
    isUnlocked: true,
    savedAt: "2026-05-26T00:05:00.000Z",
    shareImagePath: "local://share-images/card-saved-001-story.png",
    createdAt: fixedNow
  };

  return {
    users: [user],
    aura_cards: [lockedCard, unlockedCard, savedCard],
    generation_jobs: [
      {
        id: "job-success-001",
        userId: user.id,
        scene: "date",
        energy: "confidence",
        status: "success",
        cardId: lockedCard.id,
        errorCode: null,
        createdAt: fixedNow,
        completedAt: "2026-05-26T00:00:05.000Z"
      },
      {
        id: "job-success-002",
        userId: user.id,
        scene: "party",
        energy: "charm",
        status: "success",
        cardId: unlockedCard.id,
        errorCode: null,
        createdAt: fixedNow,
        completedAt: "2026-05-26T00:00:06.000Z"
      },
      {
        id: "job-failed-001",
        userId: user.id,
        scene: "luck",
        energy: "calm",
        status: "failed",
        cardId: null,
        errorCode: "LOCAL_GENERATION_FAILURE",
        createdAt: fixedNow,
        completedAt: "2026-05-26T00:00:07.000Z"
      }
    ],
    card_templates: [{ id: "template-story-001", name: "AuraCue Story 9:16", format: "story-9x16", version: "1.0.0" }],
    share_events: [
      {
        id: "share-001",
        userId: user.id,
        cardId: unlockedCard.id,
        channel: "story",
        source: "seed-share",
        inviteCode: null,
        friendId: null,
        createdAt: "2026-05-26T00:02:00.000Z"
      },
      {
        id: "invite-001",
        userId: user.id,
        cardId: lockedCard.id,
        channel: "copy_link",
        source: "invite-progress",
        inviteCode: "INVITE-LOCAL-001",
        friendId: "friend-001",
        createdAt: "2026-05-26T00:03:00.000Z"
      }
    ],
    analytics_events: [
      {
        id: "analytics-001",
        userId: user.id,
        eventName: "page_view_home",
        page: "/",
        properties: { source: "seed" },
        createdAt: fixedNow
      },
      {
        id: "analytics-002",
        userId: user.id,
        eventName: "select_scene",
        page: "/create/scene",
        properties: { scene: "date" },
        createdAt: "2026-05-26T00:01:00.000Z"
      }
    ],
    payment_orders: [
      {
        id: "order-paid-001",
        userId: user.id,
        cardId: unlockedCard.id,
        amount: 1.99,
        currency: "USD",
        status: "paid",
        createdAt: fixedNow,
        completedAt: "2026-05-26T00:04:00.000Z"
      },
      {
        id: "order-failed-001",
        userId: user.id,
        cardId: lockedCard.id,
        amount: 1.99,
        currency: "USD",
        status: "failed",
        createdAt: fixedNow,
        completedAt: "2026-05-26T00:04:30.000Z"
      }
    ],
    user_entitlements: [
      {
        id: "entitlement-paid-001",
        userId: user.id,
        cardId: unlockedCard.id,
        method: "payment",
        orderId: "order-paid-001",
        createdAt: "2026-05-26T00:04:00.000Z"
      }
    ]
  };
}

export function createLocalRepository(seed = createSeedData()) {
  const db = clone(seed);

  function requireCard(cardId) {
    const card = db.aura_cards.find((item) => item.id === cardId);
    if (!card) {
      throw new Error(`Card not found: ${cardId}`);
    }
    return card;
  }

  return {
    snapshot() {
      return clone(db);
    },
    schemaSummary() {
      return {
        mode: localRepositoryMode.storage,
        liveServiceWritesAllowed: localRepositoryMode.liveServiceWritesAllowed,
        entities: clone(repositorySchema),
        methodCoverage: clone(repositoryMethodCoverage)
      };
    },
    fixtureManifest() {
      return {
        lockedCardId: "card-locked-001",
        unlockedCardId: "card-unlocked-001",
        failedJobId: "job-failed-001",
        inviteProgressCardId: "card-locked-001",
        paymentSuccessOrderId: "order-paid-001",
        paymentFailureOrderId: "order-failed-001",
        savedCardId: "card-saved-001",
        shareEventId: "share-001",
        analyticsEventIds: db.analytics_events.map((event) => event.id),
        uiStateCoverage: ["UI-05", "UI-06", "UI-07", "UI-08", "UI-09", "UI-10", "UI-11", "UI-12", "UI-13", "UI-14", "UI-15", "UI-16", "UI-17", "UI-18"]
      };
    },
    readUser(userId) {
      return clone(db.users.find((user) => user.id === userId) ?? null);
    },
    createGenerationJob({ userId = "user-local-001", scene, energy, forceFailure = false }) {
      const job = {
        id: nextId("job", db.generation_jobs),
        userId,
        scene,
        energy,
        status: forceFailure ? "failed" : "pending",
        cardId: null,
        errorCode: forceFailure ? "LOCAL_GENERATION_FAILURE" : null,
        createdAt: fixedNow,
        completedAt: forceFailure ? fixedNow : null
      };
      db.generation_jobs.push(job);
      return clone(job);
    },
    completeGenerationJob(jobId, cardContent = null) {
      const job = db.generation_jobs.find((item) => item.id === jobId);
      if (!job) {
        throw new Error(`Job not found: ${jobId}`);
      }
      if (job.status === "failed") {
        return clone({ job, card: null });
      }
      if (job.status === "success") {
        return clone({ job, card: db.aura_cards.find((card) => card.id === job.cardId) ?? null });
      }
      const card = {
        id: nextId("card", db.aura_cards),
        userId: job.userId,
        jobId: job.id,
        scene: job.scene,
        energy: job.energy,
        content: cardContent ?? buildLocalAuraCard({ scene: job.scene, energy: job.energy }),
        isUnlocked: false,
        savedAt: null,
        shareImagePath: null,
        createdAt: fixedNow
      };
      db.aura_cards.push(card);
      job.status = "success";
      job.cardId = card.id;
      job.completedAt = fixedNow;
      return clone({ job, card });
    },
    readGenerationJob(jobId) {
      return clone(db.generation_jobs.find((job) => job.id === jobId) ?? null);
    },
    readAuraCard(cardId) {
      return clone(db.aura_cards.find((card) => card.id === cardId) ?? null);
    },
    readEntitlementForCard(cardId, userId = "user-local-001") {
      return clone(db.user_entitlements.find((item) => item.cardId === cardId && item.userId === userId) ?? null);
    },
    unlockCard({ cardId, userId = "user-local-001", method, orderId = null }) {
      const existing = db.user_entitlements.find((item) => item.cardId === cardId && item.userId === userId);
      if (existing) {
        return clone(existing);
      }
      const card = requireCard(cardId);
      card.isUnlocked = true;
      const entitlement = {
        id: nextId("entitlement", db.user_entitlements),
        userId,
        cardId,
        method,
        orderId,
        createdAt: fixedNow
      };
      db.user_entitlements.push(entitlement);
      return clone(entitlement);
    },
    createMockPaymentOrder({ userId = "user-local-001", cardId, amount = 1.99, currency = "USD" }) {
      requireCard(cardId);
      const order = {
        id: nextId("order", db.payment_orders),
        userId,
        cardId,
        amount,
        currency,
        status: "pending",
        createdAt: fixedNow,
        completedAt: null
      };
      db.payment_orders.push(order);
      return clone(order);
    },
    completeMockPaymentOrder(orderId, result) {
      const order = db.payment_orders.find((item) => item.id === orderId);
      if (!order) {
        throw new Error(`Order not found: ${orderId}`);
      }
      order.status = result === "success" ? "paid" : "failed";
      order.completedAt = fixedNow;
      const entitlement = result === "success"
        ? this.unlockCard({ cardId: order.cardId, userId: order.userId, method: "payment", orderId: order.id })
        : null;
      return clone({ order, entitlement });
    },
    readPaymentOrder(orderId) {
      return clone(db.payment_orders.find((order) => order.id === orderId) ?? null);
    },
    recordInviteEvent({ userId = "user-local-001", cardId, action, inviteCode = "INVITE-LOCAL-001", friendId = null }) {
      requireCard(cardId);
      const duplicate = friendId
        ? db.share_events.find((event) => event.cardId === cardId && event.friendId === friendId && event.inviteCode === inviteCode)
        : null;
      if (!duplicate) {
        db.share_events.push({
          id: nextId(action === "friend_accept" ? "invite" : "share", db.share_events),
          userId,
          cardId,
          channel: action === "copy" ? "copy_link" : "wechat",
          source: `invite-${action}`,
          inviteCode,
          friendId,
          createdAt: fixedNow
        });
      }
      const progress = this.readInviteProgress(cardId, inviteCode);
      if (progress.completed) {
        this.unlockCard({ cardId, userId, method: "invite" });
      }
      return progress;
    },
    readInviteProgress(cardId, inviteCode = "INVITE-LOCAL-001") {
      const uniqueFriends = new Set(
        db.share_events
          .filter((event) => event.cardId === cardId && event.inviteCode === inviteCode && event.friendId)
          .map((event) => event.friendId)
      );
      const progress = uniqueFriends.size;
      return { progress, required: 3, completed: progress >= 3 };
    },
    saveCard(cardId) {
      const card = requireCard(cardId);
      card.savedAt = card.savedAt ?? fixedNow;
      return clone({ saved: true, card });
    },
    recordShareEvent({ userId = "user-local-001", cardId, channel, source }) {
      requireCard(cardId);
      const shareEvent = {
        id: nextId("share", db.share_events),
        userId,
        cardId,
        channel,
        source,
        inviteCode: null,
        friendId: null,
        createdAt: fixedNow
      };
      db.share_events.push(shareEvent);
      return clone(shareEvent);
    },
    readShareEvent(shareEventId) {
      return clone(db.share_events.find((event) => event.id === shareEventId) ?? null);
    },
    readCardTemplate(templateId) {
      return clone(db.card_templates.find((template) => template.id === templateId) ?? null);
    },
    renderShareImage({ cardId, templateId = "template-story-001", format = "story-9x16" }) {
      const card = requireCard(cardId);
      const template = db.card_templates.find((item) => item.id === templateId && item.format === format);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }
      const rendered = buildLocalShareRenderMetadata({ card, template: {
        templateId: template.id,
        aspectRatio: "9:16",
        renderer: "deterministic-local-renderer",
        format: template.format,
        width: 1080,
        height: 1920
      } });
      card.shareImagePath = rendered.localPath;
      return clone(rendered);
    },
    readRenderedShareImage(cardId) {
      const card = requireCard(cardId);
      if (!card.shareImagePath) {
        return null;
      }
      return clone({
        cardId,
        localPath: card.shareImagePath,
        persistedOnCard: true
      });
    },
    recordAnalyticsEvent({ userId = "user-local-001", eventName, page, properties = {} }) {
      const event = {
        id: nextId("analytics", db.analytics_events),
        userId,
        eventName,
        page,
        properties,
        createdAt: fixedNow
      };
      db.analytics_events.push(event);
      return clone(event);
    },
    readAnalyticsEvents({ userId = "user-local-001", eventName } = {}) {
      return clone(db.analytics_events.filter((event) => event.userId === userId && (!eventName || event.eventName === eventName)));
    },
    seedReadback() {
      return {
        schemaEntities: Object.keys(repositorySchema),
        fixtureManifest: this.fixtureManifest(),
        counts: Object.fromEntries(Object.entries(db).map(([entity, rows]) => [entity, rows.length])),
        lockedCard: this.readAuraCard("card-locked-001"),
        unlockedCard: this.readAuraCard("card-unlocked-001"),
        failedJob: this.readGenerationJob("job-failed-001"),
        inviteProgress: this.readInviteProgress("card-locked-001"),
        paymentSuccess: this.readPaymentOrder("order-paid-001"),
        paymentFailure: this.readPaymentOrder("order-failed-001"),
        savedCard: this.readAuraCard("card-saved-001"),
        shareEvent: this.readShareEvent("share-001"),
        analyticsEvents: this.readAnalyticsEvents()
      };
    }
  };
}

export function repositoryHealth() {
  const repository = createLocalRepository();
  return {
    status: "ready",
    mode: localRepositoryMode.storage,
    entities: localRepositoryMode.entities,
    seedCounts: repository.seedReadback().counts
  };
}
