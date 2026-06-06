import type { AuraGenerationPromptInput, AuraProvider, AuraProviderResult } from "./schemas";
import { validateAuraCardContent } from "./schemas";

const sceneProfiles: Record<string, {
  title: string;
  auraName: string;
  tarotSymbol: string;
  luckyColor: string;
  accent: string;
  social: string;
}> = {
  date: {
    title: "Tonight's Lucky Aura Card",
    auraName: "Rose Lantern Aura",
    tarotSymbol: "The Star",
    luckyColor: "rose quartz",
    accent: "champagne gold",
    social: "Open with a warm compliment and one clear question."
  },
  work: {
    title: "Meeting Glow Aura Card",
    auraName: "Clear Signal Aura",
    tarotSymbol: "The Magician",
    luckyColor: "soft ivory",
    accent: "polished jade",
    social: "Lead with the simplest point and leave room for one thoughtful pause."
  },
  party: {
    title: "Social Spark Aura Card",
    auraName: "Golden Comet Aura",
    tarotSymbol: "The Sun",
    luckyColor: "warm gold",
    accent: "berry gloss",
    social: "Join the first friendly circle and ask what made their week brighter."
  },
  luck: {
    title: "Light Luck Aura Card",
    auraName: "Moonlit Clover Aura",
    tarotSymbol: "Wheel of Fortune",
    luckyColor: "misty green",
    accent: "pearl white",
    social: "Pick the low-pressure option first and let the next step stay easy."
  }
};

const energyProfiles: Record<string, {
  message: string;
  outfit: string;
  beauty: string;
  ritual: string;
  avoid: string;
}> = {
  confidence: {
    message: "A small confident choice can make the next moment feel easier.",
    outfit: "Wear one clean line with a soft highlight near the face.",
    beauty: "Keep the glow fresh and the finish light.",
    ritual: "Take three slow breaths before stepping out.",
    avoid: "Avoid over-planning the first ten minutes."
  },
  luck: {
    message: "A simple cue can help you notice the opening that is already nearby.",
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

export function createMockAuraProvider(): AuraProvider {
  return {
    name: "mock",
    async generate(input) {
      return buildMockAuraProviderResult(input, "mock");
    }
  };
}

export function buildMockAuraProviderResult(input: AuraGenerationPromptInput, provider: string): AuraProviderResult {
  const scene = sceneProfiles[input.scene] ?? sceneProfiles.luck;
  const energy = energyProfiles[input.energy] ?? energyProfiles.calm;
  const generatedAt = new Date().toISOString();
  const content = validateAuraCardContent({
    title: scene.title,
    auraName: scene.auraName,
    tarotSymbol: scene.tarotSymbol,
    message: energy.message,
    luckyColor: scene.luckyColor,
    colors: {
      primary: scene.luckyColor,
      accent: scene.accent,
      background: "warm moonlight"
    },
    outfit: energy.outfit,
    beauty: energy.beauty,
    social: scene.social,
    ritual: energy.ritual,
    avoid: energy.avoid,
    caption: `Today I am carrying ${scene.auraName.toLowerCase()}.`,
    theme: `${input.scene}-${input.energy}-local`,
    cardTitle: scene.title,
    auraColor: scene.luckyColor,
    luckyColors: [scene.luckyColor, scene.accent],
    styleVibe: `${scene.auraName} with ${scene.accent}`,
    energyMessage: energy.message,
    outfitEnergy: energy.outfit,
    beautyCue: energy.beauty,
    socialMove: scene.social,
    miniRitual: energy.ritual,
    todayIntention: `I carry ${input.energy} with ease.`,
    luckyAnchorCandidates: [
      { type: "lucky_color", label: scene.luckyColor },
      { type: "outfit_detail", label: scene.accent }
    ],
    luckyAnchorSuggestions: [
      { type: "lucky_color", label: scene.luckyColor },
      { type: "outfit_detail", label: scene.accent }
    ],
    generatedAt,
    generationSource: "local-fallback",
    fallbackUsed: true
  });

  return {
    content,
    provider,
    generationSource: "local-fallback",
    fallbackUsed: true,
    transcript: {
      provider,
      mode: "deterministic-mock",
      scene: input.scene,
      energy: input.energy,
      drawSeed: input.drawSeed,
      drawPosition: input.drawPosition,
      outputFields: Object.keys(content).sort()
    }
  };
}
