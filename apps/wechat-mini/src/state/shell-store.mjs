import { makeFreeCard, makeFullCard, shellFixtureIds } from "../fixtures/shell-fixtures.mjs";

export function createShellStore(initial = {}) {
  const state = {
    scene: null,
    energy: null,
    job: null,
    card: null,
    entitlement: null,
    invite: {
      inviteCode: shellFixtureIds.inviteCode,
      progress: 0,
      required: 3,
      completed: false
    },
    payment: null,
    shareSave: {
      saved: false,
      shareImagePath: null,
      lastShareEventId: null
    },
    error: null,
    analyticsEvents: [],
    ...initial
  };

  return {
    getState() {
      return structuredClone(state);
    },
    selectScene(scene) {
      state.scene = scene;
      return this.getState();
    },
    selectEnergy(energy) {
      state.energy = energy;
      return this.getState();
    },
    setJob(job) {
      state.job = job;
      return this.getState();
    },
    setCard(card) {
      state.card = card;
      return this.getState();
    },
    loadFreeCard(cardId = shellFixtureIds.cardId) {
      state.card = makeFreeCard(cardId);
      return this.getState();
    },
    loadFullCard(cardId = shellFixtureIds.unlockedCardId) {
      const card = makeFullCard(cardId);
      state.card = card;
      state.entitlement = card.entitlement;
      return this.getState();
    },
    setEntitlement(entitlement) {
      state.entitlement = entitlement;
      return this.getState();
    },
    setInvite(invite) {
      state.invite = { ...state.invite, ...invite };
      return this.getState();
    },
    setPayment(payment) {
      state.payment = payment;
      return this.getState();
    },
    setShareSave(shareSave) {
      state.shareSave = { ...state.shareSave, ...shareSave };
      return this.getState();
    },
    setError(error) {
      state.error = error;
      return this.getState();
    },
    trackAnalytics(event) {
      state.analyticsEvents.push(event);
      return this.getState();
    },
    resetError() {
      state.error = null;
      return this.getState();
    }
  };
}
