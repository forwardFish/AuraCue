export type SceneId = "date" | "work" | "party" | "luck";
export type EnergyId = "confidence" | "luck" | "love" | "calm" | "charm" | "focus";
export type GenerationJobStatus = "pending" | "success" | "failed";
export type PaymentOrderStatus = "pending" | "paid" | "failed";
export type UnlockMethod = "payment" | "invite" | "restore";
export type ShareChannel = "wechat" | "moments" | "copy_link" | "save_image" | "story";
export type AnalyticsEventName =
  | "page_view_home"
  | "page_view_share"
  | "page_view_save_success"
  | "click_generate_start"
  | "select_scene"
  | "select_energy"
  | "generation_started"
  | "generation_succeeded"
  | "generation_failed"
  | "click_unlock"
  | "mock_payment_started"
  | "mock_payment_completed"
  | "invite_started"
  | "share_started"
  | "share_channel_selected"
  | "share_image_rendered"
  | "card_saved"
  | "save_success_viewed";

export type UserRecord = {
  id: string;
  anonymousId: string;
  createdAt: string;
};

export type AuraCardContent = {
  title: string;
  auraName: string;
  tarotSymbol: string;
  message: string;
  luckyColor: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
  outfit: string;
  beauty: string;
  social: string;
  ritual: string;
  avoid: string;
  caption: string;
  theme: string;
};

export type AuraCardRecord = {
  id: string;
  userId: string;
  jobId: string;
  scene: SceneId;
  energy: EnergyId;
  content: AuraCardContent;
  isUnlocked: boolean;
  savedAt: string | null;
  shareImagePath: string | null;
  createdAt: string;
};

export type GenerationJobRecord = {
  id: string;
  userId: string;
  scene: SceneId;
  energy: EnergyId;
  status: GenerationJobStatus;
  cardId: string | null;
  errorCode: string | null;
  createdAt: string;
  completedAt: string | null;
};

export type CardTemplateRecord = {
  id: string;
  name: string;
  format: "story-9x16";
  version: string;
};

export type ShareEventRecord = {
  id: string;
  userId: string;
  cardId: string;
  channel: ShareChannel;
  source: string;
  inviteCode: string | null;
  friendId: string | null;
  createdAt: string;
};

export type AnalyticsEventRecord = {
  id: string;
  userId: string;
  eventName: string;
  page: string;
  properties: Record<string, string | number | boolean | null>;
  createdAt: string;
};

export type PaymentOrderRecord = {
  id: string;
  userId: string;
  cardId: string;
  amount: number;
  currency: "USD";
  status: PaymentOrderStatus;
  createdAt: string;
  completedAt: string | null;
};

export type UserEntitlementRecord = {
  id: string;
  userId: string;
  cardId: string;
  method: UnlockMethod;
  orderId: string | null;
  createdAt: string;
};

export type ApiErrorEnvelope = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export type CardResultView = "free" | "full";

export type FreeCardResultResponse = {
  cardId: string;
  view: "free";
  locked: true;
  auraName: string;
  luckyColor: string;
  oneLineReminder: string;
  previewImage: {
    variant: "low-res-watermarked";
    localPath: string;
    watermark: string;
    blurred: true;
  };
  lockedPreview: {
    fullContentAvailable: false;
    unlockRequired: true;
    hiddenFields: Array<keyof Pick<AuraCardContent, "outfit" | "beauty" | "social" | "ritual" | "avoid" | "caption" | "theme">>;
  };
};

export type FullCardResultResponse = {
  cardId: string;
  view: "full";
  locked: false;
  entitlement: {
    entitled: true;
    entitlementId: string;
    method: UnlockMethod;
  };
  card: AuraCardContent;
  shareImagePath: string | null;
  savedAt: string | null;
};

export type UnlockMockRequest = {
  method: UnlockMethod;
  orderId?: string | null;
};

export type UnlockMockResponse = {
  entitled: true;
  entitlementId: string;
  cardId: string;
  method: UnlockMethod;
  orderId: string | null;
};

export type CreateMockPaymentOrderRequest = {
  cardId: string;
  amount?: number;
  currency?: "USD";
};

export type MockPaymentOrderResponse = {
  orderId: string;
  cardId: string;
  amount: number;
  currency: "USD";
  status: PaymentOrderStatus;
  entitlement: UnlockMockResponse | null;
};

export type CompleteMockPaymentOrderRequest = {
  result: "success" | "failed";
};

export type InviteEventAction = "invite_started" | "copy" | "invite_again" | "friend_accept";

export type InviteEventRequest = {
  action: InviteEventAction;
  inviteCode?: string;
  friendId?: string | null;
};

export type InviteProgressResponse = {
  cardId: string;
  inviteCode: string;
  progress: number;
  required: 3;
  completed: boolean;
  entitlement: UnlockMockResponse | null;
};

export type SaveCardRequest = {
  source: string;
};

export type SaveCardResponse = {
  saved: true;
  cardId: string;
  savedAt: string;
};

export type ShareEventRequest = {
  cardId: string;
  channel: ShareChannel;
  source: string;
};

export type ShareEventResponse = {
  shareEventId: string;
  cardId: string;
  channel: ShareChannel;
  source: string;
};

export type ShareImageRequest = {
  templateId?: string;
  format?: "story-9x16";
};

export type ShareImageResponse = {
  cardId: string;
  templateId: string;
  format: "story-9x16";
  localPath: string;
  width: number;
  height: number;
  deterministicKey: string;
};

export type AnalyticsEventRequest = {
  eventName: AnalyticsEventName;
  page: string;
  properties?: Record<string, string | number | boolean | null>;
};

export type AnalyticsEventResponse = {
  accepted: true;
  analyticsEventId: string;
};

export type HealthResponse = {
  status: "ready";
  version: string;
  mode: "local-mock";
};

export type CreateGenerationJobRequest = {
  scene: SceneId;
  energy: EnergyId;
  locale?: string;
  source?: string;
  autoComplete?: boolean;
  forceFailure?: boolean;
};

export type CreateGenerationJobResponse = {
  jobId: string;
  status: GenerationJobStatus;
  cardId?: string;
  generationSource?: "ai" | "local-fallback";
};

export type GenerationJobResponse = {
  jobId: string;
  status: GenerationJobStatus;
  cardId: string | null;
  errorCode: string | null;
};

export type CardResultResponse = FreeCardResultResponse | FullCardResultResponse;

export type AuraCueApiClientContract = {
  createGenerationJob(request: CreateGenerationJobRequest): Promise<CreateGenerationJobResponse>;
  getGenerationJob(jobId: string): Promise<GenerationJobResponse>;
  getCard(cardId: string, view: CardResultView): Promise<CardResultResponse>;
  unlockCard(cardId: string, request: UnlockMockRequest): Promise<UnlockMockResponse>;
  createMockPaymentOrder(request: CreateMockPaymentOrderRequest): Promise<MockPaymentOrderResponse>;
  completeMockPaymentOrder(orderId: string, request: CompleteMockPaymentOrderRequest): Promise<MockPaymentOrderResponse>;
  recordInviteEvent(cardId: string, request: InviteEventRequest): Promise<InviteProgressResponse>;
  saveCard(cardId: string, request: SaveCardRequest): Promise<SaveCardResponse>;
  recordShareEvent(request: ShareEventRequest): Promise<ShareEventResponse>;
  renderShareImage(cardId: string, request: ShareImageRequest): Promise<ShareImageResponse>;
  recordAnalyticsEvent(request: AnalyticsEventRequest): Promise<AnalyticsEventResponse>;
};
