import { assertSafeCopy } from "./safety-copy-guard.mjs";

const sceneProfiles = {
  date: {
    title: "Tonight's Lucky Aura Card",
    auraName: "Rose Lantern Aura",
    tarotSymbol: "The Star",
    baseColor: "rose quartz",
    accentColor: "champagne gold",
    socialCue: "Open with a warm compliment and one clear question."
  },
  work: {
    title: "Meeting Glow Aura Card",
    auraName: "Clear Signal Aura",
    tarotSymbol: "The Magician",
    baseColor: "soft ivory",
    accentColor: "polished jade",
    socialCue: "Lead with the simplest point and leave room for one thoughtful pause."
  },
  party: {
    title: "Social Spark Aura Card",
    auraName: "Golden Comet Aura",
    tarotSymbol: "The Sun",
    baseColor: "warm gold",
    accentColor: "berry gloss",
    socialCue: "Join the first friendly circle and ask what made their week brighter."
  },
  luck: {
    title: "Light Luck Aura Card",
    auraName: "Moonlit Clover Aura",
    tarotSymbol: "Wheel of Fortune",
    baseColor: "misty green",
    accentColor: "pearl white",
    socialCue: "Pick the low-pressure option first and let the next step stay easy."
  }
};

const energyProfiles = {
  confidence: {
    message: "A small confident choice can make the next moment feel easier.",
    outfit: "Wear one clean line with a soft highlight near the face.",
    beauty: "Keep the glow fresh and the finish light.",
    ritual: "Take three slow breaths before stepping out.",
    avoid: "Avoid over-planning the first ten minutes."
  },
  luck: {
    message: "A simple lucky cue can help you notice the opening that is already nearby.",
    outfit: "Choose one bright detail that feels easy to carry.",
    beauty: "Add a gentle sheen where the light naturally lands.",
    ritual: "Name one thing you are ready to receive today.",
    avoid: "Avoid treating one small delay as a sign."
  },
  love: {
    message: "Soft attention and honest timing can make connection feel more natural.",
    outfit: "Pick a texture that feels comfortable when you move.",
    beauty: "Use a calm, warm tone rather than a dramatic change.",
    ritual: "Send one kind message before the evening starts.",
    avoid: "Avoid reading too much into a quiet pause."
  },
  calm: {
    message: "A steady pace can keep the day open without asking you to force anything.",
    outfit: "Choose balanced layers with one soft color near the collar.",
    beauty: "Keep the face fresh and reduce anything that feels heavy.",
    ritual: "Put both feet down and count five steady breaths.",
    avoid: "Avoid rushing to answer every signal at once."
  },
  charm: {
    message: "Warm presence can turn a small exchange into a memorable one.",
    outfit: "Use one playful accent and keep the rest effortless.",
    beauty: "Let one feature catch light while the rest stays natural.",
    ritual: "Smile at yourself once before you enter the room.",
    avoid: "Avoid performing for people who are not meeting your energy."
  },
  focus: {
    message: "Clear attention can make the useful path easier to choose.",
    outfit: "Wear a crisp shape with one grounded color.",
    beauty: "Keep the look neat, bright, and distraction-free.",
    ritual: "Write the one outcome that would make today feel complete.",
    avoid: "Avoid opening three new threads before the first one settles."
  }
};

export const validScenes = Object.keys(sceneProfiles);
export const validEnergies = Object.keys(energyProfiles);

export function buildLocalAuraCard({ scene, energy }) {
  const sceneProfile = sceneProfiles[scene];
  const energyProfile = energyProfiles[energy];

  if (!sceneProfile || !energyProfile) {
    throw new Error("Unsupported local generation input.");
  }

  return {
    title: sceneProfile.title,
    auraName: sceneProfile.auraName,
    tarotSymbol: sceneProfile.tarotSymbol,
    message: energyProfile.message,
    luckyColor: sceneProfile.baseColor,
    colors: {
      primary: sceneProfile.baseColor,
      accent: sceneProfile.accentColor,
      background: "warm moonlight"
    },
    outfit: energyProfile.outfit,
    beauty: energyProfile.beauty,
    social: sceneProfile.socialCue,
    ritual: energyProfile.ritual,
    avoid: energyProfile.avoid,
    caption: `Today I am carrying ${sceneProfile.auraName.toLowerCase()}.`,
    theme: `${scene}-${energy}-local`
  };
}

export function assertSafeLocalCopy(cardContent) {
  const result = assertSafeCopy(cardContent, { source: "local-generator-card" });
  return {
    safe: result.safe,
    matchedPattern: result.violations[0]?.matchedPattern ?? null,
    violations: result.violations,
    checkedTextCount: result.checkedTextCount,
    categories: result.categories
  };
}
