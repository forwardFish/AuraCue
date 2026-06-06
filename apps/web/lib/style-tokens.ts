import type { CSSProperties } from "react";
import {
  backgroundTreatments,
  borderTokens,
  colorTokens,
  ctaTokens,
  radiusTokens,
  shadowTokens,
  spacingTokens,
  typographyTokens,
  zDepthTokens
} from "@auracue/ui-tokens";

export const webShellTokens = {
  colors: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  shadows: shadowTokens,
  borders: borderTokens,
  zDepth: zDepthTokens,
  backgrounds: backgroundTreatments,
  ctas: ctaTokens
} as const;

export function createGlobalTokenStyle(): CSSProperties {
  return {
    "--auracue-ink": colorTokens.ink.navy900,
    "--auracue-muted": colorTokens.ink.muted600,
    "--auracue-cream": colorTokens.surface.cream100,
    "--auracue-surface": colorTokens.surface.cream050,
    "--auracue-surface-soft": colorTokens.surface.cream200,
    "--auracue-coral": colorTokens.accent.coral500,
    "--auracue-coral-strong": colorTokens.accent.coral600,
    "--auracue-gold": colorTokens.accent.gold500,
    "--auracue-error": colorTokens.semantic.errorRose,
    "--auracue-success": colorTokens.semantic.successWeChat,
    "--auracue-radius-card": `${radiusTokens.md}px`,
    "--auracue-radius-shell": `${radiusTokens.lg}px`,
    "--auracue-shadow-card": shadowTokens.softCard,
    "--auracue-shadow-raised": shadowTokens.raisedCard,
    "--auracue-font-sans": typographyTokens.fontFamily.sans.join(", "),
    "--auracue-shell-max-width": `${spacingTokens.layout.maxPhoneWidth}px`,
    "--auracue-bottom-action-height": `${spacingTokens.layout.bottomActionHeight}px`
  } as CSSProperties;
}
