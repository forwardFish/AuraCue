import type {
  AnalyticsEventRequest,
  AnalyticsEventResponse,
  AuraCueApiClientContract,
  CardResultResponse,
  CardResultView,
  CompleteMockPaymentOrderRequest,
  CreateGenerationJobRequest,
  CreateGenerationJobResponse,
  CreateMockPaymentOrderRequest,
  GenerationJobResponse,
  InviteEventRequest,
  InviteProgressResponse,
  MockPaymentOrderResponse,
  SaveCardRequest,
  SaveCardResponse,
  ShareEventRequest,
  ShareEventResponse,
  ShareImageRequest,
  ShareImageResponse,
  UnlockMockRequest,
  UnlockMockResponse
} from "../../../../packages/shared-types/src/index";

export type ApiEndpointId =
  | "API-001"
  | "API-002"
  | "API-003"
  | "API-004"
  | "API-005"
  | "API-006"
  | "API-007"
  | "API-008"
  | "API-009"
  | "API-010";

export type ApiEndpointDefinition = {
  apiId: ApiEndpointId;
  method: "GET" | "POST";
  path: string;
  clientMethod: keyof AuraCueApiClientContract;
};

export const apiEndpointDefinitions: ApiEndpointDefinition[] = [
  { apiId: "API-001", method: "POST", path: "/api/generation-jobs", clientMethod: "createGenerationJob" },
  { apiId: "API-002", method: "GET", path: "/api/generation-jobs/:jobId", clientMethod: "getGenerationJob" },
  { apiId: "API-003", method: "GET", path: "/api/cards/:cardId", clientMethod: "getCard" },
  { apiId: "API-004", method: "POST", path: "/api/cards/:cardId/unlock/mock", clientMethod: "unlockCard" },
  { apiId: "API-005", method: "POST", path: "/api/payment-orders/mock", clientMethod: "createMockPaymentOrder" },
  { apiId: "API-005", method: "POST", path: "/api/payment-orders/mock/:orderId/complete", clientMethod: "completeMockPaymentOrder" },
  { apiId: "API-006", method: "POST", path: "/api/invites/:cardId/events", clientMethod: "recordInviteEvent" },
  { apiId: "API-007", method: "POST", path: "/api/cards/:cardId/save", clientMethod: "saveCard" },
  { apiId: "API-008", method: "POST", path: "/api/share-events", clientMethod: "recordShareEvent" },
  { apiId: "API-009", method: "POST", path: "/api/share-images/:cardId", clientMethod: "renderShareImage" },
  { apiId: "API-010", method: "POST", path: "/api/analytics-events", clientMethod: "recordAnalyticsEvent" }
];

export type FixtureApiClient = {
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
